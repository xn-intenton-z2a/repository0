// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/maintain-library.js — Library and knowledge management
//
// Crawls SOURCES.md, updates library documents, maintains the knowledge base
// that provides context for feature generation and issue resolution.

import * as core from "@actions/core";
import { existsSync } from "fs";
import { runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";

/**
 * Maintain the library of knowledge documents from source URLs.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function maintainLibrary(context) {
  const { config, instructions, writablePaths, model } = context;
  const t = config.tuning || {};

  // Check mission-complete signal (skip in maintenance mode)
  if (existsSync("MISSION_COMPLETE.md") && config.supervisor !== "maintenance") {
    core.info("Mission is complete — skipping library maintenance");
    return { outcome: "nop", details: "Mission already complete (MISSION_COMPLETE.md signal)" };
  }

  const sourcesPath = config.paths.librarySources.path;
  const sources = readOptionalFile(sourcesPath);
  const mission = readOptionalFile(config.paths.mission.path);
  const hasUrls = /https?:\/\//.test(sources);

  const libraryPath = config.paths.library.path;
  const libraryLimit = config.paths.library.limit;
  const libraryDocs = scanDirectory(libraryPath, ".md", { contentLimit: t.documentSummary || 500 });

  const agentInstructions = instructions || "Maintain the library by updating documents from sources.";

  let prompt;
  if (!hasUrls) {
    // SOURCES.md has no URLs — ask the LLM to find relevant sources based on the mission
    core.info("SOURCES.md has no URLs — asking LLM to discover relevant sources from the mission.");
    prompt = [
      "## Instructions",
      agentInstructions,
      "",
      "## Mission",
      mission || "(no mission file found)",
      "",
      "## Current SOURCES.md",
      sources || "(empty)",
      "",
      "## Your Task",
      `SOURCES.md has no URLs yet. Research the mission above and populate ${sourcesPath} with 3-8 relevant reference URLs.`,
      "Find documentation, tutorials, API references, Wikipedia articles, or npm packages related to the mission's core topic.",
      "Use web search to discover high-quality, stable URLs (prefer official docs, Wikipedia, MDN, npm).",
      `Write the URLs as a markdown list in ${sourcesPath}, keeping the existing header text.`,
      "",
      formatPathsSection(writablePaths, config.readOnlyPaths, config),
    ].join("\n");
  } else {
    prompt = [
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
  }

  const { content: resultContent, tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage:
      "You are a knowledge librarian. Maintain a library of technical documents extracted from web sources." + NARRATIVE_INSTRUCTION,
    prompt,
    writablePaths,
    tuning: t,
  });

  const outcomeLabel = hasUrls ? "library-maintained" : "sources-discovered";
  const detailsMsg = hasUrls
    ? `Maintained library (${libraryDocs.length} docs, limit ${libraryLimit})`
    : `Discovered sources for SOURCES.md from mission`;

  return {
    outcome: outcomeLabel,
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: detailsMsg,
    narrative: extractNarrative(resultContent, detailsMsg),
  };
}
