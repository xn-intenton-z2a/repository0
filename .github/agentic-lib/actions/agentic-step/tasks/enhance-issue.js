// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/enhance-issue.js — Add testable acceptance criteria to issues
//
// Uses runCopilotSession with lean prompts: the model reads features and docs
// via tools to enhance issues with acceptance criteria.

import * as core from "@actions/core";
import { existsSync, readdirSync } from "fs";
import { isIssueResolved } from "../safety.js";
import { readOptionalFile, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools } from "../../../copilot/github-tools.js";

/**
 * Build a file listing summary (names only).
 */
function listFiles(dirPath, extension) {
  if (!dirPath || !existsSync(dirPath)) return [];
  try {
    return readdirSync(dirPath, { recursive: true })
      .filter((f) => String(f).endsWith(extension))
      .map((f) => String(f))
      .slice(0, 20);
  } catch {
    return [];
  }
}

/**
 * Enhance a single GitHub issue with testable acceptance criteria.
 */
async function enhanceSingleIssue({ octokit, repo, config, issueNumber, instructions, model, tuning: t, logFilePath, screenshotFilePath }) {
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
  const featureFiles = listFiles(config.paths.features.path, ".md");

  const agentInstructions = instructions || "Enhance this issue with clear, testable acceptance criteria.";

  // Shared mutable state to capture the enhanced body
  const enhanceResult = { body: "" };

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    `## Issue #${issueNumber}: ${issue.title}`,
    issue.body || "(no description)",
    "",
    contributing ? `## Contributing Guidelines\n${contributing.substring(0, 2000)}` : "",
    featureFiles.length > 0 ? `## Feature Files (read with read_file for details)\n${featureFiles.join(", ")}` : "",
    "",
    "## Your Task",
    "Read relevant feature files if needed using read_file.",
    "Write an enhanced version of this issue body that includes:",
    "1. Clear problem statement or feature description",
    "2. Testable acceptance criteria (Given/When/Then or checkbox format)",
    "3. Implementation hints if applicable",
    "",
    "**Call report_enhanced_body exactly once** with the improved issue body.",
  ].join("\n");

  const systemPrompt =
    "You are a requirements analyst. Enhance GitHub issues with clear, testable acceptance criteria." +
    NARRATIVE_INSTRUCTION;

  const createTools = (defineTool, _wp, logger) => {
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);

    const reportEnhancedBody = defineTool("report_enhanced_body", {
      description: "Report the enhanced issue body with testable acceptance criteria. Call this exactly once.",
      parameters: {
        type: "object",
        properties: {
          enhanced_body: { type: "string", description: "The complete enhanced issue body text" },
        },
        required: ["enhanced_body"],
      },
      handler: async ({ enhanced_body }) => {
        enhanceResult.body = enhanced_body;
        return { textResultForLlm: "Enhanced body recorded." };
      },
    });

    return [...ghTools, reportEnhancedBody];
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

  // Fall back to agent message if report_enhanced_body wasn't called
  const enhancedBody = enhanceResult.body || (result.agentMessage || "").trim();

  if (enhancedBody) {
    await octokit.rest.issues.update({
      ...repo,
      issue_number: Number(issueNumber),
      body: enhancedBody,
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
        "",
        "The issue body has been updated. The `ready` label has been added to indicate it is ready for implementation.",
      ].join("\n"),
    });
    core.info(`Issue #${issueNumber} enhanced and labeled 'ready'`);
  }

  return {
    outcome: "issue-enhanced",
    tokensUsed,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: `Enhanced issue #${issueNumber} with acceptance criteria`,
    narrative: result.narrative || `Enhanced issue #${issueNumber} with testable acceptance criteria.`,
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
  const { octokit, repo, config, issueNumber, instructions, model, logFilePath, screenshotFilePath } = context;
  const t = config.tuning || {};

  // Single issue mode
  if (issueNumber) {
    return enhanceSingleIssue({ octokit, repo, config, issueNumber, instructions, model, tuning: t, logFilePath, screenshotFilePath });
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
      logFilePath,
      screenshotFilePath,
    });
    results.push(result);
    totalTokens += result.tokensUsed || 0;
    totalInputTokens += result.inputTokens || 0;
    totalOutputTokens += result.outputTokens || 0;
  }

  const enhanced = results.filter((r) => r.outcome === "issue-enhanced").length;

  return {
    outcome: enhanced > 0 ? "issues-enhanced" : "nop",
    tokensUsed: totalTokens,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    cost: 0,
    model,
    details: `Batch enhanced ${enhanced}/${results.length} issues. ${results
      .map((r) => r.details)
      .join("; ")
      .substring(0, 500)}`,
    narrative: `Enhanced ${enhanced} issue(s) with testable acceptance criteria.`,
  };
}
