// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/review-issue.js — Review issues and close resolved ones
//
// Checks open issues against the current codebase to determine
// if they have been resolved, and closes them if so.
// Supports batch mode: when no issueNumber is provided, reviews up to 3 issues.

import * as core from "@actions/core";
import { runCopilotTask, scanDirectory } from "../copilot.js";

/**
 * Review a single issue against the current codebase.
 *
 * @param {Object} params
 * @param {Object} params.octokit - GitHub API client
 * @param {Object} params.repo - { owner, repo }
 * @param {Object} params.config - Loaded config
 * @param {number} params.targetIssueNumber - Issue number to review
 * @param {string} params.instructions - Agent instructions
 * @param {string} params.model - Model name
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
async function reviewSingleIssue({ octokit, repo, config, targetIssueNumber, instructions, model, tuning: t }) {
  const { data: issue } = await octokit.rest.issues.get({
    ...repo,
    issue_number: Number(targetIssueNumber),
  });

  if (issue.state === "closed") {
    return { outcome: "nop", details: `Issue #${targetIssueNumber} is already closed` };
  }

  const sourceFiles = scanDirectory(config.paths.source.path, [".js", ".ts"], {
    contentLimit: t.sourceContent || 5000,
    fileLimit: t.sourceScan || 20,
    recursive: true,
    sortByMtime: true,
    clean: true,
    outline: true,
  });
  const testFiles = scanDirectory(config.paths.tests.path, [".test.js", ".test.ts"], {
    contentLimit: t.testContent || t.sourceContent || 5000,
    fileLimit: t.sourceScan || 20,
    recursive: true,
    sortByMtime: true,
    clean: true,
  });
  const webFiles = scanDirectory(config.paths.web?.path || "src/web/", [".html", ".css", ".js"], {
    fileLimit: t.sourceScan || 20,
    contentLimit: t.sourceContent || 5000,
    recursive: true,
    sortByMtime: true,
    clean: true,
  });
  const docsFiles = scanDirectory(config.paths.documentation?.path || "docs/", [".md"], {
    fileLimit: t.featuresScan || 10,
    contentLimit: t.documentSummary || 2000,
  });

  const agentInstructions = instructions || "Review whether this issue has been resolved by the current codebase.";

  // Gather recent commits since init for context
  let recentCommitsSummary = [];
  try {
    const initTimestamp = config.init?.timestamp || null;
    const since = initTimestamp || new Date(Date.now() - 7 * 86400000).toISOString();
    const { data: commits } = await octokit.rest.repos.listCommits({
      ...repo,
      sha: "main",
      since,
      per_page: 10,
    });
    recentCommitsSummary = commits.map((c) => {
      const msg = c.commit.message.split("\n")[0];
      const sha = c.sha.substring(0, 7);
      return `- [${sha}] ${msg} (${c.commit.author?.date || ""})`;
    });
  } catch { /* ignore */ }

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    `## Issue #${targetIssueNumber}: ${issue.title}`,
    issue.body || "(no description)",
    "",
    `## Current Source (${sourceFiles.length} files)`,
    ...sourceFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
    "",
    `## Current Tests (${testFiles.length} files)`,
    ...testFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
    "",
    ...(webFiles.length > 0
      ? [
          `## Website Files (${webFiles.length} files)`,
          "The website in `src/web/` uses the JS library.",
          ...webFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
          "",
        ]
      : []),
    ...(docsFiles.length > 0
      ? [`## Documentation (${docsFiles.length} files)`, ...docsFiles.map((f) => `- ${f.name}`), ""]
      : []),
    ...(recentCommitsSummary.length > 0
      ? [`## Recent Commits (since init)`, ...recentCommitsSummary, ""]
      : []),
    config.configToml ? `## Configuration (agentic-lib.toml)\n\`\`\`toml\n${config.configToml}\n\`\`\`` : "",
    config.packageJson ? `## Dependencies (package.json)\n\`\`\`json\n${config.packageJson}\n\`\`\`` : "",
    "",
    "## Your Task",
    "Determine if this issue has been resolved by the current code.",
    "Respond with exactly one of:",
    '- "RESOLVED: <reason>" if the issue is satisfied by the current code',
    '- "OPEN: <reason>" if the issue is not yet resolved',
  ].join("\n");

  const {
    content: verdict,
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
  } = await runCopilotTask({
    model,
    systemMessage: "You are a code reviewer determining if GitHub issues have been resolved.",
    prompt,
    writablePaths: [],
    tuning: t,
  });

  // Strip leading markdown formatting (e.g., **RESOLVED** or *RESOLVED*)
  const normalised = verdict.replace(/^[*_`#>\s-]+/, "").toUpperCase();
  if (normalised.startsWith("RESOLVED")) {
    await octokit.rest.issues.createComment({
      ...repo,
      issue_number: Number(targetIssueNumber),
      body: [
        "**Automated Review Result:** This issue has been resolved by the current codebase.",
        "",
        `**Task:** review-issue`,
        `**Model:** ${model}`,
        `**Source files reviewed:** ${sourceFiles.length}`,
        `**Test files reviewed:** ${testFiles.length}`,
        "",
        verdict,
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
      inputTokens,
      outputTokens,
      cost,
      model,
      details: `Closed issue #${targetIssueNumber}: ${verdict.substring(0, 200)}`,
      narrative: `Reviewed issue #${targetIssueNumber} and closed it as resolved.`,
    };
  }

  core.info(`Issue #${targetIssueNumber} still open: ${verdict.substring(0, 100)}`);
  return {
    outcome: "issue-still-open",
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Issue #${targetIssueNumber} remains open: ${verdict.substring(0, 200)}`,
    narrative: `Reviewed issue #${targetIssueNumber} — still open, not yet resolved.`,
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
 * When no issueNumber is provided, reviews up to 3 issues in batch mode.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function reviewIssue(context) {
  const { octokit, repo, config, issueNumber, instructions, model } = context;
  const t = config.tuning || {};

  // Single issue mode
  if (issueNumber) {
    return reviewSingleIssue({ octokit, repo, config, targetIssueNumber: issueNumber, instructions, model, tuning: t });
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
  let totalCost = 0;

  for (const num of issueNumbers) {
    core.info(`Batch reviewing issue #${num} (${results.length + 1}/${issueNumbers.length})`);
    const result = await reviewSingleIssue({
      octokit, repo, config, targetIssueNumber: num, instructions, model, tuning: t,
    });
    results.push(result);
    totalTokens += result.tokensUsed || 0;
    totalInputTokens += result.inputTokens || 0;
    totalOutputTokens += result.outputTokens || 0;
    totalCost += result.cost || 0;
  }

  const closed = results.filter((r) => r.outcome === "issue-closed").length;
  const reviewed = results.length;

  return {
    outcome: closed > 0 ? "issues-closed" : "issues-reviewed",
    tokensUsed: totalTokens,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    cost: totalCost,
    model,
    details: `Batch reviewed ${reviewed} issues, closed ${closed}. ${results
      .map((r) => r.details)
      .join("; ")
      .substring(0, 500)}`,
    narrative: `Reviewed ${reviewed} issue(s), closed ${closed} as resolved.`,
  };
}
