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
import { readFileSync, existsSync, readdirSync } from "fs";

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
};

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
    const COST_TASKS = ["transform", "fix-code", "maintain-features", "maintain-library"];
    const isNop = result.outcome === "nop" || result.outcome === "error";
    const transformationCost = COST_TASKS.includes(task) && !isNop ? 1 : 0;

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
