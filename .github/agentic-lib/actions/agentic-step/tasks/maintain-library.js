// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/maintain-library.js — Library and knowledge management
//
// Crawls SOURCES.md, updates library documents, maintains the knowledge base
// that provides context for feature generation and issue resolution.

import * as core from "@actions/core";
import { existsSync } from "fs";
import { runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection } from "../copilot.js";

/**
 * Maintain the library of knowledge documents from source URLs.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function maintainLibrary(context) {
  const { config, instructions, writablePaths, model } = context;
  const t = config.tuning || {};

  // Check mission-complete signal
  if (existsSync("MISSION_COMPLETE.md")) {
    core.info("Mission is complete — skipping library maintenance");
    return { outcome: "nop", details: "Mission already complete (MISSION_COMPLETE.md signal)" };
  }

  const sources = readOptionalFile(config.paths.librarySources.path);
  if (!sources.trim()) {
    core.info("No sources found. Returning nop.");
    return { outcome: "nop", details: "No SOURCES.md or empty" };
  }

  const libraryPath = config.paths.library.path;
  const libraryLimit = config.paths.library.limit;
  const libraryDocs = scanDirectory(libraryPath, ".md", { contentLimit: t.documentSummary || 500 });

  const agentInstructions = instructions || "Maintain the library by updating documents from sources.";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    "## Sources",
    sources,
    "",
    `## Current Library Documents (${libraryDocs.length}/${libraryLimit} max)`,
    ...libraryDocs.map((d) => `### ${d.name}\n${d.content}`),
    "",
    "## Your Task",
    "1. Read each URL in SOURCES.md and extract technical content.",
    "2. Create or update library documents based on the source content.",
    "3. Remove library documents that no longer have corresponding sources.",
    "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config),
    "",
    "## Constraints",
    `- Maximum ${libraryLimit} library documents`,
  ].join("\n");

  const { tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage:
      "You are a knowledge librarian. Maintain a library of technical documents extracted from web sources.",
    prompt,
    writablePaths,
    tuning: t,
  });

  return {
    outcome: "library-maintained",
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Maintained library (${libraryDocs.length} docs, limit ${libraryLimit})`,
  };
}
