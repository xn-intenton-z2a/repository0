// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/fix-code.js — Fix failing tests or resolve merge conflicts on a PR
//
// Uses runCopilotSession with lean prompts: the model reads files, analyzes
// failures, writes fixes, and runs tests via tools.

import * as core from "@actions/core";
import { readFileSync } from "fs";
import { execSync } from "child_process";
import { formatPathsSection, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools, createGitTools } from "../../../copilot/github-tools.js";

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
 */
async function resolveConflicts({ config, pr, prNumber, instructions, model, writablePaths, testCommand, octokit, repo, logFilePath, screenshotFilePath }) {
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
    formatPathsSection(writablePaths, config.readOnlyPaths, config),
    "",
    "## Constraints",
    "- Remove ALL conflict markers (<<<<<<, =======, >>>>>>>)",
    "- Preserve the PR's feature/fix intent",
    `- Run \`${testCommand}\` via run_tests to validate your resolution`,
  ].join("\n");

  const t = config.tuning || {};
  const systemPrompt =
    `You are resolving git merge conflicts on PR #${prNumber}. Write resolved versions of each conflicted file, removing all conflict markers. Preserve the PR's feature intent while incorporating main's updates.` +
    NARRATIVE_INSTRUCTION;

  const createTools = (defineTool, _wp, logger) => {
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);
    const gitTools = createGitTools(defineTool, logger);
    return [...ghTools, ...gitTools];
  };

  const attachments = [];
  if (logFilePath) attachments.push({ type: "file", path: logFilePath });
  if (screenshotFilePath) attachments.push({ type: "file", path: screenshotFilePath });

  const result = await runCopilotSession({
    workspacePath: process.cwd(),
    model,
    tuning: t,
    agentPrompt: systemPrompt,
    userPrompt: prompt,
    writablePaths,
    createTools,
    attachments,
    excludedTools: ["dispatch_workflow", "close_issue", "label_issue", "post_discussion_comment"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  core.info(`Conflict resolution completed (${result.tokensIn + result.tokensOut} tokens)`);

  return {
    outcome: "conflicts-resolved",
    tokensUsed: result.tokensIn + result.tokensOut,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: `Resolved ${conflicts.length} conflicted file(s) on PR #${prNumber}`,
    narrative: result.narrative || extractNarrative(result.agentMessage, `Resolved ${conflicts.length} merge conflict(s) on PR #${prNumber}.`),
  };
}

/**
 * Fix a broken main branch build.
 */
async function fixMainBuild({ config, runId, instructions, model, writablePaths, testCommand, octokit, repo, logFilePath, screenshotFilePath }) {
  const logContent = fetchRunLog(runId);
  if (!logContent) {
    core.info(`Could not fetch log for run ${runId}. Returning nop.`);
    return { outcome: "nop", details: `Could not fetch log for run ${runId}` };
  }

  const agentInstructions = instructions || "Fix the failing tests by modifying the source code.";

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
    "## Your Task",
    "Use read_file to read the relevant source and test files.",
    "Make minimal changes to fix the failing tests, then run run_tests to verify.",
    "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config),
    "",
    "## Constraints",
    `- Run \`${testCommand}\` via run_tests to validate your fixes`,
    "- Make minimal changes to fix the failing tests",
    "- Do not introduce new features — focus on making the build green",
  ].join("\n");

  const t = config.tuning || {};
  const systemPrompt =
    `You are an autonomous coding agent fixing a broken build on the main branch. The test/build workflow has failed. Analyze the error log and make minimal, targeted changes to fix it.` +
    NARRATIVE_INSTRUCTION;

  const createTools = (defineTool, _wp, logger) => {
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);
    const gitTools = createGitTools(defineTool, logger);
    return [...ghTools, ...gitTools];
  };

  const attachments = [];
  if (logFilePath) attachments.push({ type: "file", path: logFilePath });
  if (screenshotFilePath) attachments.push({ type: "file", path: screenshotFilePath });

  const result = await runCopilotSession({
    workspacePath: process.cwd(),
    model,
    tuning: t,
    agentPrompt: systemPrompt,
    userPrompt: prompt,
    writablePaths,
    createTools,
    attachments,
    excludedTools: ["dispatch_workflow", "close_issue", "label_issue", "post_discussion_comment"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  core.info(`Main build fix completed (${result.tokensIn + result.tokensOut} tokens)`);

  return {
    outcome: "fix-applied",
    tokensUsed: result.tokensIn + result.tokensOut,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: `Applied fix for broken main build (run ${runId})`,
    narrative: result.narrative || extractNarrative(result.agentMessage, `Fixed broken main build (run ${runId}).`),
  };
}

/**
 * Fix failing code or resolve merge conflicts on a pull request,
 * or fix a broken build on main.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function fixCode(context) {
  const { octokit, repo, config, prNumber, instructions, writablePaths, testCommand, model, logFilePath, screenshotFilePath } = context;

  // Fix main build (no PR involved)
  const fixRunId = process.env.FIX_RUN_ID || "";
  if (fixRunId && !prNumber) {
    return fixMainBuild({ config, runId: fixRunId, instructions, model, writablePaths, testCommand, octokit, repo, logFilePath, screenshotFilePath });
  }

  if (!prNumber) {
    throw new Error("fix-code task requires pr-number input or FIX_RUN_ID env var");
  }

  // Fetch the PR
  const { data: pr } = await octokit.rest.pulls.get({ ...repo, pull_number: Number(prNumber) });

  // If we have non-trivial conflict files from the workflow's Tier 1 step, resolve them
  if (process.env.NON_TRIVIAL_FILES) {
    return resolveConflicts({ config, pr, prNumber, instructions, model, writablePaths, testCommand, octokit, repo, logFilePath, screenshotFilePath });
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
    "## Your Task",
    "Use read_file to read the relevant source and test files.",
    "Make minimal changes to fix the failures, then run run_tests to verify.",
    "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config),
    "",
    "## Constraints",
    `- Run \`${testCommand}\` via run_tests to validate your fixes`,
    "- Make minimal changes to fix the failing tests",
  ].join("\n");

  const t = config.tuning || {};
  const systemPrompt =
    `You are an autonomous coding agent fixing failing tests on PR #${prNumber}. Make minimal, targeted changes to fix the test failures.` +
    NARRATIVE_INSTRUCTION;

  const createTools = (defineTool, _wp, logger) => {
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);
    const gitTools = createGitTools(defineTool, logger);
    return [...ghTools, ...gitTools];
  };

  const attachments = [];
  if (logFilePath) attachments.push({ type: "file", path: logFilePath });
  if (screenshotFilePath) attachments.push({ type: "file", path: screenshotFilePath });

  const result = await runCopilotSession({
    workspacePath: process.cwd(),
    model,
    tuning: t,
    agentPrompt: systemPrompt,
    userPrompt: prompt,
    writablePaths,
    createTools,
    attachments,
    excludedTools: ["dispatch_workflow", "close_issue", "label_issue", "post_discussion_comment"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  core.info(`Fix response received (${result.tokensIn + result.tokensOut} tokens)`);

  return {
    outcome: "fix-applied",
    tokensUsed: result.tokensIn + result.tokensOut,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: `Applied fix for ${failedChecks.length} failing check(s) on PR #${prNumber}`,
    narrative: result.narrative || extractNarrative(result.agentMessage, `Fixed ${failedChecks.length} failing check(s) on PR #${prNumber}.`),
  };
}
