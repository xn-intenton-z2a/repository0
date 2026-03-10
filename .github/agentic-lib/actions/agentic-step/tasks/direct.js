// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/direct.js — Director: mission-complete/failed evaluation via LLM
//
// Gathers mission metrics, builds an advisory assessment, asks the LLM
// to decide mission-complete, mission-failed, or produce a gap analysis.
// The director does NOT dispatch workflows or create issues — that's the supervisor's job.

import * as core from "@actions/core";
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { runCopilotTask, readOptionalFile, scanDirectory, filterIssues } from "../copilot.js";

/**
 * Count TODO comments recursively in a directory.
 */
function countTodos(dir) {
  let n = 0;
  if (!existsSync(dir)) return 0;
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      const fp = `${dir}/${entry}`;
      try {
        const stat = statSync(fp);
        if (stat.isDirectory()) {
          n += countTodos(fp);
        } else if (/\.(js|ts|mjs)$/.test(entry)) {
          const content = readFileSync(fp, "utf8");
          const m = content.match(/\bTODO\b/gi);
          if (m) n += m.length;
        }
      } catch { /* skip */ }
    }
  } catch { /* skip */ }
  return n;
}

/**
 * Detect dedicated test files that import from src/lib/.
 */
function detectDedicatedTests() {
  let hasDedicatedTests = false;
  const dedicatedTestFiles = [];
  const testDirs = ["tests", "__tests__"];
  for (const dir of testDirs) {
    if (existsSync(dir)) {
      try {
        const testFiles = scanDirectory(dir, [".js", ".ts", ".mjs"], { limit: 20 });
        for (const tf of testFiles) {
          if (/^(main|web|behaviour)\.test\.[jt]s$/.test(tf.name)) continue;
          const content = readFileSync(tf.path, "utf8");
          if (/from\s+['"].*src\/lib\//.test(content) || /require\s*\(\s*['"].*src\/lib\//.test(content)) {
            hasDedicatedTests = true;
            dedicatedTestFiles.push(tf.name);
          }
        }
      } catch { /* ignore */ }
    }
  }
  return { hasDedicatedTests, dedicatedTestFiles };
}

/**
 * Build the metric-based mission-complete advisory string.
 * This is the mechanical check — purely rule-based, no LLM.
 */
function buildMetricAssessment(ctx, config) {
  const thresholds = config.missionCompleteThresholds || {};
  const minResolved = thresholds.minResolvedIssues ?? 3;
  const requireTests = thresholds.requireDedicatedTests ?? true;
  const maxTodos = thresholds.maxSourceTodos ?? 0;

  const metrics = [
    { metric: "Open issues", value: ctx.issuesSummary.length, target: 0, met: ctx.issuesSummary.length === 0 },
    { metric: "Open PRs", value: ctx.prsSummary.length, target: 0, met: ctx.prsSummary.length === 0 },
    { metric: "Issues resolved", value: ctx.resolvedCount, target: minResolved, met: ctx.resolvedCount >= minResolved },
    { metric: "Dedicated tests", value: ctx.hasDedicatedTests ? "YES" : "NO", target: requireTests ? "YES" : "—", met: !requireTests || ctx.hasDedicatedTests },
    { metric: "Source TODOs", value: ctx.sourceTodoCount, target: maxTodos, met: ctx.sourceTodoCount <= maxTodos },
    { metric: "Budget", value: ctx.cumulativeTransformationCost, target: ctx.transformationBudget || "unlimited", met: !(ctx.transformationBudget > 0 && ctx.cumulativeTransformationCost >= ctx.transformationBudget) },
  ];

  const allMet = metrics.every((m) => m.met);
  const notMet = metrics.filter((m) => !m.met);

  const table = [
    "| Metric | Value | Target | Status |",
    "|--------|-------|--------|--------|",
    ...metrics.map((m) => `| ${m.metric} | ${m.value} | ${typeof m.target === "number" ? (m.metric.includes("TODO") ? `<= ${m.target}` : m.metric.includes("resolved") ? `>= ${m.target}` : `${m.target}`) : m.target} | ${m.met ? "MET" : "NOT MET"} |`),
  ].join("\n");

  let assessment;
  if (allMet) {
    assessment = "ALL METRICS MET — mission-complete conditions are satisfied.";
  } else {
    assessment = `${notMet.length} metric(s) NOT MET: ${notMet.map((m) => `${m.metric}=${m.value}`).join(", ")}.`;
  }

  return { metrics, allMet, notMet, table, assessment };
}

/**
 * Build the director prompt.
 */
function buildPrompt(ctx, agentInstructions, metricAssessment) {
  return [
    "## Instructions",
    agentInstructions,
    "",
    "## Mission",
    ctx.mission || "(no mission defined)",
    "",
    "## Metric Based Mission Complete Assessment",
    metricAssessment.assessment,
    "",
    "### Mission-Complete Metrics",
    metricAssessment.table,
    "",
    "## Repository State",
    `### Open Issues (${ctx.issuesSummary.length})`,
    ctx.issuesSummary.join("\n") || "none",
    "",
    `### Recently Closed Issues (${ctx.recentlyClosedSummary.length})`,
    ctx.recentlyClosedSummary.join("\n") || "none",
    "",
    `### Open PRs (${ctx.prsSummary.length})`,
    ctx.prsSummary.join("\n") || "none",
    "",
    ...(ctx.sourceExports?.length > 0
      ? [
          `### Source Exports`,
          ...ctx.sourceExports.map((e) => `- ${e}`),
          "",
        ]
      : []),
    `### Test Coverage`,
    ctx.hasDedicatedTests
      ? `Dedicated test files: ${ctx.dedicatedTestFiles.join(", ")}`
      : "**No dedicated test files found.**",
    "",
    `### Source TODO Count: ${ctx.sourceTodoCount}`,
    "",
    `### Transformation Budget: ${ctx.cumulativeTransformationCost}/${ctx.transformationBudget || "unlimited"}`,
    "",
    `### Recent Activity`,
    ctx.recentActivity || "none",
    "",
  ].join("\n");
}

/**
 * Parse the director's LLM response.
 */
function parseDirectorResponse(content) {
  const decisionMatch = content.match(/\[DECISION\]([\s\S]*?)\[\/DECISION\]/);
  const reasonMatch = content.match(/\[REASON\]([\s\S]*?)\[\/REASON\]/);
  const analysisMatch = content.match(/\[ANALYSIS\]([\s\S]*?)\[\/ANALYSIS\]/);

  const decision = decisionMatch ? decisionMatch[1].trim().toLowerCase() : "in-progress";
  const reason = reasonMatch ? reasonMatch[1].trim() : "";
  const analysis = analysisMatch ? analysisMatch[1].trim() : content.substring(0, 500);

  return { decision, reason, analysis };
}

/**
 * Execute mission-complete: write signal file and commit via Contents API.
 */
async function executeMissionComplete(octokit, repo, reason) {
  const signal = [
    "# Mission Complete",
    "",
    `- **Timestamp:** ${new Date().toISOString()}`,
    `- **Detected by:** director`,
    `- **Reason:** ${reason}`,
    "",
    "This file was created automatically. To restart transformations, delete this file or run `npx @xn-intenton-z2a/agentic-lib init --reseed`.",
  ].join("\n");
  writeFileSync("MISSION_COMPLETE.md", signal);

  try {
    const contentBase64 = Buffer.from(signal).toString("base64");
    let existingSha;
    try {
      const { data } = await octokit.rest.repos.getContent({ ...repo, path: "MISSION_COMPLETE.md", ref: "main" });
      existingSha = data.sha;
    } catch { /* doesn't exist yet */ }
    await octokit.rest.repos.createOrUpdateFileContents({
      ...repo,
      path: "MISSION_COMPLETE.md",
      message: "mission-complete: " + reason.substring(0, 72),
      content: contentBase64,
      branch: "main",
      ...(existingSha ? { sha: existingSha } : {}),
    });
    core.info("MISSION_COMPLETE.md committed to main");
  } catch (err) {
    core.warning(`Could not commit MISSION_COMPLETE.md: ${err.message}`);
  }
}

/**
 * Execute mission-failed: write signal file and commit via Contents API.
 */
async function executeMissionFailed(octokit, repo, reason) {
  const signal = [
    "# Mission Failed",
    "",
    `- **Timestamp:** ${new Date().toISOString()}`,
    `- **Detected by:** director`,
    `- **Reason:** ${reason}`,
    "",
    "This file was created automatically. To restart, delete this file and run `npx @xn-intenton-z2a/agentic-lib init --reseed`.",
  ].join("\n");
  writeFileSync("MISSION_FAILED.md", signal);

  try {
    const contentBase64 = Buffer.from(signal).toString("base64");
    let existingSha;
    try {
      const { data } = await octokit.rest.repos.getContent({ ...repo, path: "MISSION_FAILED.md", ref: "main" });
      existingSha = data.sha;
    } catch { /* doesn't exist yet */ }
    await octokit.rest.repos.createOrUpdateFileContents({
      ...repo,
      path: "MISSION_FAILED.md",
      message: "mission-failed: " + reason.substring(0, 72),
      content: contentBase64,
      branch: "main",
      ...(existingSha ? { sha: existingSha } : {}),
    });
    core.info("MISSION_FAILED.md committed to main");
  } catch (err) {
    core.warning(`Could not commit MISSION_FAILED.md: ${err.message}`);
  }
}

/**
 * Director task: evaluate mission readiness and produce a decision or gap analysis.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function direct(context) {
  const { octokit, repo, config, instructions, model } = context;
  const t = config.tuning || {};

  // --- Gather context (similar to supervisor but focused on metrics) ---
  const mission = readOptionalFile(config.paths.mission.path);
  const intentionLogFull = readOptionalFile(config.intentionBot.intentionFilepath);
  const recentActivity = intentionLogFull.split("\n").slice(-20).join("\n");

  const costMatches = intentionLogFull.matchAll(/\*\*agentic-lib transformation cost:\*\* (\d+)/g);
  const cumulativeTransformationCost = [...costMatches].reduce((sum, m) => sum + parseInt(m[1], 10), 0);

  const missionComplete = existsSync("MISSION_COMPLETE.md");
  const missionFailed = existsSync("MISSION_FAILED.md");
  const transformationBudget = config.transformationBudget || 0;

  // If already decided, skip
  if (missionComplete) {
    return { outcome: "nop", details: "Mission already complete (MISSION_COMPLETE.md exists)" };
  }
  if (missionFailed) {
    return { outcome: "nop", details: "Mission already failed (MISSION_FAILED.md exists)" };
  }

  // Skip in maintenance mode
  if (config.supervisor === "maintenance") {
    return { outcome: "nop", details: "Maintenance mode — director skipped" };
  }

  const initTimestamp = config.init?.timestamp || null;

  const { data: openIssues } = await octokit.rest.issues.listForRepo({
    ...repo, state: "open", per_page: t.issuesScan || 20, sort: "created", direction: "asc",
  });
  const issuesOnly = openIssues.filter((i) => !i.pull_request);
  const filteredIssues = filterIssues(issuesOnly, { staleDays: t.staleDays || 30, initTimestamp });
  const issuesSummary = filteredIssues.map((i) => {
    const labels = i.labels.map((l) => l.name).join(", ");
    return `#${i.number}: ${i.title} [${labels || "no labels"}]`;
  });

  // Recently closed issues
  let recentlyClosedSummary = [];
  let resolvedCount = 0;
  try {
    const { data: closedIssuesRaw } = await octokit.rest.issues.listForRepo({
      ...repo, state: "closed", labels: "automated", per_page: 10, sort: "updated", direction: "desc",
    });
    const initEpoch = initTimestamp ? new Date(initTimestamp).getTime() : 0;
    const closedFiltered = closedIssuesRaw.filter((i) =>
      !i.pull_request && (initEpoch <= 0 || new Date(i.created_at).getTime() >= initEpoch)
    );
    for (const ci of closedFiltered) {
      let closeReason = "closed";
      try {
        const { data: comments } = await octokit.rest.issues.listComments({
          ...repo, issue_number: ci.number, per_page: 5, sort: "created", direction: "desc",
        });
        if (comments.some((c) => c.body?.includes("Automated Review Result"))) {
          closeReason = "RESOLVED";
        } else {
          const { data: events } = await octokit.rest.issues.listEvents({
            ...repo, issue_number: ci.number, per_page: 10,
          });
          if (events.some((e) => e.event === "closed" && e.commit_id)) {
            closeReason = "RESOLVED";
          }
        }
      } catch { /* ignore */ }
      if (closeReason === "RESOLVED") resolvedCount++;
      recentlyClosedSummary.push(`#${ci.number}: ${ci.title} — ${closeReason}`);
    }
  } catch (err) {
    core.warning(`Could not fetch recently closed issues: ${err.message}`);
  }

  // Open PRs
  const { data: openPRs } = await octokit.rest.pulls.list({
    ...repo, state: "open", per_page: 10, sort: "updated", direction: "desc",
  });
  const prsSummary = openPRs.map((pr) => `#${pr.number}: ${pr.title} (${pr.head.ref})`);

  // Source exports
  let sourceExports = [];
  try {
    const sourcePath = config.paths.source?.path || "src/lib/";
    if (existsSync(sourcePath)) {
      const sourceFiles = scanDirectory(sourcePath, [".js", ".ts"], { limit: 5 });
      for (const sf of sourceFiles) {
        const content = readFileSync(sf.path, "utf8");
        const exports = [...content.matchAll(/export\s+(?:async\s+)?(?:function|const|let|var|class)\s+(\w+)/g)]
          .map((m) => m[1]);
        if (exports.length > 0) {
          sourceExports.push(`${sf.name}: ${exports.join(", ")}`);
        }
      }
    }
  } catch { /* ignore */ }

  // Dedicated tests
  const { hasDedicatedTests, dedicatedTestFiles } = detectDedicatedTests();

  // TODO count
  const sourcePath = config.paths.source?.path || "src/lib/";
  const sourceDir = sourcePath.endsWith("/") ? sourcePath.slice(0, -1) : sourcePath;
  const srcRoot = sourceDir.includes("/") ? sourceDir.split("/").slice(0, -1).join("/") || "src" : "src";
  const sourceTodoCount = countTodos(srcRoot);

  // Build context
  const ctx = {
    mission,
    recentActivity,
    issuesSummary,
    recentlyClosedSummary,
    resolvedCount,
    prsSummary,
    sourceExports,
    hasDedicatedTests,
    dedicatedTestFiles,
    sourceTodoCount,
    cumulativeTransformationCost,
    transformationBudget,
  };

  // Build metric-based advisory
  const metricAssessment = buildMetricAssessment(ctx, config);
  core.info(`Metric assessment: ${metricAssessment.assessment}`);

  // --- LLM decision ---
  const agentInstructions = instructions || "You are the director. Evaluate mission readiness.";
  const prompt = buildPrompt(ctx, agentInstructions, metricAssessment);

  const { content, tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage:
      "You are the director of an autonomous coding repository. Your job is to evaluate whether the mission is complete, failed, or in progress. You produce a structured assessment — you do NOT dispatch workflows or create issues.",
    prompt,
    writablePaths: [],
    tuning: t,
  });

  const { decision, reason, analysis } = parseDirectorResponse(content);
  core.info(`Director decision: ${decision} — ${reason}`);

  // Execute the decision
  let outcome = "directed";
  if (decision === "mission-complete" && metricAssessment.allMet) {
    if (process.env.GITHUB_REPOSITORY !== "xn-intenton-z2a/agentic-lib") {
      await executeMissionComplete(octokit, repo, reason);
      outcome = "mission-complete";
    }
  } else if (decision === "mission-complete" && !metricAssessment.allMet) {
    core.info("Director chose mission-complete but metrics are NOT all met — overriding to in-progress");
    outcome = "directed";
  } else if (decision === "mission-failed") {
    if (process.env.GITHUB_REPOSITORY !== "xn-intenton-z2a/agentic-lib") {
      await executeMissionFailed(octokit, repo, reason);
      outcome = "mission-failed";
    }
  }

  // Set output for downstream jobs to check
  core.setOutput("director-decision", decision);
  core.setOutput("director-analysis", analysis.substring(0, 500));

  return {
    outcome,
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Decision: ${decision}\nReason: ${reason}\nAnalysis: ${analysis.substring(0, 300)}`,
    narrative: `Director: ${reason}`,
    metricAssessment: metricAssessment.assessment,
    directorAnalysis: analysis,
    hasDedicatedTests,
    resolvedCount,
    changes: outcome === "mission-complete"
      ? [{ action: "mission-complete", file: "MISSION_COMPLETE.md", sizeInfo: reason.substring(0, 100) }]
      : outcome === "mission-failed"
        ? [{ action: "mission-failed", file: "MISSION_FAILED.md", sizeInfo: reason.substring(0, 100) }]
        : [],
  };
}
