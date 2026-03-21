// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/report.js — Benchmark report: gather data to filesystem, LLM analyses via tools
//
// Pattern: write mechanical data to files on disk, give the LLM a concise summary
// pointing it at those files + tools, LLM investigates and calls report_analysis
// with structured findings. The handler writes the final report markdown.

import * as core from "@actions/core";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { readOptionalFile, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools, createGitTools } from "../../../copilot/github-tools.js";

const REPORT_DATA_DIR = "/tmp/report-data";

/**
 * Discover the most recent init workflow run timestamp via GitHub API.
 */
async function findLatestInitRun(octokit, owner, repo) {
  try {
    const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner, repo, per_page: 20,
    });
    const initRuns = data.workflow_runs
      .filter(r => r.name && r.name.includes("agentic-lib-init"))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (initRuns.length > 0) return initRuns[0].created_at;
  } catch (err) {
    core.warning(`Could not find init runs: ${err.message}`);
  }
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Gather all mechanical data and write it to files in REPORT_DATA_DIR.
 * Returns a summary object with counts and key facts.
 */
async function gatherAndWriteData(octokit, owner, repoName, periodStart, periodEnd, config) {
  mkdirSync(REPORT_DATA_DIR, { recursive: true });

  // 1. Config and state (already on disk, just copy references)
  const configContent = readOptionalFile(config._configPath || "agentic-lib.toml") || "";
  const stateContent = readOptionalFile("agentic-lib-state.toml") || "";
  const missionContent = readOptionalFile("MISSION.md") || "";
  writeFileSync(`${REPORT_DATA_DIR}/config.toml`, configContent);
  writeFileSync(`${REPORT_DATA_DIR}/state.toml`, stateContent);
  writeFileSync(`${REPORT_DATA_DIR}/mission.md`, missionContent);

  // 2. Workflow runs
  let workflowRuns = [];
  try {
    const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner, repo: repoName, per_page: 50, created: `${periodStart}..${periodEnd}`,
    });
    workflowRuns = data.workflow_runs.map(r => ({
      id: r.id, name: r.name, status: r.status, conclusion: r.conclusion,
      created_at: r.created_at, updated_at: r.updated_at, html_url: r.html_url,
    }));
  } catch (err) { core.warning(`Could not list runs: ${err.message}`); }
  writeFileSync(`${REPORT_DATA_DIR}/workflow-runs.json`, JSON.stringify(workflowRuns, null, 2));

  // 3. Commits
  let commits = [];
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner, repo: repoName, since: periodStart, until: periodEnd, per_page: 100,
    });
    commits = data.map(c => ({
      sha: c.sha.substring(0, 8), message: c.commit.message.split("\n")[0],
      author: c.commit.author?.name || "unknown", date: c.commit.author?.date || "",
    }));
  } catch (err) { core.warning(`Could not list commits: ${err.message}`); }
  writeFileSync(`${REPORT_DATA_DIR}/commits.json`, JSON.stringify(commits, null, 2));

  // 4. Issues (open + recently closed)
  let issues = [];
  for (const state of ["open", "closed"]) {
    try {
      const { data } = await octokit.rest.issues.listForRepo({
        owner, repo: repoName, state, since: periodStart, per_page: 50,
        sort: "created", direction: "desc",
      });
      for (const i of data) {
        if (i.pull_request) continue;
        issues.push({
          number: i.number, state: i.state, title: i.title,
          labels: i.labels.map(l => l.name), created_at: i.created_at,
          closed_at: i.closed_at,
        });
      }
    } catch { /* ignore */ }
  }
  writeFileSync(`${REPORT_DATA_DIR}/issues.json`, JSON.stringify(issues, null, 2));

  // 5. PRs (merged + open)
  let prs = [];
  for (const state of ["closed", "open"]) {
    try {
      const { data } = await octokit.rest.pulls.list({
        owner, repo: repoName, state, per_page: 30, sort: "created", direction: "desc",
      });
      for (const p of data) {
        if (state === "closed" && !p.merged_at) continue;
        if (new Date(p.created_at) < new Date(periodStart)) continue;
        prs.push({
          number: p.number, title: p.title, state: p.state,
          branch: p.head?.ref || "", merged_at: p.merged_at,
          additions: p.additions || 0, deletions: p.deletions || 0,
        });
      }
    } catch { /* ignore */ }
  }
  writeFileSync(`${REPORT_DATA_DIR}/pull-requests.json`, JSON.stringify(prs, null, 2));

  // 6. Mission status
  const missionComplete = existsSync("MISSION_COMPLETE.md");
  const missionFailed = existsSync("MISSION_FAILED.md");
  const completeContent = missionComplete ? readFileSync("MISSION_COMPLETE.md", "utf8") : "";
  const failedContent = missionFailed ? readFileSync("MISSION_FAILED.md", "utf8") : "";

  // Parse key state values
  let budgetUsed = 0, budgetCap = 0, totalTokens = 0, transforms = 0;
  const budgetUsedMatch = stateContent.match(/transformation-budget-used\s*=\s*(\d+)/);
  const budgetCapMatch = stateContent.match(/transformation-budget-cap\s*=\s*(\d+)/);
  const tokensMatch = stateContent.match(/total-tokens\s*=\s*(\d+)/);
  const transformsMatch = stateContent.match(/cumulative-transforms\s*=\s*(\d+)/);
  if (budgetUsedMatch) budgetUsed = parseInt(budgetUsedMatch[1]);
  if (budgetCapMatch) budgetCap = parseInt(budgetCapMatch[1]);
  if (tokensMatch) totalTokens = parseInt(tokensMatch[1]);
  if (transformsMatch) transforms = parseInt(transformsMatch[1]);

  return {
    periodStart, periodEnd,
    workflowRunCount: workflowRuns.length,
    commitCount: commits.length,
    issueCount: issues.length,
    openIssueCount: issues.filter(i => i.state === "open").length,
    closedIssueCount: issues.filter(i => i.state === "closed").length,
    prCount: prs.length,
    mergedPrCount: prs.filter(p => p.merged_at).length,
    missionComplete, missionFailed,
    completeContent, failedContent,
    budgetUsed, budgetCap, totalTokens, transforms,
    missionContent,
  };
}

/**
 * Build the concise prompt for the LLM (like supervisor's buildPrompt).
 */
function buildPrompt(summary, agentInstructions, repo) {
  return [
    "## Instructions",
    agentInstructions,
    "",
    "## Report Period",
    `Repository: ${repo.owner}/${repo.repo}`,
    `Period: ${summary.periodStart} → ${summary.periodEnd}`,
    "",
    "## Summary of Gathered Data",
    `Workflow runs: ${summary.workflowRunCount}`,
    `Commits: ${summary.commitCount}`,
    `Issues: ${summary.issueCount} (${summary.openIssueCount} open, ${summary.closedIssueCount} closed)`,
    `Pull requests: ${summary.prCount} (${summary.mergedPrCount} merged)`,
    `Cumulative transforms: ${summary.transforms}`,
    `Budget: ${summary.budgetUsed}/${summary.budgetCap} used`,
    `Total tokens consumed: ${summary.totalTokens}`,
    `Mission complete: ${summary.missionComplete ? "YES" : "NO"}`,
    `Mission failed: ${summary.missionFailed ? "YES" : "NO"}`,
    "",
    "## Data Files Available",
    "The following files contain the full mechanical data. Use `read_file` to examine them:",
    `- ${REPORT_DATA_DIR}/mission.md — MISSION.md with acceptance criteria`,
    `- ${REPORT_DATA_DIR}/config.toml — Full agentic-lib.toml configuration`,
    `- ${REPORT_DATA_DIR}/state.toml — Full agentic-lib-state.toml persistent state`,
    `- ${REPORT_DATA_DIR}/workflow-runs.json — All ${summary.workflowRunCount} workflow runs with timing and URLs`,
    `- ${REPORT_DATA_DIR}/commits.json — All ${summary.commitCount} commits with messages`,
    `- ${REPORT_DATA_DIR}/issues.json — All ${summary.issueCount} issues with labels and state`,
    `- ${REPORT_DATA_DIR}/pull-requests.json — All ${summary.prCount} PRs with branches and merge info`,
    "",
    "## Source Code and Tests",
    "Use `read_file` and `list_files` to examine the actual source code and tests:",
    "- `src/lib/main.js` — Main source file",
    "- `tests/unit/` — Unit test directory",
    "- `README.md` — Repository documentation",
    "",
    "## Your Task",
    "1. Read the mission file to extract acceptance criteria",
    "2. Read workflow-runs.json and pull-requests.json to build an iteration timeline",
    "3. Read source code to verify each acceptance criterion (PASS/FAIL/NOT TESTED)",
    "4. Read issues to understand what work was done and identify any churn",
    "5. Investigate any failures or anomalies you find — use get_issue for details",
    "6. Call `report_analysis` exactly once with your structured findings",
    "",
    "**You MUST call report_analysis exactly once.**",
  ].join("\n");
}

/**
 * Build the final report markdown from the LLM analysis.
 */
function buildReportMarkdown(summary, analysis, repo, model) {
  const now = new Date().toISOString().split("T")[0];
  const sections = [];

  sections.push(`# Benchmark Report`);
  sections.push(``);
  sections.push(`**Date**: ${now}`);
  sections.push(`**Repository**: ${repo.owner}/${repo.repo}`);
  sections.push(`**Period**: ${summary.periodStart} → ${summary.periodEnd}`);
  sections.push(`**Model**: ${model}`);
  sections.push(``);
  sections.push(`---`);

  // Summary
  sections.push(``);
  sections.push(`## Summary`);
  sections.push(``);
  sections.push(analysis.summary || "(no summary provided)");

  // Configuration
  sections.push(``);
  sections.push(`---`);
  sections.push(``);
  sections.push(`## Configuration`);
  sections.push(``);
  sections.push(`| Parameter | Value |`);
  sections.push(`|-----------|-------|`);
  sections.push(`| Mission complete | ${summary.missionComplete ? "YES" : "NO"} |`);
  sections.push(`| Mission failed | ${summary.missionFailed ? "YES" : "NO"} |`);
  sections.push(`| Transforms | ${summary.transforms} |`);
  sections.push(`| Budget | ${summary.budgetUsed}/${summary.budgetCap} |`);
  sections.push(`| Total tokens | ${summary.totalTokens} |`);
  sections.push(`| Workflow runs | ${summary.workflowRunCount} |`);
  sections.push(`| Commits | ${summary.commitCount} |`);
  sections.push(`| PRs merged | ${summary.mergedPrCount} |`);
  sections.push(`| Issues (open/closed) | ${summary.openIssueCount}/${summary.closedIssueCount} |`);

  // Iteration narrative
  if (analysis.iteration_narrative) {
    sections.push(``);
    sections.push(`---`);
    sections.push(``);
    sections.push(`## Timeline`);
    sections.push(``);
    sections.push(analysis.iteration_narrative);
  }

  // Acceptance criteria
  if (analysis.acceptance_criteria?.length) {
    sections.push(``);
    sections.push(`---`);
    sections.push(``);
    sections.push(`## Acceptance Criteria`);
    sections.push(``);
    sections.push(`| Criterion | Status | Evidence |`);
    sections.push(`|-----------|--------|----------|`);
    for (const ac of analysis.acceptance_criteria) {
      sections.push(`| ${ac.criterion} | ${ac.status} | ${ac.evidence} |`);
    }
  }

  // Findings
  if (analysis.findings?.length) {
    sections.push(``);
    sections.push(`---`);
    sections.push(``);
    sections.push(`## Findings`);
    for (const f of analysis.findings) {
      sections.push(``);
      sections.push(`### ${f.id}: ${f.title} (${f.severity})`);
      sections.push(``);
      sections.push(f.description);
    }
  }

  // Recommendations
  if (analysis.recommendations?.length) {
    sections.push(``);
    sections.push(`---`);
    sections.push(``);
    sections.push(`## Recommendations`);
    sections.push(``);
    for (let i = 0; i < analysis.recommendations.length; i++) {
      sections.push(`${i + 1}. ${analysis.recommendations[i]}`);
    }
  }

  sections.push(``);
  return sections.join("\n");
}

/**
 * Build a mechanical-only fallback report (no LLM).
 */
function buildFallbackReport(summary, repo) {
  const now = new Date().toISOString().split("T")[0];
  return [
    `# Benchmark Report`,
    ``,
    `**Date**: ${now}`,
    `**Repository**: ${repo.owner}/${repo.repo}`,
    `**Period**: ${summary.periodStart} → ${summary.periodEnd}`,
    `**Generated by**: agentic-lib-report (mechanical — no LLM enrichment)`,
    ``,
    `---`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Mission complete | ${summary.missionComplete ? "YES" : "NO"} |`,
    `| Mission failed | ${summary.missionFailed ? "YES" : "NO"} |`,
    `| Transforms | ${summary.transforms} |`,
    `| Budget | ${summary.budgetUsed}/${summary.budgetCap} |`,
    `| Total tokens | ${summary.totalTokens} |`,
    `| Workflow runs | ${summary.workflowRunCount} |`,
    `| Commits | ${summary.commitCount} |`,
    `| PRs merged | ${summary.mergedPrCount} |`,
    `| Issues (open/closed) | ${summary.openIssueCount}/${summary.closedIssueCount} |`,
    ``,
    `> This report contains only mechanical data. LLM enrichment was not available.`,
    `> For a full report with findings and acceptance criteria verification, ensure COPILOT_GITHUB_TOKEN is set.`,
    ``,
  ].join("\n");
}

/**
 * Report task handler.
 */
export async function report(context) {
  const { config, octokit, repo, model } = context;
  const owner = repo.owner;
  const repoName = repo.repo;

  // Resolve period
  let periodStart = context.periodStart || "";
  let periodEnd = context.periodEnd || new Date().toISOString();
  if (!periodStart) {
    periodStart = await findLatestInitRun(octokit, owner, repoName);
    core.info(`period-start defaulted to latest init run: ${periodStart}`);
  }
  core.info(`Report period: ${periodStart} → ${periodEnd}`);

  // Gather all data and write to filesystem
  const summary = await gatherAndWriteData(octokit, owner, repoName, periodStart, periodEnd, config);
  core.info(`Gathered: ${summary.workflowRunCount} runs, ${summary.commitCount} commits, ${summary.issueCount} issues, ${summary.prCount} PRs`);

  // LLM enrichment (required for a proper report)
  let analysis = null;
  let tokensUsed = 0;
  let resultModel = model;

  if (process.env.COPILOT_GITHUB_TOKEN) {
    const agentInstructions = context.instructions || "You are a benchmark analyst. Investigate the data and produce findings.";

    const createTools = (defineTool, _wp, logger) => {
      const ghTools = createGitHubTools(octokit, repo, defineTool, logger);
      const gitTools = createGitTools(defineTool, logger);

      const reportTool = defineTool("report_analysis", {
        description: "Record your benchmark analysis. Call exactly once with structured findings, acceptance criteria verification, timeline narrative, and recommendations.",
        parameters: {
          type: "object",
          properties: {
            summary: { type: "string", description: "Executive summary — what happened in this benchmark period, key outcomes" },
            iteration_narrative: { type: "string", description: "Prose timeline: for each significant event, what happened, what changed, which PRs were created/merged" },
            acceptance_criteria: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  criterion: { type: "string" },
                  status: { type: "string", enum: ["PASS", "FAIL", "NOT TESTED"] },
                  evidence: { type: "string", description: "Specific file:line, function name, issue number, or test name" },
                },
                required: ["criterion", "status", "evidence"],
              },
              description: "Each acceptance criterion from MISSION.md verified against actual source code",
            },
            findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", description: "FINDING-N" },
                  title: { type: "string" },
                  severity: { type: "string", enum: ["POSITIVE", "CONCERN", "CRITICAL", "REGRESSION", "OBSERVATION"] },
                  description: { type: "string", description: "Include specific evidence: run IDs, issue numbers, file paths" },
                },
                required: ["id", "title", "severity", "description"],
              },
            },
            recommendations: { type: "array", items: { type: "string" } },
          },
          required: ["summary", "findings", "recommendations"],
        },
        handler: async (args) => {
          analysis = args;
          return { textResultForLlm: "Analysis recorded. The report will be generated from your findings." };
        },
      });

      return [...ghTools, ...gitTools, reportTool];
    };

    const prompt = buildPrompt(summary, agentInstructions, repo);

    const systemPrompt =
      "You are a benchmark analyst for an autonomous coding pipeline. " +
      "Your job is to investigate the gathered data using tools, verify acceptance criteria by reading source code, " +
      "trace the transformation timeline from workflow runs to PRs to commits, " +
      "and produce structured findings with specific evidence. " +
      "Use read_file to examine source code, tests, and data files. " +
      "Use list_issues and get_issue to understand work done. " +
      "Call report_analysis exactly once with your complete analysis." +
      NARRATIVE_INSTRUCTION;

    try {
      const result = await runCopilotSession({
        workspacePath: process.cwd(),
        model: model || config.model || "gpt-5-mini",
        tuning: config.tuning || {},
        agentPrompt: systemPrompt,
        userPrompt: prompt,
        writablePaths: [],
        createTools,
        excludedTools: ["write_file", "run_command", "run_tests"],
        logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
      });
      tokensUsed = result.tokensIn + result.tokensOut;
      resultModel = result.model || model;
      core.info(`Report LLM session completed: ${tokensUsed} tokens`);
    } catch (err) {
      core.warning(`LLM enrichment failed: ${err.message}`);
    }
  }

  // Build final report
  let finalReport;
  if (analysis) {
    finalReport = buildReportMarkdown(summary, analysis, repo, resultModel);
  } else {
    finalReport = buildFallbackReport(summary, repo);
  }

  const narrative = `Generated benchmark report for ${repo.owner}/${repo.repo}: ${summary.workflowRunCount} runs, ${summary.transforms} transforms, mission ${summary.missionComplete ? "complete" : summary.missionFailed ? "failed" : "in progress"}`;

  return {
    outcome: "report-generated",
    narrative,
    reportContent: finalReport,
    tokensUsed,
    model: resultModel,
  };
}
