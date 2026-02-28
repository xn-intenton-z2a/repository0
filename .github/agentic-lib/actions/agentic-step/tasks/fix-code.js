// tasks/fix-code.js — Fix failing tests on a PR
//
// Given a PR number with failing tests, analyzes the test output,
// generates fixes using the Copilot SDK, and pushes a commit.

import * as core from "@actions/core";
import { runCopilotTask, formatPathsSection } from "../copilot.js";

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

  const failureDetails = failedChecks.map((cr) => `**${cr.name}:** ${cr.output?.summary || "Failed"}`).join("\n");
  const agentInstructions = instructions || "Fix the failing tests by modifying the source code.";
  const readOnlyPaths = config.readOnlyPaths || [];

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
    formatPathsSection(writablePaths, readOnlyPaths),
    "",
    "## Constraints",
    `- Run \`${testCommand}\` to validate your fixes`,
    "- Make minimal changes to fix the failing tests",
  ].join("\n");

  const { tokensUsed } = await runCopilotTask({
    model,
    systemMessage: `You are an autonomous coding agent fixing failing tests on PR #${prNumber}. Make minimal, targeted changes to fix the test failures.`,
    prompt,
    writablePaths,
  });

  core.info(`Copilot SDK fix response received (${tokensUsed} tokens)`);

  return {
    outcome: "fix-applied",
    tokensUsed,
    model,
    details: `Applied fix for ${failedChecks.length} failing check(s) on PR #${prNumber}`,
  };
}
