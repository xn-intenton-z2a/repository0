// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// telemetry.js — Mission metrics, readiness narrative, and cost tracking
//
// Phase 4: Extracted from src/actions/agentic-step/index.js so that both
// CLI and Actions share the same metric calculation logic.

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * Recursively count TODO/FIXME comments in source files under a directory.
 * @param {string} dir - Directory to scan
 * @param {string[]} [extensions] - File extensions to include (default: .js, .ts, .mjs)
 * @returns {number} Total count of TODO/FIXME occurrences
 */
export function countSourceTodos(dir, extensions = [".js", ".ts", ".mjs"]) {
  let count = 0;
  if (!existsSync(dir)) return 0;
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      const fullPath = join(dir, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          count += countSourceTodos(fullPath, extensions);
        } else if (extensions.some((ext) => entry.endsWith(ext))) {
          const content = readFileSync(fullPath, "utf8");
          const matches = content.match(/\bTODO\b/gi);
          if (matches) count += matches.length;
        }
      } catch { /* skip unreadable files */ }
    }
  } catch { /* skip unreadable dirs */ }
  return count;
}

/**
 * Count source lines in a directory (recursive, .js/.ts/.mjs files).
 * @param {string} dir
 * @returns {number}
 */
export function countSourceLines(dir) {
  if (!dir || !existsSync(dir)) return 0;
  let count = 0;
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      const fullPath = join(dir, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          count += countSourceLines(fullPath);
        } else if (/\.(js|ts|mjs)$/.test(entry)) {
          const content = readFileSync(fullPath, "utf8");
          count += content.split("\n").length;
        }
      } catch { /* skip */ }
    }
  } catch { /* skip */ }
  return count;
}

/**
 * Count acceptance criteria checkboxes in MISSION.md.
 * @param {string} missionPath
 * @returns {{ met: number, total: number }}
 */
export function countAcceptanceCriteria(missionPath) {
  if (!missionPath || !existsSync(missionPath)) return { met: 0, total: 0 };
  try {
    const content = readFileSync(missionPath, "utf8");
    const checked = (content.match(/- \[x\]/gi) || []).length;
    const unchecked = (content.match(/- \[ \]/g) || []).length;
    return { met: checked, total: checked + unchecked };
  } catch { return { met: 0, total: 0 }; }
}

/**
 * Build mission-complete metrics array for the intentïon.md dashboard.
 *
 * C2: Uses cumulativeCost from persistent state (not per-run).
 * C5: Includes both per-task and cumulative values.
 * C6: Replaces "Dedicated test files" with dynamic metrics.
 *
 * @param {Object} config - Parsed agentic-lib config
 * @param {Object} result - Task result object
 * @param {Array} _limitsStatus - Limits status array (unused but kept for signature compatibility)
 * @param {number} cumulativeCost - Cumulative transformation cost (from state.toml)
 * @param {number} featureIssueCount - Number of open feature issues
 * @param {number} maintenanceIssueCount - Number of open maintenance issues
 * @param {Object} [taskCosts] - Per-task costs for split display
 * @param {number} [taskCosts.transformationCost] - This task's transformation cost (0 or 1)
 * @param {number} [taskCosts.tokensUsed] - This task's token usage
 * @param {number} [taskCosts.cumulativeTokens] - Cumulative tokens from state
 * @returns {Array} Mission metrics entries
 */
export function buildMissionMetrics(config, result, _limitsStatus, cumulativeCost, featureIssueCount, maintenanceIssueCount, taskCosts) {
  const openIssues = featureIssueCount + maintenanceIssueCount;
  const budgetCap = config.transformationBudget || 0;
  const resolvedCount = result.resolvedCount || 0;
  const missionComplete = existsSync("MISSION_COMPLETE.md");
  const missionFailed = existsSync("MISSION_FAILED.md");
  const openPrs = result.openPrCount || 0;

  const sourcePath = config.paths?.source?.path || "src/lib/";
  const sourceDir = sourcePath.endsWith("/") ? sourcePath.slice(0, -1) : sourcePath;
  const srcRoot = sourceDir.includes("/") ? sourceDir.split("/").slice(0, -1).join("/") || "src" : "src";
  const todoCount = countSourceTodos(srcRoot);

  const thresholds = config.missionCompleteThresholds || {};
  const minResolved = thresholds.minResolvedIssues ?? 3;
  const maxTodos = thresholds.maxSourceTodos ?? 0;

  // C6: Dynamic metrics
  const sourceLines = countSourceLines(sourceDir);
  const featuresPath = config.paths?.features?.path || "features/";
  const featureSpecCount = countMdFilesInDir(featuresPath);
  const missionPath = config.paths?.mission?.path || "MISSION.md";
  const acceptance = countAcceptanceCriteria(missionPath);

  // C5: Per-task costs (optional)
  const tc = taskCosts || {};
  const thisTaskCost = tc.transformationCost ?? 0;
  const thisTaskTokens = tc.tokensUsed ?? 0;
  const cumulativeTokens = tc.cumulativeTokens ?? 0;

  return [
    { metric: "Open issues", value: String(openIssues), target: "0", status: openIssues === 0 ? "MET" : "NOT MET" },
    { metric: "Open PRs", value: String(openPrs), target: "0", status: openPrs === 0 ? "MET" : "NOT MET" },
    { metric: "Issues resolved (review or PR merge)", value: String(resolvedCount), target: `>= ${minResolved}`, status: resolvedCount >= minResolved ? "MET" : "NOT MET" },
    { metric: "Source TODO count", value: String(todoCount), target: `<= ${maxTodos}`, status: todoCount <= maxTodos ? "MET" : "NOT MET" },
    { metric: "Source lines", value: String(sourceLines), target: "—", status: "—" },
    { metric: "Feature specs", value: String(featureSpecCount), target: "—", status: "—" },
    { metric: "Acceptance criteria", value: acceptance.total > 0 ? `${acceptance.met}/${acceptance.total}` : "—", target: "—", status: "—" },
    { metric: "Transforms (this task)", value: String(thisTaskCost), target: "—", status: "—" },
    { metric: "Transforms (cumulative)", value: String(cumulativeCost), target: ">= 1", status: cumulativeCost >= 1 ? "MET" : "NOT MET" },
    { metric: "Budget (this task)", value: String(thisTaskCost), target: "—", status: "—" },
    { metric: "Budget (cumulative)", value: `${cumulativeCost}/${budgetCap}`, target: budgetCap > 0 ? `< ${budgetCap}` : "unlimited", status: budgetCap > 0 && cumulativeCost >= budgetCap ? "EXHAUSTED" : "OK" },
    { metric: "Tokens (this task)", value: String(thisTaskTokens), target: "—", status: "—" },
    { metric: "Tokens (cumulative)", value: String(cumulativeTokens), target: "—", status: "—" },
    { metric: "Mission complete declared", value: missionComplete ? "YES" : "NO", target: "—", status: "—" },
    { metric: "Mission failed declared", value: missionFailed ? "YES" : "NO", target: "—", status: "—" },
  ];
}

/**
 * Count .md files in a directory (non-recursive).
 * @param {string} dir
 * @returns {number}
 */
function countMdFilesInDir(dir) {
  if (!dir || !existsSync(dir)) return 0;
  try {
    return readdirSync(dir).filter(f => f.endsWith(".md")).length;
  } catch { return 0; }
}

/**
 * Build mission-complete readiness narrative from metrics.
 *
 * @param {Array} metrics - Mission metrics from buildMissionMetrics()
 * @returns {string} Readiness narrative
 */
export function buildMissionReadiness(metrics) {
  const openIssues = parseInt(metrics.find((m) => m.metric === "Open issues")?.value || "0", 10);
  const openPrs = parseInt(metrics.find((m) => m.metric === "Open PRs")?.value || "0", 10);
  const resolved = parseInt(metrics.find((m) => m.metric === "Issues resolved (review or PR merge)")?.value || "0", 10);
  const todoCount = parseInt(metrics.find((m) => m.metric === "Source TODO count")?.value || "0", 10);
  const sourceLines = parseInt(metrics.find((m) => m.metric === "Source lines")?.value || "0", 10);
  const missionComplete = metrics.find((m) => m.metric === "Mission complete declared")?.value === "YES";
  const missionFailed = metrics.find((m) => m.metric === "Mission failed declared")?.value === "YES";

  if (missionComplete) return "Mission has been declared complete.";
  if (missionFailed) return "Mission has been declared failed.";

  const notMet = metrics.filter((m) => m.status === "NOT MET");
  const allMet = notMet.length === 0;
  const parts = [];

  if (allMet) {
    parts.push("Mission complete conditions ARE met.");
    parts.push(`0 open issues, 0 open PRs, ${resolved} issue(s) resolved, ${sourceLines} source lines, TODOs: ${todoCount}.`);
  } else {
    parts.push("Mission complete conditions are NOT met.");
    if (openIssues > 0) parts.push(`${openIssues} open issue(s) remain.`);
    if (openPrs > 0) parts.push(`${openPrs} open PR(s) remain.`);
    for (const m of notMet) {
      if (m.metric !== "Open issues" && m.metric !== "Open PRs") {
        parts.push(`${m.metric}: ${m.value} (target: ${m.target}).`);
      }
    }
  }

  return parts.join(" ");
}

/**
 * Compute transformation cost for a task execution.
 *
 * @param {string} task - Task name
 * @param {string} outcome - Task outcome
 * @param {boolean} isInstabilityTransform - Whether this is an instability transform
 * @returns {number} 0 or 1
 */
export function computeTransformationCost(task, outcome, isInstabilityTransform) {
  const COST_TASKS = ["transform", "fix-code", "maintain-features", "maintain-library"];
  const isNop = outcome === "nop" || outcome === "error";
  return COST_TASKS.includes(task) && !isNop && !isInstabilityTransform ? 1 : 0;
}

/**
 * Read cumulative transformation cost from the intentïon.md activity log.
 *
 * @param {string} intentionFilepath - Path to the intentïon.md file
 * @returns {number} Cumulative cost
 */
export function readCumulativeCost(intentionFilepath) {
  if (!intentionFilepath || !existsSync(intentionFilepath)) return 0;
  const logContent = readFileSync(intentionFilepath, "utf8");
  const costMatches = logContent.matchAll(/\*\*agentic-lib transformation cost:\*\* (\d+)/g);
  return [...costMatches].reduce((sum, m) => sum + parseInt(m[1], 10), 0);
}

/**
 * Gather and parse all agent-log-*.md files from a directory.
 * Returns structured data from each log file for use in prompts and metrics.
 *
 * @param {string} logsDir - Directory containing agent-log-*.md files
 * @returns {Array} Parsed log entries: { filename, task, outcome, advice, content }
 */
export function gatherAgentLogs(logsDir) {
  if (!logsDir || !existsSync(logsDir)) return [];
  try {
    const files = readdirSync(logsDir)
      .filter((f) => f.startsWith("agent-log-") && f.endsWith(".md"))
      .sort();
    return files.map((f) => {
      const content = readFileSync(join(logsDir, f), "utf8");
      const taskMatch = content.match(/\*\*Task:\*\* (.+)/);
      const outcomeMatch = content.match(/\*\*Outcome:\*\* (.+)/);
      const adviceMatch = content.match(/## Completeness Assessment\n([\s\S]*?)(?=\n##|\n---)/);
      return {
        filename: f,
        task: taskMatch ? taskMatch[1].trim() : "unknown",
        outcome: outcomeMatch ? outcomeMatch[1].trim() : "unknown",
        advice: adviceMatch ? adviceMatch[1].trim() : "",
        content,
      };
    });
  } catch { return []; }
}

/**
 * Build limits status array for activity logging.
 *
 * @param {Object} params
 * @returns {Array} Limits status entries
 */
export function buildLimitsStatus({
  task, cumulativeCost, config, featureIssueCount, maintenanceIssueCount, featuresUsed, libraryUsed,
}) {
  const budgetCap = config.transformationBudget || 0;
  const featCap = config.paths?.features?.limit || 4;
  const libCap = config.paths?.library?.limit || 32;

  return [
    { name: "transformation-budget", valueNum: cumulativeCost, capacityNum: budgetCap, value: `${cumulativeCost}/${budgetCap}`, remaining: `${Math.max(0, budgetCap - cumulativeCost)}`, status: cumulativeCost >= budgetCap && budgetCap > 0 ? "EXHAUSTED" : "" },
    { name: "max-feature-issues", valueNum: featureIssueCount, capacityNum: config.featureDevelopmentIssuesWipLimit, value: `${featureIssueCount}/${config.featureDevelopmentIssuesWipLimit}`, remaining: `${Math.max(0, config.featureDevelopmentIssuesWipLimit - featureIssueCount)}`, status: "" },
    { name: "max-maintenance-issues", valueNum: maintenanceIssueCount, capacityNum: config.maintenanceIssuesWipLimit, value: `${maintenanceIssueCount}/${config.maintenanceIssuesWipLimit}`, remaining: `${Math.max(0, config.maintenanceIssuesWipLimit - maintenanceIssueCount)}`, status: "" },
    { name: "max-attempts-per-issue", valueNum: 0, capacityNum: config.attemptsPerIssue, value: `?/${config.attemptsPerIssue}`, remaining: "?", status: task === "resolve-issue" ? "" : "n/a" },
    { name: "max-attempts-per-branch", valueNum: 0, capacityNum: config.attemptsPerBranch, value: `?/${config.attemptsPerBranch}`, remaining: "?", status: task === "fix-code" ? "" : "n/a" },
    { name: "features", valueNum: featuresUsed, capacityNum: featCap, value: `${featuresUsed}/${featCap}`, remaining: `${Math.max(0, featCap - featuresUsed)}`, status: ["maintain-features", "transform"].includes(task) ? "" : "n/a" },
    { name: "library", valueNum: libraryUsed, capacityNum: libCap, value: `${libraryUsed}/${libCap}`, remaining: `${Math.max(0, libCap - libraryUsed)}`, status: task === "maintain-library" ? "" : "n/a" },
  ];
}
