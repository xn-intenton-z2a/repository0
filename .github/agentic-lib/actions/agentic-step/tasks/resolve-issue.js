// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/resolve-issue.js — Issue → code → PR
//
// Uses runCopilotSession with lean prompts: the model reads source files,
// writes code, and runs tests via tools.

import * as core from "@actions/core";
import { checkAttemptLimit, checkWipLimit, isIssueResolved } from "../safety.js";
import { readOptionalFile, formatPathsSection, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools, createGitTools } from "../../../copilot/github-tools.js";

/**
 * Resolve a GitHub issue by generating code and creating a PR.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, prNumber, tokensUsed, model
 */
export async function resolveIssue(context) {
  const { octokit, repo, config, issueNumber, instructions, writablePaths, testCommand, model, logFilePath, screenshotFilePath } = context;

  if (!issueNumber) {
    throw new Error("resolve-issue task requires issue-number input");
  }

  // Safety: check if issue is already resolved
  if (await isIssueResolved(octokit, repo, issueNumber)) {
    core.info(`Issue #${issueNumber} is already closed. Returning nop.`);
    return { outcome: "nop", details: "Issue already resolved" };
  }

  // Safety: check attempt limits
  const branchPrefix = "agentic-lib-issue-";
  const { allowed, attempts } = await checkAttemptLimit(
    octokit,
    repo,
    issueNumber,
    branchPrefix,
    config.attemptsPerIssue,
  );
  if (!allowed) {
    core.warning(`Issue #${issueNumber} has exceeded attempt limit (${attempts}/${config.attemptsPerIssue})`);
    return { outcome: "attempt-limit-exceeded", details: `${attempts} attempts exhausted` };
  }

  // Safety: check WIP limits
  const wipCheck = await checkWipLimit(octokit, repo, "in-progress", config.featureDevelopmentIssuesWipLimit);
  if (!wipCheck.allowed) {
    core.info(`WIP limit reached (${wipCheck.count}/${config.featureDevelopmentIssuesWipLimit}). Returning nop.`);
    return { outcome: "wip-limit-reached", details: `${wipCheck.count} issues in progress` };
  }

  // Fetch the issue and comments
  const [{ data: issue }, { data: comments }] = await Promise.all([
    octokit.rest.issues.get({ ...repo, issue_number: Number(issueNumber) }),
    octokit.rest.issues.listComments({ ...repo, issue_number: Number(issueNumber), per_page: 10 }),
  ]);

  const contributing = readOptionalFile(config.paths.contributing.path);
  const agentInstructions = instructions || "Resolve the GitHub issue by writing code that satisfies the requirements.";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    "## Issue",
    `#${issueNumber}: ${issue.title}`,
    "",
    issue.body || "(no description)",
    "",
    comments.length > 0 ? "## Issue Comments" : "",
    ...comments.map((c) => `**${c.user.login}:** ${c.body}`),
    "",
    "## Your Task",
    "Read the source files you need (use read_file tool).",
    "Write code to resolve this issue, then run run_tests to verify.",
    "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config),
    "",
    "## Constraints",
    `- Run \`${testCommand}\` via run_tests to validate your changes`,
    "- Use read_file to read source files (don't guess at contents)",
    contributing ? `\n## Contributing Guidelines\n${contributing}` : "",
  ].join("\n");

  const t = config.tuning || {};
  const systemPrompt =
    `You are an autonomous coding agent resolving GitHub issue #${issueNumber}. Write clean, tested code. Only modify files listed under "Writable" paths. Read-only paths are for context only.` +
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

  core.info(`Issue resolution completed (${result.tokensIn + result.tokensOut} tokens)`);

  return {
    outcome: "code-generated",
    prNumber: null,
    tokensUsed: result.tokensIn + result.tokensOut,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    commitUrl: null,
    details: `Generated code for issue #${issueNumber}: ${(result.agentMessage || "").substring(0, 200)}`,
    narrative: result.narrative || extractNarrative(result.agentMessage, `Generated code for issue #${issueNumber}.`),
  };
}
