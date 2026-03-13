// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/maintain-features.js — Feature lifecycle management
//
// Uses runCopilotSession with lean prompts: the model reads feature files,
// library docs, and issues via tools to maintain the feature set.

import * as core from "@actions/core";
import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { readOptionalFile, formatPathsSection, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools } from "../../../copilot/github-tools.js";
import { checkWipLimit } from "../safety.js";

/**
 * Build a file listing summary (names + sizes, not content).
 */
function buildFileListing(dirPath, extension) {
  if (!dirPath || !existsSync(dirPath)) return [];
  try {
    const files = readdirSync(dirPath, { recursive: true });
    return files
      .filter((f) => String(f).endsWith(extension))
      .map((f) => {
        const fullPath = join(dirPath, String(f));
        try {
          const stat = statSync(fullPath);
          return `${f} (~${Math.round(stat.size / 40)} lines, ${stat.size} bytes)`;
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
 * Maintain the feature set — create, update, or prune feature files.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function maintainFeatures(context) {
  const { config, instructions, writablePaths, model, octokit, repo, logFilePath, screenshotFilePath } = context;
  const t = config.tuning || {};

  // Check mission-complete signal (skip in maintenance mode)
  if (existsSync("MISSION_COMPLETE.md") && config.supervisor !== "maintenance") {
    return { outcome: "nop", details: "Mission already complete (MISSION_COMPLETE.md signal)" };
  }

  // Check maintenance WIP limit
  const wipCheck = await checkWipLimit(octokit, repo, "maintenance", config.maintenanceIssuesWipLimit);
  if (!wipCheck.allowed) {
    return { outcome: "wip-limit-reached", details: `Maintenance WIP limit reached (${wipCheck.count}/${config.maintenanceIssuesWipLimit})` };
  }

  const mission = readOptionalFile(config.paths.mission.path);
  const featureLimit = config.paths.features.limit;
  const featureFiles = buildFileListing(config.paths.features.path, ".md");
  const libraryFiles = buildFileListing(config.paths.library.path, ".md");
  const agentInstructions = instructions || "Maintain the feature set by creating, updating, or pruning features.";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    "## Mission",
    mission,
    "",
    `## Current Features (${featureFiles.length}/${featureLimit} max)`,
    featureFiles.length > 0 ? featureFiles.join(", ") : "none",
    "",
    `## Library Documents (${libraryFiles.length})`,
    libraryFiles.length > 0 ? libraryFiles.join(", ") : "none",
    "",
    "## Your Task",
    "Use read_file to read each feature file and evaluate it.",
    "Use list_issues to see closed issues that indicate completed features.",
    "1. Review each existing feature — if it is already implemented or irrelevant, delete it.",
    `2. If there are fewer than ${featureLimit} features, create new features aligned with the mission.`,
    "3. Ensure each feature has clear, testable acceptance criteria.",
    "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config),
    "",
    "## Constraints",
    `- Maximum ${featureLimit} feature files`,
    "- Feature files must be markdown with a descriptive filename (e.g. HTTP_SERVER.md)",
  ].join("\n");

  const systemPrompt =
    "You are a feature lifecycle manager. Create, update, and prune feature specification files to keep the project focused on its mission." +
    NARRATIVE_INSTRUCTION;

  const createTools = (defineTool, _wp, logger) => {
    return createGitHubTools(octokit, repo, defineTool, logger);
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
    excludedTools: ["dispatch_workflow", "close_issue", "label_issue", "post_discussion_comment", "run_tests"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  return {
    outcome: "features-maintained",
    tokensUsed: result.tokensIn + result.tokensOut,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: `Maintained features (${featureFiles.length} existing, limit ${featureLimit})`,
    narrative: result.narrative || extractNarrative(result.agentMessage, `Maintained ${featureFiles.length} features (limit ${featureLimit}).`),
  };
}
