// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/transform.js — Full mission → features → issues → code pipeline
//
// Uses runCopilotSession with lean prompts: the model explores via tools
// instead of having all context front-loaded into the prompt.

import * as core from "@actions/core";
import { existsSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { readOptionalFile, formatPathsSection, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools, createGitTools } from "../../../copilot/github-tools.js";

/**
 * Build a file listing summary (names + sizes, not content) for the lean prompt.
 */
function buildFileListing(dirPath, extensions) {
  if (!dirPath || !existsSync(dirPath)) return [];
  const exts = Array.isArray(extensions) ? extensions : [extensions];
  try {
    const files = readdirSync(dirPath, { recursive: true });
    return files
      .filter((f) => exts.some((ext) => String(f).endsWith(ext)))
      .map((f) => {
        const fullPath = join(dirPath, String(f));
        try {
          const stat = statSync(fullPath);
          const lines = Math.round(stat.size / 40); // rough estimate
          return `${f} (~${lines} lines, ${stat.size} bytes)`;
        } catch {
          return String(f);
        }
      })
      .slice(0, 30); // cap listing at 30 files
  } catch {
    return [];
  }
}

/**
 * Run the full transformation pipeline from mission to code.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function transform(context) {
  const { config, instructions, writablePaths, testCommand, model, octokit, repo, issueNumber, logFilePath, screenshotFilePath } = context;
  const t = config.tuning || {};

  // Read mission (required)
  const mission = readOptionalFile(config.paths.mission.path);
  if (!mission) {
    core.warning(`No mission file found at ${config.paths.mission.path}`);
    return { outcome: "nop", details: "No mission file found" };
  }

  // Check mission-complete signal (skip in maintenance mode)
  if (existsSync("MISSION_COMPLETE.md") && config.supervisor !== "maintenance") {
    core.info("Mission is complete — skipping transformation (MISSION_COMPLETE.md exists)");
    return { outcome: "nop", details: "Mission already complete (MISSION_COMPLETE.md signal)" };
  }

  // Fetch target issue if specified
  let targetIssueSection = "";
  if (issueNumber) {
    try {
      const { data: issue } = await octokit.rest.issues.get({
        ...repo,
        issue_number: Number(issueNumber),
      });
      targetIssueSection = [
        `## Target Issue #${issue.number}: ${issue.title}`,
        issue.body || "(no description)",
        `Labels: ${issue.labels.map((l) => l.name).join(", ") || "none"}`,
        "",
        "**Focus your transformation on resolving this specific issue.**",
      ].join("\n");
    } catch (err) {
      core.warning(`Could not fetch target issue #${issueNumber}: ${err.message}`);
    }
  }

  const agentInstructions =
    instructions || "Transform the repository toward its mission by identifying the next best action.";

  // ── Build lean prompt (structure + mission, not file contents) ──────
  const sourceFiles = buildFileListing(config.paths.source.path, [".js", ".ts"]);
  const testFiles = buildFileListing(config.paths.tests.path, [".js", ".ts"]);
  const webFiles = buildFileListing(config.paths.web?.path || "src/web/", [".html", ".css", ".js"]);
  const featureFiles = buildFileListing(config.paths.features.path, [".md"]);

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    ...(targetIssueSection ? [targetIssueSection, ""] : []),
    "## Mission",
    mission,
    "",
    "## Repository Structure",
    `Source files (${sourceFiles.length}): ${sourceFiles.join(", ") || "none"}`,
    `Test files (${testFiles.length}): ${testFiles.join(", ") || "none"}`,
    `Features (${featureFiles.length}): ${featureFiles.join(", ") || "none"}`,
    ...(webFiles.length > 0 ? [
      `Website files (${webFiles.length}): ${webFiles.join(", ")}`,
      "The website in `src/web/` uses the JS library. `src/web/lib.js` re-exports from `../lib/main.js`.",
      "When transforming source code, also update the website to use the library's new/changed features.",
    ] : []),
    "",
    "## Your Task",
    "Analyze the mission and open issues (use list_issues tool).",
    "Read the source files you need (use read_file tool).",
    "Determine the single most impactful next step to transform this repository.",
    "Then implement that step, writing files and running run_tests to verify.",
    "",
    "## When NOT to make changes",
    "If the existing code already satisfies all requirements in MISSION.md and all open issues have been addressed:",
    "- Do NOT make cosmetic changes (reformatting, renaming, reordering)",
    "- Do NOT add features beyond what MISSION.md specifies",
    "- Instead, report that the mission is satisfied and make no file changes",
    "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config),
    "",
    "## Constraints",
    `- Run \`${testCommand}\` via run_tests to validate your changes`,
    "- Use list_issues to see open issues, get_issue for full details",
    "- Use read_file to read source files you need (don't guess at contents)",
  ].join("\n");

  core.info(`Transform lean prompt length: ${prompt.length} chars`);

  // ── Build attachments (mission + log + screenshot) ─────────────────
  const attachments = [];
  const missionPath = resolve(config.paths.mission.path);
  if (existsSync(missionPath)) {
    attachments.push({ type: "file", path: missionPath });
  }
  if (logFilePath) attachments.push({ type: "file", path: logFilePath });
  if (screenshotFilePath) attachments.push({ type: "file", path: screenshotFilePath });

  // ── System prompt ──────────────────────────────────────────────────
  const systemPrompt =
    "You are an autonomous code transformation agent. Your goal is to advance the repository toward its mission by making the most impactful change possible in a single step." + NARRATIVE_INSTRUCTION;

  // ── Create custom tools (GitHub API + git) ─────────────────────────
  const createTools = (defineTool, _wp, logger) => {
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);
    const gitTools = createGitTools(defineTool, logger);
    return [...ghTools, ...gitTools];
  };

  // ── Run hybrid session ─────────────────────────────────────────────
  const result = await runCopilotSession({
    workspacePath: process.cwd(),
    model,
    tuning: t,
    agentPrompt: systemPrompt,
    userPrompt: prompt,
    writablePaths,
    createTools,
    attachments,
    excludedTools: ["dispatch_workflow", "close_issue", "label_issue", "post_discussion_comment"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  core.info(`Transformation step completed (${result.tokensIn + result.tokensOut} tokens)`);

  // Detect mission-complete hint
  const lowerResult = (result.agentMessage || "").toLowerCase();
  if (lowerResult.includes("mission is satisfied") || lowerResult.includes("mission is complete") || lowerResult.includes("no changes needed")) {
    core.info("Transform indicates mission may be complete — supervisor will verify on next cycle");
  }

  return {
    outcome: result.testsPassed ? "transformed" : "transformed",
    tokensUsed: result.tokensIn + result.tokensOut,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: (result.agentMessage || "").substring(0, 500),
    narrative: result.narrative || extractNarrative(result.agentMessage, "Transformation step completed."),
    contextNotes: `Lean prompt transform: ${result.toolCalls} tool calls, ${result.testRuns} test runs, ${result.filesWritten} files written in ${result.sessionTime}s.`,
  };
}
