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
  const { config, instructions, writablePaths, model, logFilePath, screenshotFilePath, octokit, repo } = context;
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
  const hasUrls = /https?:\/\//.test(sources); // used in prompt to guide Step 1 wording

  const libraryPath = config.paths.library.path;
  const libraryLimit = config.paths.library.limit;
  const libraryFiles = buildFileListing(libraryPath, ".md");

  // Read feature specs and open issues so library sources reflect active work
  const featureFiles = buildFileListing(config.paths.features?.path || "features/", ".md");
  let openIssuesSummary = [];
  try {
    if (octokit && repo) {
      const { data: issues } = await octokit.rest.issues.listForRepo({
        ...repo, state: "open", labels: "automated", per_page: 10,
        sort: "created", direction: "desc",
      });
      openIssuesSummary = issues
        .filter((i) => !i.pull_request)
        .map((i) => `#${i.number}: ${i.title}`);
    }
  } catch { /* no issues access */ }

  const agentInstructions = instructions || "Maintain the library by updating documents from sources.";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    "## Mission",
    mission || "(no mission file found)",
    "",
    "## Current SOURCES.md",
    sources || "(empty — no URLs yet)",
    "",
    `## Current Library Documents (${libraryFiles.length}/${libraryLimit} max)`,
    libraryFiles.length > 0 ? libraryFiles.join(", ") : "(none — library is empty)",
    "",
    ...(featureFiles.length > 0 ? [
      `## Active Features (${featureFiles.length})`,
      featureFiles.join(", "),
      "",
    ] : []),
    ...(openIssuesSummary.length > 0 ? [
      `## Open Issues (${openIssuesSummary.length})`,
      openIssuesSummary.join("\n"),
      "",
    ] : []),
    "## Your Task — Two Steps (always do both)",
    "",
    `**Step 1: Update ${sourcesPath}**`,
    "Review the current SOURCES.md against the mission, features, and open issues.",
    hasUrls
      ? "Add URLs for topics not yet covered. Remove URLs that are no longer relevant. Keep existing URLs that are still useful."
      : "SOURCES.md has no URLs yet. Research the mission and add 3-8 relevant reference URLs.",
    "Find documentation, tutorials, API references, Wikipedia articles, or npm packages.",
    "Prioritise sources relevant to the active features and open issues listed above.",
    "Use web search to discover high-quality, stable URLs (prefer official docs, Wikipedia, MDN, npm).",
    `Write the URLs as a markdown list in ${sourcesPath}.`,
    "",
    `**Step 2: Update library documents in \`${libraryPath}\`**`,
    "After updating SOURCES.md, read it back and maintain the library:",
    "- Fetch each URL and create or update a library document with the key technical content.",
    "- Remove library documents whose sources have been removed.",
    "- Name documents descriptively (e.g. `MDN_ARRAY_METHODS.md`, `WIKIPEDIA_HAMMING_DISTANCE.md`).",
    "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config),
    "",
    "## Constraints",
    `- Maximum ${libraryLimit} library documents`,
    `- Token budget: ~${maxTokens} tokens. Be concise — avoid verbose explanations or unnecessary tool calls.`,
  ].join("\n");

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

  const detailsMsg = `Maintained sources and library (${libraryFiles.length} existing docs, limit ${libraryLimit})`;

  return {
    outcome: "library-maintained",
    tokensUsed: result.tokensIn + result.tokensOut,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: detailsMsg,
    narrative: result.narrative || extractNarrative(result.agentMessage, detailsMsg),
  };
}
