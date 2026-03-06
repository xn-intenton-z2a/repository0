// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/fix-code.js — Fix failing tests on a PR
//
// Given a PR number with failing tests, analyzes the test output,
// generates fixes using the Copilot SDK, and pushes a commit.

import * as core from "@actions/core";
import { execSync } from "child_process";
import { runCopilotTask, formatPathsSection } from "../copilot.js";

/**
 * Extract run_id from a check run's details_url.
 * e.g. "https://github.com/owner/repo/actions/runs/12345" → "12345"
 */
function extractRunId(detailsUrl) {
  if (!detailsUrl) return null;
  const match = detailsUrl.match(/\/runs\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Fetch actual test output from a GitHub Actions run log.
 */
function fetchRunLog(runId) {
  try {
    const output = execSync(`gh run view ${runId} --log-failed`, {
      encoding: "utf8",
      timeout: 30000,
      env: { ...process.env },
    });
    return output.substring(0, 8000);
  } catch (err) {
    core.debug(`[fix-code] Could not fetch log for run ${runId}: ${err.message}`);
    return null;
  }
}

/**
 * Fix failing code on a pull request.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function fixCode(context) {
  const { octokit, repo, config, prNumber, instructions, writablePaths, testCommand, model } = context;

  if (!prNumber) {
    throw new Error("fix-code task requires pr-number input");
  }

  // Fetch the PR and check runs
  const { data: pr } = await octokit.rest.pulls.get({ ...repo, pull_number: Number(prNumber) });
  const { data: checkRuns } = await octokit.rest.checks.listForRef({ ...repo, ref: pr.head.sha, per_page: 10 });

  const failedChecks = checkRuns.check_runs.filter((cr) => cr.conclusion === "failure");
  if (failedChecks.length === 0) {
    core.info(`PR #${prNumber} has no failing checks. Returning nop.`);
    return { outcome: "nop", details: "No failing checks found" };
  }

  // Build detailed failure information with actual test logs where possible
  const failureDetails = failedChecks
    .map((cr) => {
      const runId = extractRunId(cr.details_url);
      let logContent = null;
      if (runId) {
        logContent = fetchRunLog(runId);
      }
      const detail = logContent || cr.output?.summary || "Failed";
      return `**${cr.name}:**\n${detail}`;
    })
    .join("\n\n");

  const agentInstructions = instructions || "Fix the failing tests by modifying the source code.";
  const readOnlyPaths = config.readOnlyPaths;

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    `## Pull Request #${prNumber}: ${pr.title}`,
    "",
    pr.body || "(no description)",
    "",
    "## Failing Checks",
    failureDetails,
    "",
    formatPathsSection(writablePaths, readOnlyPaths, config),
    "",
    "## Constraints",
    `- Run \`${testCommand}\` to validate your fixes`,
    "- Make minimal changes to fix the failing tests",
  ].join("\n");

  const t = config.tuning || {};
  const { tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage: `You are an autonomous coding agent fixing failing tests on PR #${prNumber}. Make minimal, targeted changes to fix the test failures.`,
    prompt,
    writablePaths,
    tuning: t,
  });

  core.info(`Copilot SDK fix response received (${tokensUsed} tokens)`);

  return {
    outcome: "fix-applied",
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Applied fix for ${failedChecks.length} failing check(s) on PR #${prNumber}`,
  };
}
