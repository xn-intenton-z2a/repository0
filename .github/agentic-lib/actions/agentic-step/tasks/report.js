// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/report.js — Benchmark report: mechanical data gathering + optional LLM enrichment
//
// Gathers configuration, state, workflow runs, commits, issues, PRs, source code,
// test files, agent logs, screenshots, and website HTML for a given time period.
// Produces a structured markdown report comparable to what a Claude Code session
// would write following ITERATION_BENCHMARKS_SIMPLE.md.

import * as core from "@actions/core";
import { existsSync, readFileSync, readdirSync } from "fs";
import { readOptionalFile, scanDirectory, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools, createGitTools } from "../../../copilot/github-tools.js";

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
 * List workflow runs in the period.
 */
async function listWorkflowRuns(octokit, owner, repo, since, until) {
  const runs = [];
  try {
    const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner, repo, per_page: 50, created: `${since}..${until}`,
    });
    for (const r of data.workflow_runs) {
      runs.push({
        id: r.id, name: r.name, status: r.status, conclusion: r.conclusion,
        created_at: r.created_at, updated_at: r.updated_at,
        html_url: r.html_url,
      });
    }
  } catch (err) {
    core.warning(`Could not list workflow runs: ${err.message}`);
  }
  return runs;
}

/**
 * List commits in the period.
 */
async function listCommits(octokit, owner, repo, since, until) {
  const commits = [];
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner, repo, since, until, per_page: 100,
    });
    for (const c of data) {
      commits.push({
        sha: c.sha.substring(0, 8),
        message: c.commit.message.split("\n")[0],
        author: c.commit.author?.name || "unknown",
        date: c.commit.author?.date || "",
      });
    }
  } catch (err) {
    core.warning(`Could not list commits: ${err.message}`);
  }
  return commits;
}

/**
 * List issues (open + recently closed) with bodies for context.
 */
async function listIssues(octokit, owner, repo, since) {
  const issues = [];
  for (const state of ["open", "closed"]) {
    try {
      const { data } = await octokit.rest.issues.listForRepo({
        owner, repo, state, since, per_page: 50, sort: "created", direction: "desc",
      });
      for (const i of data) {
        if (i.pull_request) continue;
        issues.push({
          number: i.number, state: i.state, title: i.title,
          labels: i.labels.map(l => l.name).join(", "),
          created_at: i.created_at, closed_at: i.closed_at,
          body: i.body ? i.body.substring(0, 500) : "",
        });
      }
    } catch { /* ignore */ }
  }
  return issues;
}

/**
 * List PRs (merged + open) with diff stats.
 */
async function listPullRequests(octokit, owner, repo, since) {
  const prs = [];
  for (const state of ["closed", "open"]) {
    try {
      const { data } = await octokit.rest.pulls.list({
        owner, repo, state, per_page: 30, sort: "created", direction: "desc",
      });
      for (const p of data) {
        if (state === "closed" && !p.merged_at) continue;
        if (new Date(p.created_at) < new Date(since)) continue;
        prs.push({
          number: p.number, title: p.title, state: p.state,
          branch: p.head?.ref || "", merged_at: p.merged_at,
          created_at: p.created_at,
          additions: p.additions || 0, deletions: p.deletions || 0,
          changed_files: p.changed_files || 0,
        });
      }
    } catch { /* ignore */ }
  }
  return prs;
}

/**
 * Read source file contents (with size limit per file).
 */
function readSourceFiles(config) {
  const files = [];
  const MAX_CHARS = 5000;
  const srcPath = config.paths?.source?.path || "src/lib/main.js";
  const srcDir = "src/lib";

  // Collect all source files
  const filePaths = [];
  if (existsSync(srcPath)) filePaths.push(srcPath);
  if (existsSync(srcDir)) {
    try {
      for (const f of readdirSync(srcDir)) {
        const fp = `${srcDir}/${f}`;
        if (fp === srcPath) continue;
        if (f.endsWith(".js") || f.endsWith(".ts")) filePaths.push(fp);
      }
    } catch { /* ignore */ }
  }

  for (const fp of filePaths) {
    try {
      const content = readFileSync(fp, "utf8");
      files.push({
        file: fp,
        lines: content.split("\n").length,
        content: content.length > MAX_CHARS
          ? content.substring(0, MAX_CHARS) + `\n... (truncated at ${MAX_CHARS} chars, total ${content.length})`
          : content,
      });
    } catch { /* ignore */ }
  }
  return files;
}

/**
 * Read test file contents (with size limit).
 */
function readTestFiles() {
  const files = [];
  const MAX_CHARS = 3000;
  for (const dir of ["tests", "tests/unit", "__tests__"]) {
    if (!existsSync(dir)) continue;
    try {
      for (const f of readdirSync(dir)) {
        if (!f.endsWith(".test.js") && !f.endsWith(".test.ts") && !f.endsWith(".spec.js")) continue;
        const fp = `${dir}/${f}`;
        try {
          const content = readFileSync(fp, "utf8");
          files.push({
            file: fp,
            lines: content.split("\n").length,
            content: content.length > MAX_CHARS
              ? content.substring(0, MAX_CHARS) + `\n... (truncated)`
              : content,
          });
        } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
  }
  return files;
}

/**
 * Read agent log file contents (last N logs).
 */
function readAgentLogs(logPrefix, maxLogs = 10) {
  const logDir = logPrefix.includes("/") ? logPrefix.substring(0, logPrefix.lastIndexOf("/")) : ".";
  const logBase = logPrefix.includes("/") ? logPrefix.substring(logPrefix.lastIndexOf("/") + 1) : logPrefix;
  const logs = [];
  try {
    const allLogs = readdirSync(logDir)
      .filter(f => f.startsWith(logBase) && f.endsWith(".md"))
      .sort();
    // Take the most recent N logs
    const recent = allLogs.slice(-maxLogs);
    for (const f of recent) {
      const fp = logDir === "." ? f : `${logDir}/${f}`;
      try {
        const content = readFileSync(fp, "utf8");
        // Extract key info: first 80 lines
        const lines = content.split("\n");
        logs.push({
          file: f,
          excerpt: lines.slice(0, 80).join("\n"),
          totalLines: lines.length,
        });
      } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
  return logs;
}

/**
 * Extract acceptance criteria from MISSION.md.
 * Looks for bullet points, numbered lists, or "Acceptance Criteria" sections.
 */
function extractAcceptanceCriteria(missionContent) {
  if (!missionContent) return [];
  const criteria = [];
  const lines = missionContent.split("\n");
  let inCriteria = false;
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("acceptance") || lower.includes("criteria") || lower.includes("requirements")) {
      inCriteria = true;
      continue;
    }
    if (inCriteria && /^#+\s/.test(line) && !lower.includes("criteria")) {
      inCriteria = false;
    }
    if (inCriteria) {
      const match = line.match(/^[\s]*[-*]\s+(.+)/) || line.match(/^[\s]*\d+\.\s+(.+)/);
      if (match) criteria.push(match[1].trim());
    }
  }
  // If no explicit criteria section found, extract all bullet points as potential criteria
  if (criteria.length === 0) {
    for (const line of lines) {
      const match = line.match(/^[\s]*[-*]\s+(.+)/);
      if (match && match[1].length > 10) criteria.push(match[1].trim());
    }
  }
  return criteria;
}

/**
 * Read website HTML if available (placed by workflow).
 */
function readWebsiteHtml() {
  const path = "/tmp/website.html";
  if (existsSync(path)) {
    const content = readFileSync(path, "utf8");
    // Extract meaningful text content (strip tags, keep first 2000 chars)
    const textContent = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return {
      rawLength: content.length,
      textSummary: textContent.substring(0, 2000),
      hasContent: textContent.length > 100,
    };
  }
  return null;
}

/**
 * Build the mechanical report content.
 */
function buildMechanicalReport({
  periodStart, periodEnd, config, stateContent, configContent,
  workflowRuns, commits, issues, prs, sourceFiles, testFiles, agentLogs,
  missionContent, acceptanceCriteria, websiteInfo, hasScreenshot, repo,
}) {
  const sections = [];
  const now = new Date().toISOString().split("T")[0];

  sections.push(`# Benchmark Report`);
  sections.push(``);
  sections.push(`**Date**: ${now}`);
  sections.push(`**Repository**: ${repo.owner}/${repo.repo}`);
  sections.push(`**Period**: ${periodStart} → ${periodEnd}`);
  sections.push(`**Generated by**: agentic-lib-report (mechanical + LLM enrichment)`);
  sections.push(``);
  sections.push(`---`);

  // ── Mission ──
  sections.push(``);
  sections.push(`## Mission`);
  sections.push(``);
  sections.push("```");
  sections.push(missionContent || "(no MISSION.md found)");
  sections.push("```");

  if (acceptanceCriteria.length > 0) {
    sections.push(``);
    sections.push(`### Extracted Acceptance Criteria`);
    sections.push(``);
    for (let i = 0; i < acceptanceCriteria.length; i++) {
      sections.push(`${i + 1}. ${acceptanceCriteria[i]}`);
    }
  }

  // ── Configuration snapshot ──
  sections.push(``);
  sections.push(`## Configuration (agentic-lib.toml)`);
  sections.push(``);
  sections.push("```toml");
  sections.push(configContent || "(not found)");
  sections.push("```");

  // ── State snapshot ──
  sections.push(``);
  sections.push(`## State (agentic-lib-state.toml)`);
  sections.push(``);
  sections.push("```toml");
  sections.push(stateContent || "(not found)");
  sections.push("```");

  // ── Mission status ──
  sections.push(``);
  sections.push(`## Mission Status`);
  sections.push(``);
  const complete = existsSync("MISSION_COMPLETE.md");
  const failed = existsSync("MISSION_FAILED.md");
  sections.push(`| Signal | Present |`);
  sections.push(`|--------|---------|`);
  sections.push(`| MISSION_COMPLETE.md | ${complete ? "YES" : "NO"} |`);
  sections.push(`| MISSION_FAILED.md | ${failed ? "YES" : "NO"} |`);

  if (complete) {
    sections.push(``);
    sections.push("```");
    sections.push(readFileSync("MISSION_COMPLETE.md", "utf8").trim());
    sections.push("```");
  }
  if (failed) {
    sections.push(``);
    sections.push("```");
    sections.push(readFileSync("MISSION_FAILED.md", "utf8").trim());
    sections.push("```");
  }

  // ── Workflow runs (iteration timeline) ──
  sections.push(``);
  sections.push(`## Workflow Runs (${workflowRuns.length})`);
  sections.push(``);
  sections.push(`| # | Name | Conclusion | Started | Duration | URL |`);
  sections.push(`|---|------|------------|---------|----------|-----|`);
  for (let i = 0; i < workflowRuns.length; i++) {
    const r = workflowRuns[i];
    const startMs = new Date(r.created_at).getTime();
    const endMs = new Date(r.updated_at).getTime();
    const durationMin = Math.round((endMs - startMs) / 60000);
    sections.push(`| ${i + 1} | ${r.name} | ${r.conclusion || r.status} | ${r.created_at} | ~${durationMin}min | [${r.id}](${r.html_url}) |`);
  }

  // ── Pull Requests (transformation evidence) ──
  sections.push(``);
  sections.push(`## Pull Requests (${prs.length})`);
  sections.push(``);
  sections.push(`| # | Branch | Title | Merged | +/- | Files |`);
  sections.push(`|---|--------|-------|--------|-----|-------|`);
  for (const p of prs) {
    sections.push(`| #${p.number} | ${p.branch} | ${p.title} | ${p.merged_at || "open"} | +${p.additions}/-${p.deletions} | ${p.changed_files} |`);
  }

  // ── Commits timeline ──
  sections.push(``);
  sections.push(`## Commits Timeline (${commits.length})`);
  sections.push(``);
  sections.push(`| SHA | Date | Author | Message |`);
  sections.push(`|-----|------|--------|---------|`);
  for (const c of commits) {
    sections.push(`| ${c.sha} | ${c.date} | ${c.author} | ${c.message} |`);
  }

  // ── Issues ──
  sections.push(``);
  sections.push(`## Issues (${issues.length})`);
  sections.push(``);
  sections.push(`| # | State | Labels | Title |`);
  sections.push(`|---|-------|--------|-------|`);
  for (const i of issues) {
    sections.push(`| #${i.number} | ${i.state} | ${i.labels || "-"} | ${i.title} |`);
  }

  // ── Source Code (full contents) ──
  sections.push(``);
  sections.push(`## Source Code (${sourceFiles.length} files)`);
  for (const s of sourceFiles) {
    sections.push(``);
    sections.push(`### ${s.file} (${s.lines} lines)`);
    sections.push(``);
    sections.push("```javascript");
    sections.push(s.content);
    sections.push("```");
  }

  // ── Test Files (full contents) ──
  sections.push(``);
  sections.push(`## Test Files (${testFiles.length} files)`);
  for (const t of testFiles) {
    sections.push(``);
    sections.push(`### ${t.file} (${t.lines} lines)`);
    sections.push(``);
    sections.push("```javascript");
    sections.push(t.content);
    sections.push("```");
  }

  // ── Website & Screenshot ──
  sections.push(``);
  sections.push(`## Website & Screenshot`);
  sections.push(``);
  sections.push(`**Screenshot**: ${hasScreenshot ? "SCREENSHOT_INDEX.png captured (see artifacts)" : "not available"}`);
  sections.push(``);
  if (websiteInfo) {
    sections.push(`**Website** (${websiteInfo.rawLength} bytes, ${websiteInfo.hasContent ? "has content" : "minimal content"}):`);
    sections.push(``);
    sections.push("```");
    sections.push(websiteInfo.textSummary);
    sections.push("```");
  } else {
    sections.push(`**Website**: not fetched`);
  }

  // ── Agent Log Narratives ──
  sections.push(``);
  sections.push(`## Agent Logs (${agentLogs.length} files)`);
  for (const log of agentLogs) {
    sections.push(``);
    sections.push(`### ${log.file} (${log.totalLines} lines)`);
    sections.push(``);
    sections.push("```");
    sections.push(log.excerpt);
    if (log.totalLines > 80) sections.push(`... (${log.totalLines - 80} more lines)`);
    sections.push("```");
  }

  // ── README ──
  const readmeContent = readOptionalFile("README.md");
  if (readmeContent) {
    sections.push(``);
    sections.push(`## README.md`);
    sections.push(``);
    const readmeLines = readmeContent.split("\n");
    sections.push(readmeLines.slice(0, 60).join("\n"));
    if (readmeLines.length > 60) sections.push(`\n... (${readmeLines.length - 60} more lines)`);
  }

  sections.push(``);
  return sections.join("\n");
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

  // Read config and state files
  const configPath = config._configPath || "agentic-lib.toml";
  const configContent = readOptionalFile(configPath);
  const stateContent = readOptionalFile("agentic-lib-state.toml");
  const missionContent = readOptionalFile("MISSION.md");
  const acceptanceCriteria = extractAcceptanceCriteria(missionContent || "");

  // Gather data from GitHub API
  const workflowRuns = await listWorkflowRuns(octokit, owner, repoName, periodStart, periodEnd);
  const commits = await listCommits(octokit, owner, repoName, periodStart, periodEnd);
  const issues = await listIssues(octokit, owner, repoName, periodStart);
  const prs = await listPullRequests(octokit, owner, repoName, periodStart);

  // Gather local data: full file contents, not just stats
  const sourceFiles = readSourceFiles(config);
  const testFiles = readTestFiles();
  const logPrefix = config.intentionBot?.logPrefix || "agent-log-";
  const agentLogs = readAgentLogs(logPrefix);
  const websiteInfo = readWebsiteHtml();
  const hasScreenshot = existsSync("SCREENSHOT_INDEX.png");

  core.info(`Gathered: ${workflowRuns.length} runs, ${commits.length} commits, ${issues.length} issues, ${prs.length} PRs, ${sourceFiles.length} source files, ${testFiles.length} test files, ${agentLogs.length} logs`);

  // Build mechanical report
  const mechanicalReport = buildMechanicalReport({
    periodStart, periodEnd, config, stateContent, configContent,
    workflowRuns, commits, issues, prs, sourceFiles, testFiles, agentLogs,
    missionContent, acceptanceCriteria, websiteInfo, hasScreenshot, repo,
  });

  // Optional LLM enrichment (if Copilot token available)
  let enrichedAnalysis = null;
  let tokensUsed = 0;
  let resultModel = model;
  if (process.env.COPILOT_GITHUB_TOKEN) {
    try {
      const agentPrompt = context.instructions || "";
      const tools = [
        ...createGitHubTools(octokit, owner, repoName),
        ...createGitTools(),
        {
          name: "report_analysis",
          description: "Record your enriched analysis of the benchmark data. Call exactly once.",
          parameters: {
            type: "object",
            properties: {
              summary: { type: "string", description: "Executive summary of the benchmark period" },
              findings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    severity: { type: "string", enum: ["POSITIVE", "CONCERN", "REGRESSION"] },
                    description: { type: "string" },
                  },
                  required: ["id", "title", "severity", "description"],
                },
              },
              recommendations: { type: "array", items: { type: "string" } },
              acceptance_criteria: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    criterion: { type: "string" },
                    status: { type: "string", enum: ["PASS", "FAIL", "NOT TESTED"] },
                    evidence: { type: "string" },
                  },
                  required: ["criterion", "status", "evidence"],
                },
              },
              iteration_narrative: { type: "string", description: "Narrative describing each iteration: what happened, what changed, what the agent decided" },
              scenario_summary: {
                type: "object",
                properties: {
                  total_iterations: { type: "number" },
                  transforms: { type: "number" },
                  convergence_iteration: { type: "number", description: "Which iteration reached mission-complete (0 if not reached)" },
                  final_source_lines: { type: "number" },
                  final_test_count: { type: "number" },
                  acceptance_pass_count: { type: "string", description: "e.g. '7/8 PASS'" },
                  total_tokens: { type: "number" },
                },
              },
            },
            required: ["summary", "findings", "recommendations"],
          },
          handler: async (args) => {
            enrichedAnalysis = args;
            return "Analysis recorded.";
          },
        },
      ];

      const userPrompt = [
        "Analyse the following mechanical benchmark data and produce an enriched report.",
        "",
        "You MUST:",
        "1. Verify each acceptance criterion by reading the actual source code (use read_file).",
        "2. For each workflow run, determine if it produced a transform (check merged PRs in the same time window).",
        "3. Read issue bodies (use get_issue) to understand what work was requested and completed.",
        "4. Produce a narrative timeline: for each iteration, what happened, what changed, what the agent decided.",
        "5. Assess code quality by reading the source — is it clean, correct, well-tested?",
        "",
        "=== MECHANICAL DATA ===",
        mechanicalReport,
      ].join("\n");

      const result = await runCopilotSession({
        workspacePath: ".",
        model: model || config.model || "gpt-5-mini",
        tuning: config.tuning || {},
        timeoutMs: 180000,
        agentPrompt,
        userPrompt,
        tools,
      });
      tokensUsed = result.tokensUsed || 0;
      resultModel = result.model || model;
    } catch (err) {
      core.warning(`LLM enrichment failed (report will be mechanical only): ${err.message}`);
    }
  }

  // Compose final report
  let finalReport = mechanicalReport;
  if (enrichedAnalysis) {
    const enrichedSections = [];
    enrichedSections.push(``);
    enrichedSections.push(`---`);
    enrichedSections.push(``);
    enrichedSections.push(`## Analysis (LLM-enriched)`);
    enrichedSections.push(``);
    enrichedSections.push(enrichedAnalysis.summary || "");
    enrichedSections.push(``);

    if (enrichedAnalysis.iteration_narrative) {
      enrichedSections.push(`### Iteration Narrative`);
      enrichedSections.push(``);
      enrichedSections.push(enrichedAnalysis.iteration_narrative);
      enrichedSections.push(``);
    }

    if (enrichedAnalysis.acceptance_criteria?.length) {
      enrichedSections.push(`### Acceptance Criteria`);
      enrichedSections.push(``);
      enrichedSections.push(`| Criterion | Status | Evidence |`);
      enrichedSections.push(`|-----------|--------|----------|`);
      for (const ac of enrichedAnalysis.acceptance_criteria) {
        enrichedSections.push(`| ${ac.criterion} | ${ac.status} | ${ac.evidence} |`);
      }
      enrichedSections.push(``);
    }

    if (enrichedAnalysis.scenario_summary) {
      const s = enrichedAnalysis.scenario_summary;
      enrichedSections.push(`### Scenario Summary`);
      enrichedSections.push(``);
      enrichedSections.push(`| Metric | Value |`);
      enrichedSections.push(`|--------|-------|`);
      if (s.total_iterations != null) enrichedSections.push(`| Total iterations | ${s.total_iterations} |`);
      if (s.transforms != null) enrichedSections.push(`| Transforms | ${s.transforms} |`);
      if (s.convergence_iteration) enrichedSections.push(`| Convergence | Iteration ${s.convergence_iteration} |`);
      if (s.final_source_lines) enrichedSections.push(`| Final source lines | ${s.final_source_lines} |`);
      if (s.final_test_count) enrichedSections.push(`| Final test count | ${s.final_test_count} |`);
      if (s.acceptance_pass_count) enrichedSections.push(`| Acceptance criteria | ${s.acceptance_pass_count} |`);
      if (s.total_tokens) enrichedSections.push(`| Total tokens | ${s.total_tokens} |`);
      enrichedSections.push(``);
    }

    if (enrichedAnalysis.findings?.length) {
      enrichedSections.push(`### Findings`);
      enrichedSections.push(``);
      for (const f of enrichedAnalysis.findings) {
        enrichedSections.push(`#### ${f.id}: ${f.title} (${f.severity})`);
        enrichedSections.push(``);
        enrichedSections.push(f.description);
        enrichedSections.push(``);
      }
    }

    if (enrichedAnalysis.recommendations?.length) {
      enrichedSections.push(`### Recommendations`);
      enrichedSections.push(``);
      for (let i = 0; i < enrichedAnalysis.recommendations.length; i++) {
        enrichedSections.push(`${i + 1}. ${enrichedAnalysis.recommendations[i]}`);
      }
      enrichedSections.push(``);
    }

    finalReport += enrichedSections.join("\n");
  }

  const narrative = `Generated benchmark report for ${repo.owner}/${repo.repo} covering ${periodStart} to ${periodEnd} (${workflowRuns.length} runs, ${commits.length} commits, ${issues.length} issues)`;

  return {
    outcome: "report-generated",
    narrative,
    reportContent: finalReport,
    tokensUsed,
    model: resultModel,
  };
}
