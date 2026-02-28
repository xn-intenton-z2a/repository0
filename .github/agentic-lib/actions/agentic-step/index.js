// index.js — agentic-step GitHub Action entry point
//
// Parses inputs, loads config, runs the appropriate task via the Copilot SDK,
// and sets outputs for downstream workflow steps.

import * as core from "@actions/core";
import * as github from "@actions/github";
import { loadConfig, getWritablePaths } from "./config-loader.js";
import { logActivity } from "./logging.js";
import { readFileSync } from "fs";

// Task implementations
import { resolveIssue } from "./tasks/resolve-issue.js";
import { fixCode } from "./tasks/fix-code.js";
import { transform } from "./tasks/transform.js";
import { maintainFeatures } from "./tasks/maintain-features.js";
import { maintainLibrary } from "./tasks/maintain-library.js";
import { enhanceIssue } from "./tasks/enhance-issue.js";
import { reviewIssue } from "./tasks/review-issue.js";
import { discussions } from "./tasks/discussions.js";

const TASKS = {
  "resolve-issue": resolveIssue,
  "fix-code": fixCode,
  "transform": transform,
  "maintain-features": maintainFeatures,
  "maintain-library": maintainLibrary,
  "enhance-issue": enhanceIssue,
  "review-issue": reviewIssue,
  "discussions": discussions,
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
    const testCommand = core.getInput("test-command");
    const discussionUrl = core.getInput("discussion-url");
    const model = core.getInput("model");

    core.info(`agentic-step: task=${task}, model=${model}`);

    // Load config
    const config = loadConfig(configPath);
    const writablePaths = getWritablePaths(config, writablePathsOverride);

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
      model,
      octokit: github.getOctokit(process.env.GITHUB_TOKEN),
      repo: github.context.repo,
      github: github.context,
    };

    // Run the task
    const result = await handler(context);

    // Set outputs
    core.setOutput("result", result.outcome || "completed");
    if (result.prNumber) core.setOutput("pr-number", String(result.prNumber));
    if (result.tokensUsed) core.setOutput("tokens-used", String(result.tokensUsed));
    if (result.model) core.setOutput("model", result.model);

    // Log to intentïon.md
    const intentionFilepath = config.intentionBot?.intentionFilepath;
    if (intentionFilepath) {
      logActivity({
        filepath: intentionFilepath,
        task,
        outcome: result.outcome || "completed",
        issueNumber,
        prNumber: result.prNumber,
        commitUrl: result.commitUrl,
        tokensUsed: result.tokensUsed,
        model: result.model || model,
        details: result.details,
        workflowUrl: `${process.env.GITHUB_SERVER_URL}/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`,
      });
    }

    core.info(`agentic-step completed: outcome=${result.outcome}`);
  } catch (error) {
    core.setFailed(`agentic-step failed: ${error.message}`);
  }
}

run();
