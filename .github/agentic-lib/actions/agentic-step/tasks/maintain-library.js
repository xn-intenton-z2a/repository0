// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/maintain-library.js — Library and knowledge management
//
// Uses runCopilotSession with lean prompts: the model reads sources, library docs,
// and web content via tools to maintain the knowledge base.

import * as core from "@actions/core";
import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { readOptionalFile, formatPathsSection, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";

/**
 * Build a file listing summary (names + sizes, not content).
 */
// W22: maxFiles configurable via profile (0 = unlimited)
function buildFileListing(dirPath, extension, maxFiles = 30) {
  if (!dirPath || !existsSync(dirPath)) return [];
  try {
    const files = readdirSync(dirPath, { recursive: true });
    const filtered = files
      .filter((f) => String(f).endsWith(extension))
      .map((f) => {
        const fullPath = join(dirPath, String(f));
        try {
          const stat = statSync(fullPath);
          return `${f} (~${Math.round(stat.size / 40)} lines, ${stat.size} bytes)`;
        } catch {
          return String(f);
        }
      });
    return maxFiles > 0 ? filtered.slice(0, maxFiles) : filtered;
  } catch {
    return [];
  }
}

/**
 * Maintain the library of knowledge documents from source URLs.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function maintainLibrary(context) {
  const { config, instructions, writablePaths, model, logFilePath, screenshotFilePath } = context;
  const t = config.tuning || {};

  // Check mission-complete signal (skip in maintenance mode)
  if (existsSync("MISSION_COMPLETE.md") && config.supervisor !== "maintenance") {
    core.info("Mission is complete — skipping library maintenance");
    return { outcome: "nop", details: "Mission already complete (MISSION_COMPLETE.md signal)" };
  }

  const maxTokens = config.maxTokensPerMaintain || 200000;

  const sourcesPath = config.paths.librarySources.path;
  const sources = readOptionalFile(sourcesPath);
  const mission = readOptionalFile(config.paths.mission.path);
  const hasUrls = /https?:\/\//.test(sources);

  const libraryPath = config.paths.library.path;
  const libraryLimit = config.paths.library.limit;
  const libraryFiles = buildFileListing(libraryPath, ".md");

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
      "",
      "## Constraints",
      `- Token budget: ~${maxTokens} tokens. Be concise — avoid verbose explanations or unnecessary tool calls.`,
    ].join("\n");
  } else {
    prompt = [
      "## Instructions",
      agentInstructions,
      "",
      "## Sources",
      sources,
      "",
      `## Current Library Documents (${libraryFiles.length}/${libraryLimit} max)`,
      libraryFiles.length > 0 ? libraryFiles.join(", ") : "none",
      "",
      "## Your Task",
      "Use read_file to read existing library documents.",
      "1. Read each URL in SOURCES.md and extract technical content.",
      "2. Create or update library documents based on the source content.",
      "3. Remove library documents that no longer have corresponding sources.",
      "",
      formatPathsSection(writablePaths, config.readOnlyPaths, config),
      "",
      "## Constraints",
      `- Maximum ${libraryLimit} library documents`,
      `- Token budget: ~${maxTokens} tokens. Be concise — avoid verbose explanations or unnecessary tool calls.`,
    ].join("\n");
  }

  const systemPrompt =
    "You are a knowledge librarian. Maintain a library of technical documents extracted from web sources." +
    NARRATIVE_INSTRUCTION;

  const attachments = [];
  if (logFilePath) attachments.push({ type: "file", path: logFilePath });
  if (screenshotFilePath) attachments.push({ type: "file", path: screenshotFilePath });

  // Derive a tool-call cap from the token budget (rough: ~5000 tokens per tool call)
  const maxToolCalls = Math.max(10, Math.floor(maxTokens / 5000));

  const result = await runCopilotSession({
    workspacePath: process.cwd(),
    model,
    tuning: t,
    agentPrompt: systemPrompt,
    userPrompt: prompt,
    writablePaths,
    attachments,
    maxToolCalls,
    excludedTools: ["dispatch_workflow", "close_issue", "label_issue", "post_discussion_comment", "run_tests"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  const outcomeLabel = hasUrls ? "library-maintained" : "sources-discovered";
  const detailsMsg = hasUrls
    ? `Maintained library (${libraryFiles.length} docs, limit ${libraryLimit})`
    : `Discovered sources for SOURCES.md from mission`;

  return {
    outcome: outcomeLabel,
    tokensUsed: result.tokensIn + result.tokensOut,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: detailsMsg,
    narrative: result.narrative || extractNarrative(result.agentMessage, detailsMsg),
  };
}
