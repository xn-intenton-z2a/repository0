// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// index.js — agentic-step GitHub Action entry point (thin adapter)
//
// Parses inputs, loads config, runs the appropriate task handler,
// computes metrics via shared telemetry, and sets outputs.

import * as core from "@actions/core";
import * as github from "@actions/github";
import { loadConfig, getWritablePaths } from "./config-loader.js";
import { logActivity, generateClosingNotes } from "./logging.js";
import { readFileSync } from "fs";
import {
  buildMissionMetrics, buildMissionReadiness,
  computeTransformationCost, readCumulativeCost, buildLimitsStatus,
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

const TASKS = {
  "resolve-issue": resolveIssue, "fix-code": fixCode, "transform": transform,
  "maintain-features": maintainFeatures, "maintain-library": maintainLibrary,
  "enhance-issue": enhanceIssue, "review-issue": reviewIssue,
  "discussions": discussions, "supervise": supervise, "direct": direct,
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

    const context = {
      task, config, instructions, issueNumber, writablePaths, testCommand, model,
      prNumber: core.getInput("pr-number"),
      discussionUrl: core.getInput("discussion-url"),
      commentNodeId: core.getInput("comment-node-id"),
      commentCreatedAt: core.getInput("comment-created-at"),
      octokit: github.getOctokit(process.env.GITHUB_TOKEN),
      repo: github.context.repo, github: github.context,
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
    const intentionFilepath = config.intentionBot?.intentionFilepath;
    const cumulativeCost = readCumulativeCost(intentionFilepath) + transformationCost;

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

    if (intentionFilepath) {
      logActivity({
        filepath: intentionFilepath, task, outcome: result.outcome || "completed",
        issueNumber, prNumber: result.prNumber, commitUrl: result.commitUrl,
        tokensUsed: result.tokensUsed, inputTokens: result.inputTokens,
        outputTokens: result.outputTokens, cost: result.cost, durationMs,
        model: result.model || model, details: result.details,
        workflowUrl: `${process.env.GITHUB_SERVER_URL}/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`,
        profile: config.tuning?.profileName || "unknown",
        changes: result.changes, contextNotes: result.contextNotes,
        limitsStatus, promptBudget: result.promptBudget,
        missionReadiness: buildMissionReadiness(missionMetrics),
        missionMetrics, closingNotes: result.closingNotes || generateClosingNotes(limitsStatus),
        transformationCost, narrative: result.narrative,
      });
    }

    core.info(`agentic-step completed: outcome=${result.outcome}`);
  } catch (error) {
    core.setFailed(`agentic-step failed: ${error.message}`);
  }
}

run();
