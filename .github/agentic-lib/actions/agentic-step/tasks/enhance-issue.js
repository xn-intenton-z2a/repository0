// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/enhance-issue.js — Add testable acceptance criteria to issues
//
// Takes an issue and enhances it with clear, testable acceptance criteria
// so that the resolve-issue task can implement it effectively.
// Supports batch mode: when no issueNumber is provided, enhances up to 3 issues.

import * as core from "@actions/core";
import { isIssueResolved } from "../safety.js";
import { runCopilotTask, readOptionalFile, scanDirectory } from "../copilot.js";

/**
 * Enhance a single GitHub issue with testable acceptance criteria.
 */
async function enhanceSingleIssue({ octokit, repo, config, issueNumber, instructions, model, tuning: t }) {
  if (await isIssueResolved(octokit, repo, issueNumber)) {
    return { outcome: "nop", details: `Issue #${issueNumber} already resolved` };
  }

  const { data: issue } = await octokit.rest.issues.get({
    ...repo,
    issue_number: Number(issueNumber),
  });

  if (issue.labels.some((l) => l.name === "ready")) {
    return { outcome: "nop", details: `Issue #${issueNumber} already has ready label` };
  }

  const contributing = readOptionalFile(config.paths.contributing.path);
  const features = scanDirectory(config.paths.features.path, ".md", { contentLimit: t.documentSummary || 2000 });

  const agentInstructions = instructions || "Enhance this issue with clear, testable acceptance criteria.";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    `## Issue #${issueNumber}: ${issue.title}`,
    issue.body || "(no description)",
    "",
    contributing ? `## Contributing Guidelines\n${contributing.substring(0, t.documentSummary || 2000)}` : "",
    features.length > 0 ? `## Related Features\n${features.map((f) => f.content).join("\n---\n")}` : "",
    config.configToml ? `## Configuration (agentic-lib.toml)\n\`\`\`toml\n${config.configToml}\n\`\`\`` : "",
    config.packageJson ? `## Dependencies (package.json)\n\`\`\`json\n${config.packageJson}\n\`\`\`` : "",
    "",
    "## Your Task",
    "Write an enhanced version of this issue body that includes:",
    "1. Clear problem statement or feature description",
    "2. Testable acceptance criteria (Given/When/Then or checkbox format)",
    "3. Implementation hints if applicable",
    "",
    "Output ONLY the new issue body text, no markdown code fences.",
  ].join("\n");

  const {
    content: enhancedBody,
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
  } = await runCopilotTask({
    model,
    systemMessage: "You are a requirements analyst. Enhance GitHub issues with clear, testable acceptance criteria.",
    prompt,
    writablePaths: [],
    tuning: t,
  });

  if (enhancedBody.trim()) {
    await octokit.rest.issues.update({
      ...repo,
      issue_number: Number(issueNumber),
      body: enhancedBody.trim(),
    });
    await octokit.rest.issues.addLabels({
      ...repo,
      issue_number: Number(issueNumber),
      labels: ["ready"],
    });
    await octokit.rest.issues.createComment({
      ...repo,
      issue_number: Number(issueNumber),
      body: [
        "**Automated Enhancement:** This issue has been enhanced with testable acceptance criteria.",
        "",
        `**Task:** enhance-issue`,
        `**Model:** ${model}`,
        `**Features referenced:** ${features.length}`,
        "",
        "The issue body has been updated. The `ready` label has been added to indicate it is ready for implementation.",
      ].join("\n"),
    });
    core.info(`Issue #${issueNumber} enhanced and labeled 'ready'`);
  }

  return {
    outcome: "issue-enhanced",
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Enhanced issue #${issueNumber} with acceptance criteria`,
  };
}

/**
 * Enhance a GitHub issue with testable acceptance criteria.
 * When no issueNumber is provided, enhances up to 3 unready automated issues.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function enhanceIssue(context) {
  const { octokit, repo, config, issueNumber, instructions, model } = context;
  const t = config.tuning || {};

  // Single issue mode
  if (issueNumber) {
    return enhanceSingleIssue({ octokit, repo, config, issueNumber, instructions, model, tuning: t });
  }

  // Batch mode: find up to 3 unready automated issues
  const { data: openIssues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "open",
    labels: "automated",
    per_page: 20,
    sort: "created",
    direction: "asc",
  });
  const unready = openIssues.filter((i) => !i.labels.some((l) => l.name === "ready")).slice(0, 3);

  if (unready.length === 0) {
    return { outcome: "nop", details: "No unready automated issues to enhance" };
  }

  const results = [];
  let totalTokens = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCost = 0;

  for (const issue of unready) {
    core.info(`Batch enhancing issue #${issue.number} (${results.length + 1}/${unready.length})`);
    const result = await enhanceSingleIssue({
      octokit,
      repo,
      config,
      issueNumber: issue.number,
      instructions,
      model,
      tuning: t,
    });
    results.push(result);
    totalTokens += result.tokensUsed || 0;
    totalInputTokens += result.inputTokens || 0;
    totalOutputTokens += result.outputTokens || 0;
    totalCost += result.cost || 0;
  }

  const enhanced = results.filter((r) => r.outcome === "issue-enhanced").length;

  return {
    outcome: enhanced > 0 ? "issues-enhanced" : "nop",
    tokensUsed: totalTokens,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    cost: totalCost,
    model,
    details: `Batch enhanced ${enhanced}/${results.length} issues. ${results
      .map((r) => r.details)
      .join("; ")
      .substring(0, 500)}`,
  };
}
