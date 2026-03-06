// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/maintain-features.js — Feature lifecycle management
//
// Reviews existing features, creates new ones from mission/library analysis,
// prunes completed/irrelevant features, and ensures quality.

import { existsSync } from "fs";
import { runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection, extractFeatureSummary } from "../copilot.js";
import { checkWipLimit } from "../safety.js";

/**
 * Maintain the feature set — create, update, or prune feature files.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function maintainFeatures(context) {
  const { config, instructions, writablePaths, model, octokit, repo } = context;
  const t = config.tuning || {};

  // Check mission-complete signal
  if (existsSync("MISSION_COMPLETE.md")) {
    return { outcome: "nop", details: "Mission already complete (MISSION_COMPLETE.md signal)" };
  }

  // Check maintenance WIP limit
  const wipCheck = await checkWipLimit(octokit, repo, "maintenance", config.maintenanceIssuesWipLimit);
  if (!wipCheck.allowed) {
    return { outcome: "wip-limit-reached", details: `Maintenance WIP limit reached (${wipCheck.count}/${config.maintenanceIssuesWipLimit})` };
  }

  const mission = readOptionalFile(config.paths.mission.path);
  const featuresPath = config.paths.features.path;
  const featureLimit = config.paths.features.limit;
  const features = scanDirectory(featuresPath, ".md", { fileLimit: t.featuresScan || 10 });

  // Sort features: incomplete (has unchecked items) first, then by name
  features.sort((a, b) => {
    const aIncomplete = /- \[ \]/.test(a.content) ? 0 : 1;
    const bIncomplete = /- \[ \]/.test(b.content) ? 0 : 1;
    return aIncomplete - bIncomplete || a.name.localeCompare(b.name);
  });
  const libraryDocs = scanDirectory(config.paths.library.path, ".md", {
    contentLimit: t.documentSummary || 1000,
  });

  const { data: closedIssues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "closed",
    per_page: t.issuesScan || 20,
    sort: "updated",
    direction: "desc",
  });

  const agentInstructions = instructions || "Maintain the feature set by creating, updating, or pruning features.";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    "## Mission",
    mission,
    "",
    `## Current Features (${features.length}/${featureLimit} max)`,
    ...features.map((f) => `### ${f.name}\n${f.content}`),
    "",
    libraryDocs.length > 0 ? `## Library Documents (${libraryDocs.length})` : "",
    ...libraryDocs.map((d) => `### ${d.name}\n${d.content}`),
    "",
    `## Recently Closed Issues (${closedIssues.length})`,
    ...closedIssues.slice(0, Math.floor((t.issuesScan || 20) / 2)).map((i) => `- #${i.number}: ${i.title}`),
    "",
    "## Your Task",
    `1. Review each existing feature — if it is already implemented or irrelevant, delete it.`,
    `2. If there are fewer than ${featureLimit} features, create new features aligned with the mission.`,
    "3. Ensure each feature has clear, testable acceptance criteria.",
    "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config),
    "",
    "## Constraints",
    `- Maximum ${featureLimit} feature files`,
    "- Feature files must be markdown with a descriptive filename (e.g. HTTP_SERVER.md)",
  ].join("\n");

  const { tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage:
      "You are a feature lifecycle manager. Create, update, and prune feature specification files to keep the project focused on its mission.",
    prompt,
    writablePaths,
    tuning: t,
  });

  return {
    outcome: "features-maintained",
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Maintained features (${features.length} existing, limit ${featureLimit})`,
  };
}
