// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/transform.js — Full mission → features → issues → code pipeline
//
// Uses runCopilotSession with lean prompts: the model explores via tools
// instead of having all context front-loaded into the prompt.

import * as core from "@actions/core";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";
import { readOptionalFile, formatPathsSection, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools, createGitTools } from "../../../copilot/github-tools.js";

/**
 * Build a file listing summary (names + sizes, not content) for the lean prompt.
 * W22: maxFiles configurable via profile (0 = unlimited).
 */
function buildFileListing(dirPath, extensions, maxFiles = 30) {
  if (!dirPath || !existsSync(dirPath)) return [];
  const exts = Array.isArray(extensions) ? extensions : [extensions];
  try {
    const files = readdirSync(dirPath, { recursive: true });
    const filtered = files
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
      });
    return maxFiles > 0 ? filtered.slice(0, maxFiles) : filtered;
  } catch {
    return [];
  }
}

/**
 * Build a library index: filename + first 2 lines of each library doc.
 * W22: maxChars configurable via profile.
 */
function buildLibraryIndex(libraryPath, maxChars = 2000) {
  if (!libraryPath || !existsSync(libraryPath)) return "";
  try {
    const files = readdirSync(libraryPath).filter((f) => f.endsWith(".md")).sort();
    if (files.length === 0) return "";
    const entries = [];
    let totalLen = 0;
    for (const f of files) {
      const fullPath = join(libraryPath, f);
      try {
        const content = readFileSync(fullPath, "utf8");
        const lines = content.split("\n").slice(0, 2).join(" ").trim();
        const entry = `- ${f}: ${lines}`;
        if (totalLen + entry.length > maxChars) break;
        entries.push(entry);
        totalLen += entry.length;
      } catch {
        entries.push(`- ${f}: (unreadable)`);
      }
    }
    return entries.join("\n");
  } catch {
    return "";
  }
}

/**
 * W9: Get worktree file listing via git ls-files.
 */
function getWorktreeFiles() {
  try {
    const gitFiles = execSync("git ls-files", { encoding: "utf8", timeout: 10000 }).trim();
    return gitFiles.split("\n").filter(Boolean);
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
  const maxFileListing = t.maxFileListing ?? 30;
  const maxLibraryIdx = t.maxLibraryIndex || 2000;

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

  // W7: Fetch all target issues (supports comma-separated list)
  const issueNumbers = issueNumber
    ? String(issueNumber).split(",").map((n) => n.trim()).filter(Boolean)
    : [];
  const targetIssueSections = [];
  for (const num of issueNumbers) {
    try {
      const { data: issue } = await octokit.rest.issues.get({
        ...repo,
        issue_number: Number(num),
      });
      targetIssueSections.push([
        `### Issue #${issue.number}: ${issue.title}`,
        issue.body || "(no description)",
        `Labels: ${issue.labels.map((l) => l.name).join(", ") || "none"}`,
      ].join("\n"));
    } catch (err) {
      core.warning(`Could not fetch target issue #${num}: ${err.message}`);
    }
  }

  const agentInstructions =
    instructions || "Transform the repository toward its mission by identifying the next best action.";

  // ── Build lean prompt (structure + mission, not file contents) ──────
  const sourceFiles = buildFileListing(config.paths.source.path, [".js", ".ts"], maxFileListing);
  const testFiles = buildFileListing(config.paths.tests.path, [".js", ".ts"], maxFileListing);
  const webFiles = buildFileListing(config.paths.web?.path || "src/web/", [".html", ".css", ".js"], maxFileListing);
  const featureFiles = buildFileListing(config.paths.features.path, [".md"], maxFileListing);
  const libraryIndex = buildLibraryIndex(config.paths.library?.path || "library/", maxLibraryIdx);

  // W9: worktree file listing
  const worktreeFiles = getWorktreeFiles();

  // W17: Implementation review results from upstream
  const reviewAdvice = process.env.REVIEW_ADVICE || "";
  const reviewGapsRaw = process.env.REVIEW_GAPS || "";

  // W19: Telemetry test output from upstream
  const telemetryTestSummary = process.env.TELEMETRY_UNIT_TEST_SUMMARY || "";
  const telemetryTestOutput = process.env.TELEMETRY_UNIT_TEST_OUTPUT || "";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    // W7: Multiple target issues
    ...(targetIssueSections.length > 0 ? [
      `## Target Issues (${targetIssueSections.length})`,
      ...targetIssueSections.map((s) => s + "\n"),
      targetIssueSections.length > 1
        ? "**Resolve as many of these issues as you can in this session. Address them all if possible.**"
        : "**Focus your transformation on resolving this specific issue.**",
      "",
    ] : []),
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
    ...(libraryIndex ? [
      "",
      "## Library Index",
      "Reference documents available in `library/` (use read_file for full content):",
      libraryIndex,
    ] : []),
    // W9: worktree file listing
    ...(worktreeFiles.length > 0 ? [
      "",
      `## Worktree Files (${worktreeFiles.length} non-ignored files)`,
      worktreeFiles.join("\n"),
    ] : []),
    // W19: Current test state from telemetry
    ...(telemetryTestSummary ? [
      "",
      "## Current Test State (from telemetry)",
      `Summary: ${telemetryTestSummary}`,
      ...(telemetryTestOutput ? [`\`\`\`\n${telemetryTestOutput}\n\`\`\``] : []),
    ] : []),
    // W17: Implementation review
    ...(reviewAdvice ? [
      "",
      "## Implementation Review",
      `**Completeness:** ${reviewAdvice}`,
      ...((() => {
        try {
          const gaps = JSON.parse(reviewGapsRaw || "[]");
          if (gaps.length > 0) {
            return [
              "",
              "**Gaps Found:**",
              ...gaps.map((g) => `- [${g.severity}] ${g.element}: ${g.description} (${g.gapType})`),
              "",
              "Address these gaps in your transformation if they fall within the target issues.",
            ];
          }
        } catch { /* ignore */ }
        return [];
      })()),
    ] : []),
    "",
    "## Your Task",
    "Analyze the mission and open issues (use list_issues tool).",
    "Read the source files you need (use read_file tool).",
    issueNumbers.length > 1
      ? "Resolve all target issues listed above. Implement all changes, write tests, update the website, and run run_tests to verify."
      : "Determine the single most impactful next step to transform this repository.\nThen implement that step, writing files and running run_tests to verify.",
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
    ...(config.coverageGoals ? [
      `- Required code coverage: ≥${config.coverageGoals.minLineCoverage}% lines, ≥${config.coverageGoals.minBranchCoverage}% branches`,
    ] : []),
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

  // ── Create custom tools (GitHub API + git + W8 behaviour dry-run) ──
  const createTools = (defineTool, _wp, logger) => {
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);
    const gitTools = createGitTools(defineTool, logger);

    // W8: Dry-run behaviour test tool — reads test specs and source code,
    // returns them to the LLM for reasoning about whether code would pass
    const dryRunBehaviourTests = defineTool("dry_run_behaviour_tests", {
      description: "Read behaviour test specifications and the source code they test, then return both for analysis. Use this to check if your code changes would pass behaviour tests without running Playwright. Call this after making code changes but before committing.",
      parameters: { type: "object", properties: {}, required: [] },
      handler: async () => {
        const behaviourPath = config.paths.behaviour?.path || "tests/behaviour/";
        const sourcePath = config.paths.source?.path || "src/lib/";
        const webPath = config.paths.web?.path || "src/web/";

        const readDir = (dir, exts) => {
          if (!existsSync(dir)) return [];
          try {
            return readdirSync(dir)
              .filter((f) => exts.some((e) => f.endsWith(e)))
              .slice(0, 10)
              .map((f) => {
                try {
                  return { file: f, content: readFileSync(join(dir, f), "utf8") };
                } catch { return { file: f, content: "(unreadable)" }; }
              });
          } catch { return []; }
        };

        const specs = readDir(behaviourPath, [".spec.js", ".spec.ts", ".test.js", ".test.ts"]);
        const sources = readDir(sourcePath, [".js", ".ts"]);
        const webFilesLocal = readDir(webPath, [".html", ".js"]);

        if (specs.length === 0) {
          return { textResultForLlm: "No behaviour test files found. Behaviour tests are not configured for this project." };
        }

        const parts = [
          "## Behaviour Test Specifications",
          ...specs.map((s) => `### ${s.file}\n\`\`\`\n${s.content}\n\`\`\``),
          "",
          "## Source Code Under Test",
          ...sources.map((s) => `### ${s.file}\n\`\`\`\n${s.content}\n\`\`\``),
        ];
        if (webFilesLocal.length > 0) {
          parts.push("", "## Website Files", ...webFilesLocal.map((s) => `### ${s.file}\n\`\`\`\n${s.content}\n\`\`\``));
        }
        parts.push("", "## Your Analysis", "Analyze whether the current source code and website would pass these behaviour tests. Report any gaps.");

        logger.info(`[tool] dry_run_behaviour_tests: ${specs.length} specs, ${sources.length} sources, ${webFilesLocal.length} web files`);
        return { textResultForLlm: parts.join("\n") };
      },
    });

    return [...ghTools, ...gitTools, dryRunBehaviourTests];
  };

  // ── Run hybrid session ─────────────────────────────────────────────
  // Cap tool calls to prevent unbounded sessions (W6: Benchmark 010 finding)
  const maxToolCalls = Math.max(20, Math.floor((t.maxTokens || 200000) / 5000));

  const sessionStartTime = Date.now();
  const result = await runCopilotSession({
    workspacePath: process.cwd(),
    model,
    tuning: t,
    agentPrompt: systemPrompt,
    userPrompt: prompt,
    writablePaths,
    createTools,
    attachments,
    maxToolCalls,
    excludedTools: ["dispatch_workflow", "close_issue", "label_issue", "post_discussion_comment"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });
  const sessionDurationMs = Date.now() - sessionStartTime;
  core.info(`Transform session completed in ${Math.round(sessionDurationMs / 1000)}s (${result.tokensIn + result.tokensOut} tokens, maxToolCalls=${maxToolCalls})`);

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
