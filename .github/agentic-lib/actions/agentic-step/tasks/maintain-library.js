// tasks/maintain-library.js — Library and knowledge management
//
// Crawls SOURCES.md, updates library documents, maintains the knowledge base
// that provides context for feature generation and issue resolution.

import * as core from "@actions/core";
import { runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection } from "../copilot.js";

/**
 * Maintain the library of knowledge documents from source URLs.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function maintainLibrary(context) {
  const { config, instructions, writablePaths, model } = context;

  const sources = readOptionalFile(config.paths.librarySourcesFilepath?.path || "SOURCES.md");
  if (!sources.trim()) {
    core.info("No sources found. Returning nop.");
    return { outcome: "nop", details: "No SOURCES.md or empty" };
  }

  const libraryPath = config.paths.libraryDocumentsPath?.path || "library/";
  const libraryLimit = config.paths.libraryDocumentsPath?.limit || 32;
  const libraryDocs = scanDirectory(libraryPath, ".md", { contentLimit: 500 });

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
    formatPathsSection(writablePaths, config.readOnlyPaths || []),
    "",
    "## Constraints",
    `- Maximum ${libraryLimit} library documents`,
  ].join("\n");

  const { tokensUsed } = await runCopilotTask({
    model,
    systemMessage:
      "You are a knowledge librarian. Maintain a library of technical documents extracted from web sources.",
    prompt,
    writablePaths,
  });

  return {
    outcome: "library-maintained",
    tokensUsed,
    model,
    details: `Maintained library (${libraryDocs.length} docs, limit ${libraryLimit})`,
  };
}
