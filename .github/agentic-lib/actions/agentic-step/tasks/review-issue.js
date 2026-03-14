// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/review-issue.js — Review issues and close resolved ones
//
// Uses runCopilotSession with lean prompts: the model reads source files
// via tools to determine if issues have been resolved.

import * as core from "@actions/core";
import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools, createGitTools } from "../../../copilot/github-tools.js";

/**
 * Build a file listing summary (names + sizes, not content).
 */
function buildFileListing(dirPath, extensions) {
  if (!dirPath || !existsSync(dirPath)) return [];
  const exts = Array.isArray(extensions) ? extensions : [extensions];
  try {
    const files = readdirSync(dirPath, { recursive: true });
    return files
      .filter((f) => exts.some((ext) => String(f).endsWith(ext)))
      .map((f) => {
        const fullPath = join(dirPath, String(f));
        try {
          const stat = statSync(fullPath);
          return `${f} (~${Math.round(stat.size / 40)} lines)`;
        } catch {
          return String(f);
        }
      })
      .slice(0, 30);
  } catch {
    return [];
  }
}

/**
 * Review a single issue against the current codebase.
 */
async function reviewSingleIssue({ octokit, repo, config, targetIssueNumber, instructions, model, tuning: t, logFilePath, screenshotFilePath }) {
  const { data: issue } = await octokit.rest.issues.get({
    ...repo,
    issue_number: Number(targetIssueNumber),
  });

  if (issue.state === "closed") {
    return { outcome: "nop", details: `Issue #${targetIssueNumber} is already closed` };
  }

  const sourceFiles = buildFileListing(config.paths.source.path, [".js", ".ts"]);
  const testFiles = buildFileListing(config.paths.tests.path, [".js", ".ts"]);
  const webFiles = buildFileListing(config.paths.web?.path || "src/web/", [".html", ".css", ".js"]);

  const agentInstructions = instructions || "Review whether this issue has been resolved by the current codebase.";

  // Shared mutable state to capture the verdict
  const verdictResult = { verdict: "", resolved: false };

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    `## Issue #${targetIssueNumber}: ${issue.title}`,
    issue.body || "(no description)",
    "",
    "## Repository Structure",
    `Source files (${sourceFiles.length}): ${sourceFiles.join(", ") || "none"}`,
    `Test files (${testFiles.length}): ${testFiles.join(", ") || "none"}`,
    ...(webFiles.length > 0 ? [`Website files (${webFiles.length}): ${webFiles.join(", ")}`] : []),
    "",
    "## Your Task",
    "Read the relevant source and test files using read_file to determine if this issue has been resolved.",
    "Use git_diff or git_status for additional context if needed.",
    "Then call report_verdict with your determination.",
    "",
    "**You MUST call report_verdict exactly once.**",
  ].join("\n");

  const systemPrompt =
    "You are a code reviewer determining if a GitHub issue has been resolved by the current codebase. Read the source files, analyze them against the issue requirements, and report your verdict." +
    NARRATIVE_INSTRUCTION;

  const createTools = (defineTool, _wp, logger) => {
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);
    const gitTools = createGitTools(defineTool, logger);

    const reportVerdict = defineTool("report_verdict", {
      description: "Report whether the issue is resolved or still open. Call this exactly once.",
      parameters: {
        type: "object",
        properties: {
          resolved: { type: "boolean", description: "true if the issue is resolved, false if still open" },
          reason: { type: "string", description: "Explanation of why the issue is or is not resolved" },
          files_reviewed: { type: "number", description: "Number of source files read during review" },
        },
        required: ["resolved", "reason"],
      },
      handler: async ({ resolved, reason, files_reviewed }) => {
        verdictResult.verdict = `${resolved ? "RESOLVED" : "OPEN"}: ${reason}`;
        verdictResult.resolved = resolved;
        verdictResult.filesReviewed = files_reviewed || 0;
        return { textResultForLlm: `Verdict recorded: ${resolved ? "RESOLVED" : "OPEN"}` };
      },
    });

    return [...ghTools, ...gitTools, reportVerdict];
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
    writablePaths: [],
    createTools,
    attachments,
    excludedTools: ["write_file", "run_command", "run_tests", "dispatch_workflow", "close_issue", "label_issue", "post_discussion_comment"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  const tokensUsed = result.tokensIn + result.tokensOut;

  // If the model didn't call report_verdict, try to infer from the message
  if (!verdictResult.verdict && result.agentMessage) {
    const normalised = result.agentMessage.replace(/^[*_`#>\s-]+/, "").toUpperCase();
    verdictResult.resolved = normalised.startsWith("RESOLVED");
    verdictResult.verdict = result.agentMessage.substring(0, 500);
  }

  if (verdictResult.resolved) {
    await octokit.rest.issues.createComment({
      ...repo,
      issue_number: Number(targetIssueNumber),
      body: [
        "**Automated Review Result:** This issue has been resolved by the current codebase.",
        "",
        `**Task:** review-issue`,
        `**Model:** ${model}`,
        `**Files reviewed:** ${verdictResult.filesReviewed || "unknown"}`,
        "",
        verdictResult.verdict,
      ].join("\n"),
    });
    await octokit.rest.issues.update({
      ...repo,
      issue_number: Number(targetIssueNumber),
      state: "closed",
    });
    core.info(`Issue #${targetIssueNumber} closed as resolved`);

    return {
      outcome: "issue-closed",
      tokensUsed,
      inputTokens: result.tokensIn,
      outputTokens: result.tokensOut,
      cost: 0,
      model,
      details: `Closed issue #${targetIssueNumber}: ${verdictResult.verdict.substring(0, 200)}`,
      narrative: result.narrative || `Reviewed issue #${targetIssueNumber} and closed it as resolved.`,
    };
  }

  core.info(`Issue #${targetIssueNumber} still open: ${verdictResult.verdict.substring(0, 100)}`);
  return {
    outcome: "issue-still-open",
    tokensUsed,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: `Issue #${targetIssueNumber} remains open: ${verdictResult.verdict.substring(0, 200)}`,
    narrative: result.narrative || `Reviewed issue #${targetIssueNumber} — still open, not yet resolved.`,
  };
}

/**
 * Find unreviewed automated issues (no recent automated review comment).
 */
async function findUnreviewedIssues(octokit, repo, limit) {
  const { data: openIssues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "open",
    labels: "automated",
    per_page: limit + 5,
    sort: "created",
    direction: "asc",
  });
  if (openIssues.length === 0) return [];

  const unreviewed = [];
  for (const candidate of openIssues) {
    if (unreviewed.length >= limit) break;
    const { data: comments } = await octokit.rest.issues.listComments({
      ...repo,
      issue_number: candidate.number,
      per_page: 5,
      sort: "created",
      direction: "desc",
    });
    const hasRecentReview = comments.some(
      (c) =>
        c.body?.includes("**Automated Review Result:**") && Date.now() - new Date(c.created_at).getTime() < 86400000,
    );
    if (!hasRecentReview) {
      unreviewed.push(candidate.number);
    }
  }

  // Fall back to oldest if all have been recently reviewed
  if (unreviewed.length === 0 && openIssues.length > 0) {
    unreviewed.push(openIssues[0].number);
  }

  return unreviewed;
}

/**
 * Review open issues and close those that have been resolved.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function reviewIssue(context) {
  const { octokit, repo, config, issueNumber, instructions, model, logFilePath, screenshotFilePath } = context;
  const t = config.tuning || {};

  // Single issue mode
  if (issueNumber) {
    return reviewSingleIssue({ octokit, repo, config, targetIssueNumber: issueNumber, instructions, model, tuning: t, logFilePath, screenshotFilePath });
  }

  // Batch mode: find up to 3 unreviewed issues
  const issueNumbers = await findUnreviewedIssues(octokit, repo, 3);
  if (issueNumbers.length === 0) {
    return { outcome: "nop", details: "No open automated issues to review" };
  }

  const results = [];
  let totalTokens = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (const num of issueNumbers) {
    core.info(`Batch reviewing issue #${num} (${results.length + 1}/${issueNumbers.length})`);
    const result = await reviewSingleIssue({
      octokit, repo, config, targetIssueNumber: num, instructions, model, tuning: t, logFilePath, screenshotFilePath,
    });
    results.push(result);
    totalTokens += result.tokensUsed || 0;
    totalInputTokens += result.inputTokens || 0;
    totalOutputTokens += result.outputTokens || 0;
  }

  const closed = results.filter((r) => r.outcome === "issue-closed").length;
  const reviewed = results.length;

  return {
    outcome: closed > 0 ? "issues-closed" : "issues-reviewed",
    tokensUsed: totalTokens,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    cost: 0,
    model,
    details: `Batch reviewed ${reviewed} issues, closed ${closed}. ${results
      .map((r) => r.details)
      .join("; ")
      .substring(0, 500)}`,
    narrative: `Reviewed ${reviewed} issue(s), closed ${closed} as resolved.`,
  };
}
