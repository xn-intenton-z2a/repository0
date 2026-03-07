// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/fix-code.js — Fix failing tests or resolve merge conflicts on a PR
//
// Given a PR number, detects merge conflicts or failing checks and resolves them.
// Conflict resolution: reads files with conflict markers, asks the LLM to resolve.
// Failing checks: analyzes test output, generates code fixes.

import * as core from "@actions/core";
import { readFileSync } from "fs";
import { execSync } from "child_process";
import { runCopilotTask, formatPathsSection, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";

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
 * Resolve merge conflicts on a PR using the Copilot SDK.
 * Called when the workflow has started a `git merge origin/main` that left
 * conflict markers in non-trivial files (listed in NON_TRIVIAL_FILES env var).
 *
 * @param {Object} params
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
async function resolveConflicts({ config, pr, prNumber, instructions, model, writablePaths, testCommand }) {
  const nonTrivialEnv = process.env.NON_TRIVIAL_FILES || "";
  const conflictedPaths = nonTrivialEnv
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  if (conflictedPaths.length === 0) {
    core.info(`PR #${prNumber} has conflicts but no non-trivial files listed. Returning nop.`);
    return { outcome: "nop", details: "No non-trivial conflict files to resolve" };
  }

  core.info(`Resolving ${conflictedPaths.length} conflicted file(s) on PR #${prNumber}`);

  const conflicts = conflictedPaths.map((f) => {
    try {
      return { name: f, content: readFileSync(f, "utf8") };
    } catch (err) {
      core.warning(`Could not read conflicted file ${f}: ${err.message}`);
      return { name: f, content: "(could not read)" };
    }
  });

  const agentInstructions = instructions || "Resolve the merge conflicts while preserving the PR's intended changes.";
  const readOnlyPaths = config.readOnlyPaths;

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    `## Pull Request #${prNumber}: ${pr.title}`,
    "",
    pr.body || "(no description)",
    "",
    "## Task: Resolve Merge Conflicts",
    "The PR branch has been merged with main but has conflicts in the files below.",
    "Each file contains git conflict markers (<<<<<<< / ======= / >>>>>>>).",
    "Resolve each conflict by keeping the PR's intended changes while incorporating",
    "any non-conflicting updates from main.",
    "",
    `## Conflicted Files (${conflicts.length})`,
    ...conflicts.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
    "",
    formatPathsSection(writablePaths, readOnlyPaths, config),
    "",
    "## Constraints",
    "- Remove ALL conflict markers (<<<<<<, =======, >>>>>>>)",
    "- Preserve the PR's feature/fix intent",
    `- Run \`${testCommand}\` to validate your resolution`,
  ].join("\n");

  const t = config.tuning || {};
  const { tokensUsed, inputTokens, outputTokens, cost, content: resultContent } = await runCopilotTask({
    model,
    systemMessage: `You are resolving git merge conflicts on PR #${prNumber}. Write resolved versions of each conflicted file, removing all conflict markers. Preserve the PR's feature intent while incorporating main's updates.` + NARRATIVE_INSTRUCTION,
    prompt,
    writablePaths,
    tuning: t,
  });

  core.info(`Conflict resolution completed (${tokensUsed} tokens)`);

  return {
    outcome: "conflicts-resolved",
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Resolved ${conflicts.length} conflicted file(s) on PR #${prNumber}`,
    narrative: extractNarrative(resultContent, `Resolved ${conflicts.length} merge conflict(s) on PR #${prNumber}.`),
  };
}

/**
 * Fix a broken main branch build.
 * Called when no PR is involved — just a failing workflow run on main.
 */
async function fixMainBuild({ config, runId, instructions, model, writablePaths, testCommand }) {
  const logContent = fetchRunLog(runId);
  if (!logContent) {
    core.info(`Could not fetch log for run ${runId}. Returning nop.`);
    return { outcome: "nop", details: `Could not fetch log for run ${runId}` };
  }

  const agentInstructions = instructions || "Fix the failing tests by modifying the source code.";
  const readOnlyPaths = config.readOnlyPaths;

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    "## Broken Build on Main",
    `Workflow run ${runId} failed on the main branch.`,
    "Fix the code so that the build passes.",
    "",
    "## Failed Run Log",
    logContent,
    "",
    formatPathsSection(writablePaths, readOnlyPaths, config),
    "",
    "## Constraints",
    `- Run \`${testCommand}\` to validate your fixes`,
    "- Make minimal changes to fix the failing tests",
    "- Do not introduce new features — focus on making the build green",
  ].join("\n");

  const t = config.tuning || {};
  const { tokensUsed, inputTokens, outputTokens, cost, content: resultContent } = await runCopilotTask({
    model,
    systemMessage: `You are an autonomous coding agent fixing a broken build on the main branch. The test/build workflow has failed. Analyze the error log and make minimal, targeted changes to fix it.` + NARRATIVE_INSTRUCTION,
    prompt,
    writablePaths,
    tuning: t,
  });

  core.info(`Main build fix completed (${tokensUsed} tokens)`);

  return {
    outcome: "fix-applied",
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Applied fix for broken main build (run ${runId})`,
    narrative: extractNarrative(resultContent, `Fixed broken main build (run ${runId}).`),
  };
}

/**
 * Fix failing code or resolve merge conflicts on a pull request,
 * or fix a broken build on main.
 *
 * Priority: main build fix (if FIX_RUN_ID env is set),
 * then conflicts (if NON_TRIVIAL_FILES env is set), then failing checks.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function fixCode(context) {
  const { octokit, repo, config, prNumber, instructions, writablePaths, testCommand, model } = context;

  // Fix main build (no PR involved)
  const fixRunId = process.env.FIX_RUN_ID || "";
  if (fixRunId && !prNumber) {
    return fixMainBuild({ config, runId: fixRunId, instructions, model, writablePaths, testCommand });
  }

  if (!prNumber) {
    throw new Error("fix-code task requires pr-number input or FIX_RUN_ID env var");
  }

  // Fetch the PR
  const { data: pr } = await octokit.rest.pulls.get({ ...repo, pull_number: Number(prNumber) });

  // If we have non-trivial conflict files from the workflow's Tier 1 step, resolve them
  if (process.env.NON_TRIVIAL_FILES) {
    return resolveConflicts({ config, pr, prNumber, instructions, model, writablePaths, testCommand });
  }

  // Otherwise, check for failing checks
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
  const { tokensUsed, inputTokens, outputTokens, cost, content: resultContent } = await runCopilotTask({
    model,
    systemMessage: `You are an autonomous coding agent fixing failing tests on PR #${prNumber}. Make minimal, targeted changes to fix the test failures.` + NARRATIVE_INSTRUCTION,
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
    narrative: extractNarrative(resultContent, `Fixed ${failedChecks.length} failing check(s) on PR #${prNumber}.`),
  };
}
