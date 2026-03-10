// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// index.js — agentic-step GitHub Action entry point
//
// Parses inputs, loads config, runs the appropriate task via the Copilot SDK,
// and sets outputs for downstream workflow steps.

import * as core from "@actions/core";
import * as github from "@actions/github";
import { loadConfig, getWritablePaths } from "./config-loader.js";
import { logActivity, generateClosingNotes } from "./logging.js";
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

// Task implementations
import { resolveIssue } from "./tasks/resolve-issue.js";
import { fixCode } from "./tasks/fix-code.js";
import { transform } from "./tasks/transform.js";
import { maintainFeatures } from "./tasks/maintain-features.js";
import { maintainLibrary } from "./tasks/maintain-library.js";
import { enhanceIssue } from "./tasks/enhance-issue.js";
import { reviewIssue } from "./tasks/review-issue.js";
import { discussions } from "./tasks/discussions.js";
import { supervise } from "./tasks/supervise.js";
import { direct } from "./tasks/direct.js";

const TASKS = {
  "resolve-issue": resolveIssue,
  "fix-code": fixCode,
  "transform": transform,
  "maintain-features": maintainFeatures,
  "maintain-library": maintainLibrary,
  "enhance-issue": enhanceIssue,
  "review-issue": reviewIssue,
  "discussions": discussions,
  "supervise": supervise,
  "direct": direct,
};

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
 * Build mission-complete metrics array for the intentïon.md dashboard.
 */
function buildMissionMetrics(config, result, limitsStatus, cumulativeCost, featureIssueCount, maintenanceIssueCount) {
  const openIssues = featureIssueCount + maintenanceIssueCount;
  const budgetCap = config.transformationBudget || 0;
  const resolvedCount = result.resolvedCount || 0;
  const missionComplete = existsSync("MISSION_COMPLETE.md");
  const missionFailed = existsSync("MISSION_FAILED.md");

  // Count open PRs from result if available
  const openPrs = result.openPrCount || 0;

  // W9: Count TODO comments in source directory
  const sourcePath = config.paths?.source?.path || "src/lib/";
  const sourceDir = sourcePath.endsWith("/") ? sourcePath.slice(0, -1) : sourcePath;
  // Scan the parent src/ directory to catch all source TODOs
  const srcRoot = sourceDir.includes("/") ? sourceDir.split("/").slice(0, -1).join("/") || "src" : "src";
  const todoCount = countSourceTodos(srcRoot);

  // W3: Check for dedicated test files
  const hasDedicatedTests = result.hasDedicatedTests ?? false;

  // W11: Thresholds from config
  const thresholds = config.missionCompleteThresholds || {};
  const minResolved = thresholds.minResolvedIssues ?? 3;
  const requireTests = thresholds.requireDedicatedTests ?? true;
  const maxTodos = thresholds.maxSourceTodos ?? 0;

  const metrics = [
    { metric: "Open issues", value: String(openIssues), target: "0", status: openIssues === 0 ? "MET" : "NOT MET" },
    { metric: "Open PRs", value: String(openPrs), target: "0", status: openPrs === 0 ? "MET" : "NOT MET" },
    { metric: "Issues resolved (review or PR merge)", value: String(resolvedCount), target: `>= ${minResolved}`, status: resolvedCount >= minResolved ? "MET" : "NOT MET" },
    { metric: "Dedicated test files", value: hasDedicatedTests ? "YES" : "NO", target: requireTests ? "YES" : "—", status: !requireTests || hasDedicatedTests ? "MET" : "NOT MET" },
    { metric: "Source TODO count", value: String(todoCount), target: `<= ${maxTodos}`, status: todoCount <= maxTodos ? "MET" : "NOT MET" },
    { metric: "Transformation budget used", value: `${cumulativeCost}/${budgetCap}`, target: budgetCap > 0 ? `< ${budgetCap}` : "unlimited", status: budgetCap > 0 && cumulativeCost >= budgetCap ? "EXHAUSTED" : "OK" },
    { metric: "Cumulative transforms", value: String(cumulativeCost), target: ">= 1", status: cumulativeCost >= 1 ? "MET" : "NOT MET" },
    { metric: "Mission complete declared", value: missionComplete ? "YES" : "NO", target: "—", status: "—" },
    { metric: "Mission failed declared", value: missionFailed ? "YES" : "NO", target: "—", status: "—" },
  ];

  return metrics;
}

/**
 * Build mission-complete readiness narrative from metrics.
 */
function buildMissionReadiness(metrics) {
  const openIssues = parseInt(metrics.find((m) => m.metric === "Open issues")?.value || "0", 10);
  const openPrs = parseInt(metrics.find((m) => m.metric === "Open PRs")?.value || "0", 10);
  const resolved = parseInt(metrics.find((m) => m.metric === "Issues resolved (review or PR merge)")?.value || "0", 10);
  const hasDedicatedTests = metrics.find((m) => m.metric === "Dedicated test files")?.value === "YES";
  const todoCount = parseInt(metrics.find((m) => m.metric === "Source TODO count")?.value || "0", 10);
  const missionComplete = metrics.find((m) => m.metric === "Mission complete declared")?.value === "YES";
  const missionFailed = metrics.find((m) => m.metric === "Mission failed declared")?.value === "YES";

  if (missionComplete) {
    return "Mission has been declared complete.";
  }
  if (missionFailed) {
    return "Mission has been declared failed.";
  }

  // Check all NOT MET conditions
  const notMet = metrics.filter((m) => m.status === "NOT MET");
  const allMet = notMet.length === 0;
  const parts = [];

  if (allMet) {
    parts.push("Mission complete conditions ARE met.");
    parts.push(`0 open issues, 0 open PRs, ${resolved} issue(s) resolved, dedicated tests: ${hasDedicatedTests ? "yes" : "no"}, TODOs: ${todoCount}.`);
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

async function run() {
  try {
    // Parse inputs
    const task = core.getInput("task", { required: true });
    const configPath = core.getInput("config");
    const instructionsPath = core.getInput("instructions");
    const issueNumber = core.getInput("issue-number");
    const prNumber = core.getInput("pr-number");
    const writablePathsOverride = core.getInput("writable-paths");
    const testCommandInput = core.getInput("test-command");
    const discussionUrl = core.getInput("discussion-url");
    const commentNodeId = core.getInput("comment-node-id");
    const commentCreatedAt = core.getInput("comment-created-at");
    const model = core.getInput("model");

    core.info(`agentic-step: task=${task}, model=${model}`);

    // Load config
    const config = loadConfig(configPath);
    const writablePaths = getWritablePaths(config, writablePathsOverride);
    const testCommand = testCommandInput || config.testScript;

    // Load instructions if provided
    let instructions = "";
    if (instructionsPath) {
      try {
        instructions = readFileSync(instructionsPath, "utf8");
      } catch (err) {
        core.warning(`Could not read instructions file: ${instructionsPath}: ${err.message}`);
      }
    }

    // Look up the task handler
    const handler = TASKS[task];
    if (!handler) {
      throw new Error(`Unknown task: ${task}. Available tasks: ${Object.keys(TASKS).join(", ")}`);
    }

    // Build context for the task
    const context = {
      task,
      config,
      instructions,
      issueNumber,
      prNumber,
      writablePaths,
      testCommand,
      discussionUrl,
      commentNodeId,
      commentCreatedAt,
      model,
      octokit: github.getOctokit(process.env.GITHUB_TOKEN),
      repo: github.context.repo,
      github: github.context,
    };

    // Run the task (measure wall-clock duration for cost tracking)
    const startTime = Date.now();
    const result = await handler(context);
    const durationMs = Date.now() - startTime;

    // Set outputs
    core.setOutput("result", result.outcome || "completed");
    if (result.prNumber) core.setOutput("pr-number", String(result.prNumber));
    if (result.tokensUsed) core.setOutput("tokens-used", String(result.tokensUsed));
    if (result.model) core.setOutput("model", result.model);
    if (result.action) core.setOutput("action", result.action);
    if (result.actionArg) core.setOutput("action-arg", result.actionArg);
    if (result.narrative) core.setOutput("narrative", result.narrative);

    const profileName = config.tuning?.profileName || "unknown";

    // Transformation cost: 1 for code-changing tasks, 0 otherwise
    // W4: Instability transforms (infrastructure fixes) don't count against mission budget
    const COST_TASKS = ["transform", "fix-code", "maintain-features", "maintain-library"];
    const isNop = result.outcome === "nop" || result.outcome === "error";
    let isInstabilityTransform = false;
    if (issueNumber && COST_TASKS.includes(task) && !isNop) {
      try {
        const { data: issueData } = await context.octokit.rest.issues.get({
          ...context.repo,
          issue_number: Number(issueNumber),
        });
        isInstabilityTransform = issueData.labels.some((l) => l.name === "instability");
        if (isInstabilityTransform) {
          core.info(`Issue #${issueNumber} has instability label — transform does not count against mission budget`);
        }
      } catch { /* ignore — conservative: count as mission transform */ }
    }
    const transformationCost = COST_TASKS.includes(task) && !isNop && !isInstabilityTransform ? 1 : 0;

    // Read cumulative transformation cost from the activity log
    const intentionFilepath = config.intentionBot?.intentionFilepath;
    let cumulativeCost = 0;
    if (intentionFilepath && existsSync(intentionFilepath)) {
      const logContent = readFileSync(intentionFilepath, "utf8");
      const costMatches = logContent.matchAll(/\*\*agentic-lib transformation cost:\*\* (\d+)/g);
      cumulativeCost = [...costMatches].reduce((sum, m) => sum + parseInt(m[1], 10), 0);
    }
    cumulativeCost += transformationCost;

    // Count features and library docs on disk
    const featuresPath = config.paths?.features?.path;
    const featuresUsed = featuresPath && existsSync(featuresPath)
      ? readdirSync(featuresPath).filter((f) => f.endsWith(".md")).length
      : 0;
    const libraryPath = config.paths?.library?.path;
    const libraryUsed = libraryPath && existsSync(libraryPath)
      ? readdirSync(libraryPath).filter((f) => f.endsWith(".md")).length
      : 0;

    // W3/W10: Detect dedicated test files (centrally, for all tasks)
    let hasDedicatedTests = result.hasDedicatedTests ?? false;
    if (!hasDedicatedTests) {
      try {
        const { scanDirectory: scanDir } = await import("./copilot.js");
        const testDirs = ["tests", "__tests__"];
        for (const dir of testDirs) {
          if (existsSync(dir)) {
            const testFiles = scanDir(dir, [".js", ".ts", ".mjs"], { limit: 20 });
            for (const tf of testFiles) {
              if (/^(main|web|behaviour)\.test\.[jt]s$/.test(tf.name)) continue;
              const content = readFileSync(tf.path, "utf8");
              if (/from\s+['"].*src\/lib\//.test(content) || /require\s*\(\s*['"].*src\/lib\//.test(content)) {
                hasDedicatedTests = true;
                break;
              }
            }
            if (hasDedicatedTests) break;
          }
        }
      } catch { /* ignore — scanDirectory not available in test environment */ }
    }
    // Inject hasDedicatedTests into result for buildMissionMetrics
    result.hasDedicatedTests = hasDedicatedTests;

    // Count open automated issues (feature vs maintenance)
    let featureIssueCount = 0;
    let maintenanceIssueCount = 0;
    try {
      const { data: openAutoIssues } = await context.octokit.rest.issues.listForRepo({
        ...context.repo,
        state: "open",
        labels: "automated",
        per_page: 50,
      });
      for (const oi of openAutoIssues.filter((i) => !i.pull_request)) {
        const lbls = oi.labels.map((l) => l.name);
        if (lbls.includes("maintenance")) maintenanceIssueCount++;
        else featureIssueCount++;
      }
    } catch (_) { /* API not available */ }

    const budgetCap = config.transformationBudget || 0;
    const featCap = config.paths?.features?.limit || 4;
    const libCap = config.paths?.library?.limit || 32;

    // Compute limits status with actual values
    const limitsStatus = [
      { name: "transformation-budget", valueNum: cumulativeCost, capacityNum: budgetCap, value: `${cumulativeCost}/${budgetCap}`, remaining: `${Math.max(0, budgetCap - cumulativeCost)}`, status: cumulativeCost >= budgetCap && budgetCap > 0 ? "EXHAUSTED" : "" },
      { name: "max-feature-issues", valueNum: featureIssueCount, capacityNum: config.featureDevelopmentIssuesWipLimit, value: `${featureIssueCount}/${config.featureDevelopmentIssuesWipLimit}`, remaining: `${Math.max(0, config.featureDevelopmentIssuesWipLimit - featureIssueCount)}`, status: "" },
      { name: "max-maintenance-issues", valueNum: maintenanceIssueCount, capacityNum: config.maintenanceIssuesWipLimit, value: `${maintenanceIssueCount}/${config.maintenanceIssuesWipLimit}`, remaining: `${Math.max(0, config.maintenanceIssuesWipLimit - maintenanceIssueCount)}`, status: "" },
      { name: "max-attempts-per-issue", valueNum: 0, capacityNum: config.attemptsPerIssue, value: `?/${config.attemptsPerIssue}`, remaining: "?", status: task === "resolve-issue" ? "" : "n/a" },
      { name: "max-attempts-per-branch", valueNum: 0, capacityNum: config.attemptsPerBranch, value: `?/${config.attemptsPerBranch}`, remaining: "?", status: task === "fix-code" ? "" : "n/a" },
      { name: "features", valueNum: featuresUsed, capacityNum: featCap, value: `${featuresUsed}/${featCap}`, remaining: `${Math.max(0, featCap - featuresUsed)}`, status: ["maintain-features", "transform"].includes(task) ? "" : "n/a" },
      { name: "library", valueNum: libraryUsed, capacityNum: libCap, value: `${libraryUsed}/${libCap}`, remaining: `${Math.max(0, libCap - libraryUsed)}`, status: task === "maintain-library" ? "" : "n/a" },
    ];

    // Merge task-reported limits if available
    if (result.limitsStatus) {
      for (const reported of result.limitsStatus) {
        const existing = limitsStatus.find((ls) => ls.name === reported.name);
        if (existing) Object.assign(existing, reported);
      }
    }

    const closingNotes = result.closingNotes || generateClosingNotes(limitsStatus);

    // Build mission-complete metrics and readiness narrative
    const missionMetrics = buildMissionMetrics(config, result, limitsStatus, cumulativeCost, featureIssueCount, maintenanceIssueCount);
    const missionReadiness = buildMissionReadiness(missionMetrics);

    // Log to intentïon.md (commit-if-changed excludes this on non-default branches)
    if (intentionFilepath) {
      logActivity({
        filepath: intentionFilepath,
        task,
        outcome: result.outcome || "completed",
        issueNumber,
        prNumber: result.prNumber,
        commitUrl: result.commitUrl,
        tokensUsed: result.tokensUsed,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        cost: result.cost,
        durationMs,
        model: result.model || model,
        details: result.details,
        workflowUrl: `${process.env.GITHUB_SERVER_URL}/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`,
        profile: profileName,
        changes: result.changes,
        contextNotes: result.contextNotes,
        limitsStatus,
        promptBudget: result.promptBudget,
        missionReadiness,
        missionMetrics,
        closingNotes,
        transformationCost,
        narrative: result.narrative,
      });
    }

    core.info(`agentic-step completed: outcome=${result.outcome}`);
  } catch (error) {
    core.setFailed(`agentic-step failed: ${error.message}`);
  }
}

run();
