// tasks/resolve-issue.js — Issue → code → PR
//
// Given an issue number, reads the issue, generates code using the Copilot SDK,
// validates with tests, and creates a PR.

import * as core from "@actions/core";
import { checkAttemptLimit, checkWipLimit, isIssueResolved } from "../safety.js";
import { runCopilotTask, readOptionalFile, formatPathsSection } from "../copilot.js";

/**
 * Resolve a GitHub issue by generating code and creating a PR.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, prNumber, tokensUsed, model
 */
export async function resolveIssue(context) {
  const { octokit, repo, config, issueNumber, instructions, writablePaths, testCommand, model } = context;

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

  const contributing = readOptionalFile(config.paths.contributingFilepath?.path || "CONTRIBUTING.md");
  const agentInstructions = instructions || "Resolve the GitHub issue by writing code that satisfies the requirements.";
  const readOnlyPaths = config.readOnlyPaths || [];

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
    formatPathsSection(writablePaths, readOnlyPaths),
    "",
    "## Constraints",
    `- Run \`${testCommand}\` to validate your changes`,
    contributing ? `\n## Contributing Guidelines\n${contributing}` : "",
  ].join("\n");

  const { content: resultContent, tokensUsed } = await runCopilotTask({
    model,
    systemMessage: `You are an autonomous coding agent resolving GitHub issue #${issueNumber}. Write clean, tested code. Only modify files listed under "Writable" paths. Read-only paths are for context only.`,
    prompt,
    writablePaths,
  });

  core.info(`Copilot SDK response received (${tokensUsed} tokens)`);

  return {
    outcome: "code-generated",
    prNumber: null,
    tokensUsed,
    model,
    commitUrl: null,
    details: `Generated code for issue #${issueNumber}: ${resultContent.substring(0, 200)}`,
  };
}
