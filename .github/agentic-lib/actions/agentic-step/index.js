// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// index.js — agentic-step GitHub Action entry point (thin adapter)
//
// Parses inputs, loads config, runs the appropriate task handler,
// computes metrics via shared telemetry, and sets outputs.

import * as core from "@actions/core";
import * as github from "@actions/github";
import { loadConfig, getWritablePaths } from "./config-loader.js";
import { generateClosingNotes, writeAgentLog } from "./logging.js";
import { readFileSync, existsSync, readdirSync } from "fs";
import {
  buildMissionMetrics, buildMissionReadiness,
  computeTransformationCost, buildLimitsStatus,
} from "../../copilot/telemetry.js";
import {
  checkInstabilityLabel, countDedicatedTests,
  countOpenIssues, countResolvedIssues, countMdFiles,
} from "./metrics.js";

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
import { implementationReview } from "./tasks/implementation-review.js";

const TASKS = {
  "resolve-issue": resolveIssue, "fix-code": fixCode, "transform": transform,
  "maintain-features": maintainFeatures, "maintain-library": maintainLibrary,
  "enhance-issue": enhanceIssue, "review-issue": reviewIssue,
  "discussions": discussions, "supervise": supervise, "direct": direct,
  "implementation-review": implementationReview,
};

async function run() {
  try {
    const task = core.getInput("task", { required: true });
    const configPath = core.getInput("config");
    const instructionsPath = core.getInput("instructions");
    const issueNumber = core.getInput("issue-number");
    const model = core.getInput("model");
    core.info(`agentic-step: task=${task}, model=${model}`);

    const config = loadConfig(configPath);
    const writablePaths = getWritablePaths(config, core.getInput("writable-paths"));
    const testCommand = core.getInput("test-command") || config.testScript;

    let instructions = "";
    if (instructionsPath) {
      try { instructions = readFileSync(instructionsPath, "utf8"); }
      catch (err) { core.warning(`Could not read instructions: ${err.message}`); }
    }

    const handler = TASKS[task];
    if (!handler) throw new Error(`Unknown task: ${task}. Available: ${Object.keys(TASKS).join(", ")}`);

    // Resolve log and screenshot paths (fetched from agentic-lib-logs branch by workflow)
    const logPrefix = config.intentionBot?.logPrefix || "agent-log-";
    const screenshotFile = config.intentionBot?.screenshotFile || "SCREENSHOT_INDEX.png";
    // Find the most recent agent-log file matching the prefix for LLM context
    const logDir = logPrefix.includes("/") ? logPrefix.substring(0, logPrefix.lastIndexOf("/")) : ".";
    const logBase = logPrefix.includes("/") ? logPrefix.substring(logPrefix.lastIndexOf("/") + 1) : logPrefix;
    let logFilePath = null;
    try {
      const logFiles = readdirSync(logDir)
        .filter(f => f.startsWith(logBase) && f.endsWith(".md"))
        .sort();
      if (logFiles.length > 0) {
        const newest = logFiles[logFiles.length - 1];
        const candidate = logDir === "." ? newest : `${logDir}/${newest}`;
        if (existsSync(candidate)) logFilePath = candidate;
      }
    } catch { /* no log files yet */ }
    const screenshotFilePath = existsSync(screenshotFile) ? screenshotFile : null;

    const context = {
      task, config, instructions, issueNumber, writablePaths, testCommand, model,
      prNumber: core.getInput("pr-number"),
      discussionUrl: core.getInput("discussion-url"),
      commentNodeId: core.getInput("comment-node-id"),
      commentCreatedAt: core.getInput("comment-created-at"),
      octokit: github.getOctokit(process.env.GITHUB_TOKEN),
      repo: github.context.repo, github: github.context,
      logFilePath, screenshotFilePath,
    };

    const startTime = Date.now();
    const result = await handler(context);
    const durationMs = Date.now() - startTime;

    // Set outputs
    core.setOutput("result", result.outcome || "completed");
    for (const [key, field] of [["pr-number", "prNumber"], ["tokens-used", "tokensUsed"], ["model", "model"], ["action", "action"], ["action-arg", "actionArg"], ["narrative", "narrative"]]) {
      if (result[field]) core.setOutput(key, String(result[field]));
    }

    // Compute metrics
    const COST_TASKS = ["transform", "fix-code", "maintain-features", "maintain-library"];
    const isNop = result.outcome === "nop" || result.outcome === "error";
    const isInstability = issueNumber && COST_TASKS.includes(task) && !isNop
      && await checkInstabilityLabel(context, issueNumber);
    if (isInstability) core.info(`Issue #${issueNumber} has instability label — does not count against budget`);
    const transformationCost = computeTransformationCost(task, result.outcome, isInstability);
    const cumulativeCost = transformationCost;

    if (result.dedicatedTestCount == null || result.dedicatedTestCount === 0) {
      try {
        const { scanDirectory: scanDir } = await import("./copilot.js");
        result.dedicatedTestCount = countDedicatedTests(scanDir);
      } catch { /* ignore */ }
    }

    const { featureIssueCount, maintenanceIssueCount } = await countOpenIssues(context);
    if (result.resolvedCount == null) result.resolvedCount = await countResolvedIssues(context);

    const limitsStatus = buildLimitsStatus({
      task, cumulativeCost, config, featureIssueCount, maintenanceIssueCount,
      featuresUsed: countMdFiles(config.paths?.features?.path),
      libraryUsed: countMdFiles(config.paths?.library?.path),
    });
    if (result.limitsStatus) {
      for (const r of result.limitsStatus) {
        const e = limitsStatus.find((ls) => ls.name === r.name);
        if (e) Object.assign(e, r);
      }
    }

    const missionMetrics = buildMissionMetrics(config, result, limitsStatus, cumulativeCost, featureIssueCount, maintenanceIssueCount);

    // Write standalone agent log file (pushed to agentic-lib-logs branch by workflow)
    try {
      const agentLogFile = writeAgentLog({
        task, outcome: result.outcome || "completed",
        model: result.model || model, durationMs, tokensUsed: result.tokensUsed,
        narrative: result.narrative, contextNotes: result.contextNotes,
        reviewTable: result.reviewTable, completenessAdvice: result.completenessAdvice,
        missionMetrics,
      });
      core.info(`Agent log written: ${agentLogFile}`);
    } catch (err) {
      core.warning(`Could not write agent log: ${err.message}`);
    }

    core.info(`agentic-step completed: outcome=${result.outcome}`);
  } catch (error) {
    core.setFailed(`agentic-step failed: ${error.message}`);
  }
}

run();
