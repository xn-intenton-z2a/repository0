// tasks/enhance-issue.js — Add testable acceptance criteria to issues
//
// Takes an issue and enhances it with clear, testable acceptance criteria
// so that the resolve-issue task can implement it effectively.

import * as core from "@actions/core";
import { isIssueResolved } from "../safety.js";
import { runCopilotTask, readOptionalFile, scanDirectory } from "../copilot.js";

/**
 * Enhance a GitHub issue with testable acceptance criteria.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function enhanceIssue(context) {
  const { octokit, repo, config, issueNumber, instructions, model } = context;

  if (!issueNumber) {
    throw new Error("enhance-issue task requires issue-number input");
  }

  if (await isIssueResolved(octokit, repo, issueNumber)) {
    return { outcome: "nop", details: "Issue already resolved" };
  }

  const { data: issue } = await octokit.rest.issues.get({
    ...repo,
    issue_number: Number(issueNumber),
  });

  if (issue.labels.some((l) => l.name === "ready")) {
    return { outcome: "nop", details: "Issue already has ready label" };
  }

  const contributing = readOptionalFile(config.paths.contributingFilepath?.path || "CONTRIBUTING.md");
  const features = scanDirectory(config.paths.featuresPath?.path || "features/", ".md", { contentLimit: 500 });

  const agentInstructions = instructions || "Enhance this issue with clear, testable acceptance criteria.";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    `## Issue #${issueNumber}: ${issue.title}`,
    issue.body || "(no description)",
    "",
    contributing ? `## Contributing Guidelines\n${contributing.substring(0, 1000)}` : "",
    features.length > 0 ? `## Related Features\n${features.map((f) => f.content).join("\n---\n")}` : "",
    "",
    "## Your Task",
    "Write an enhanced version of this issue body that includes:",
    "1. Clear problem statement or feature description",
    "2. Testable acceptance criteria (Given/When/Then or checkbox format)",
    "3. Implementation hints if applicable",
    "",
    "Output ONLY the new issue body text, no markdown code fences.",
  ].join("\n");

  const { content: enhancedBody, tokensUsed } = await runCopilotTask({
    model,
    systemMessage: "You are a requirements analyst. Enhance GitHub issues with clear, testable acceptance criteria.",
    prompt,
    writablePaths: [],
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
    model,
    details: `Enhanced issue #${issueNumber} with acceptance criteria`,
  };
}
