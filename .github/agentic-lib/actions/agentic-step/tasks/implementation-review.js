// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/implementation-review.js — Trace mission elements through code, tests, website
//
// Uses runCopilotSession with read-only tools to decompose the mission and
// verify each element is implemented, tested, and presented on the website.
// Produces a structured review with test-result table and completeness advice.

import * as core from "@actions/core";
import { existsSync, readdirSync } from "fs";
import { readOptionalFile, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools, createGitTools } from "../../../copilot/github-tools.js";

function buildReviewPrompt(mission, config, agentInstructions, agentLogsSummary) {
  const sourcePath = config.paths?.source?.path || "src/lib/";
  const testsPath = config.paths?.tests?.path || "tests/";
  const webPath = config.paths?.web?.path || "src/web/";
  const behaviourPath = config.paths?.behaviour?.path || "tests/behaviour/";
  const featuresPath = config.paths?.features?.path || "features/";

  return [
    "## Instructions",
    agentInstructions,
    "",
    "## Mission",
    mission || "(no mission defined)",
    "",
    "## Repository Paths",
    `- Source: \`${sourcePath}\``,
    `- Tests: \`${testsPath}\``,
    `- Web: \`${webPath}\``,
    `- Behaviour tests: \`${behaviourPath}\``,
    `- Features: \`${featuresPath}\``,
    "",
    ...(agentLogsSummary ? ["## Previous Reviews", agentLogsSummary, ""] : []),
    "## Your Task",
    "1. Read MISSION.md and decompose it into discrete deliverable elements.",
    "2. For each element, use list_files and read_file to trace it through:",
    "   - Source implementation in src/lib/",
    "   - Unit tests in tests/",
    "   - Behaviour tests (Playwright)",
    "   - Website usage in src/web/ or docs/",
    "   - Integration path (how website accesses the library)",
    "   - Behaviour test coverage of the website feature",
    "3. Flag misleading patterns:",
    "   - Issues closed without corresponding code changes",
    "   - Tests that don't assert anything meaningful (empty/trivial)",
    "   - Features listed as done in docs but missing from code",
    "   - PRs merged without test coverage for the claimed feature",
    "4. Call report_implementation_review with your findings.",
    "",
    "**You MUST call report_implementation_review exactly once.**",
  ].join("\n");
}

/**
 * Implementation review task: decompose mission, trace through code/tests/website.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, review data, tokensUsed, model
 */
export async function implementationReview(context) {
  const { config, instructions, model, octokit, repo, logFilePath, screenshotFilePath } = context;
  const t = config.tuning || {};

  const mission = readOptionalFile(config.paths.mission.path);
  if (!mission) {
    return { outcome: "nop", details: "No mission defined — skipping implementation review" };
  }

  if (existsSync("MISSION_COMPLETE.md") && config.supervisor !== "maintenance") {
    return { outcome: "nop", details: "Mission already complete" };
  }
  if (existsSync("MISSION_FAILED.md")) {
    return { outcome: "nop", details: "Mission already failed" };
  }

  // Check for previous agent logs
  const agentLogsDir = ".agent-logs";
  let agentLogsSummary = "";
  if (existsSync(agentLogsDir)) {
    try {
      const files = readdirSync(agentLogsDir).filter((f) => f.startsWith("agent-log-") && f.endsWith(".md"));
      if (files.length > 0) {
        agentLogsSummary = `${files.length} previous agent log file(s) available. Use list_files and read_file on .agent-logs/ to review them.`;
      }
    } catch { /* ignore */ }
  }

  const agentInstructions = instructions || "Review the implementation completeness of the mission.";
  const prompt = buildReviewPrompt(mission, config, agentInstructions, agentLogsSummary);

  const systemPrompt =
    "You are an implementation review agent for an autonomous coding repository. " +
    "Your job is to trace each mission element through the codebase — verifying that it is " +
    "implemented in source code, covered by unit tests, exercised by behaviour tests, " +
    "presented on the website, and that the behaviour tests verify the website presentation. " +
    "Focus on ground-truth evidence, not metrics. Metrics can be misleading — issues closed " +
    "in error, trivial tests, or features marked done without code all create false confidence." +
    NARRATIVE_INSTRUCTION;

  // Shared mutable state to capture the review
  const reviewResult = { elements: [], gaps: [], advice: "", misleadingMetrics: [] };

  const createTools = (defineTool, _wp, logger) => {
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);
    const gitTools = createGitTools(defineTool, logger);

    const reportReview = defineTool("report_implementation_review", {
      description: "Report the implementation review findings. Call this exactly once with all traced elements, identified gaps, and completeness advice.",
      parameters: {
        type: "object",
        properties: {
          elements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Mission element name" },
                implemented: { type: "boolean", description: "Found in source code" },
                unitTested: { type: "boolean", description: "Has unit test coverage" },
                behaviourTested: { type: "boolean", description: "Has behaviour/Playwright test coverage" },
                websiteUsed: { type: "boolean", description: "Used on the website" },
                integrationPath: { type: "string", description: "How the website accesses this feature" },
                behaviourCoverage: { type: "string", description: "How behaviour tests verify website presentation" },
                notes: { type: "string", description: "Additional observations" },
              },
              required: ["name", "implemented"],
            },
            description: "Mission elements traced through the codebase",
          },
          gaps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                element: { type: "string", description: "Which mission element has the gap" },
                gapType: {
                  type: "string",
                  enum: ["not-implemented", "not-tested", "not-on-website", "no-behaviour-test", "misleading-metric"],
                  description: "Type of gap",
                },
                description: { type: "string", description: "What is missing" },
                severity: {
                  type: "string",
                  enum: ["critical", "moderate", "low"],
                  description: "How important this gap is",
                },
              },
              required: ["element", "gapType", "description", "severity"],
            },
            description: "Identified implementation gaps",
          },
          advice: { type: "string", description: "Single English sentence summarising overall completeness" },
          misleadingMetrics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                metric: { type: "string", description: "Which metric is misleading" },
                reason: { type: "string", description: "Why it is misleading" },
                evidence: { type: "string", description: "What evidence supports this" },
              },
              required: ["metric", "reason"],
            },
            description: "Metrics that may be misleading about actual progress",
          },
        },
        required: ["elements", "gaps", "advice"],
      },
      handler: async ({ elements, gaps, advice, misleadingMetrics }) => {
        reviewResult.elements = elements || [];
        reviewResult.gaps = gaps || [];
        reviewResult.advice = advice || "";
        reviewResult.misleadingMetrics = misleadingMetrics || [];
        return { textResultForLlm: `Review recorded: ${elements?.length || 0} elements traced, ${gaps?.length || 0} gaps found` };
      },
    });

    return [...ghTools, ...gitTools, reportReview];
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
    writablePaths: [],
    createTools,
    attachments,
    excludedTools: ["write_file", "run_command", "run_tests", "dispatch_workflow", "close_issue", "label_issue", "post_discussion_comment", "create_issue", "comment_on_issue"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  const tokensUsed = result.tokensIn + result.tokensOut;

  // Build review table for logging
  const reviewTable = reviewResult.elements.map((e) => ({
    element: e.name,
    implemented: e.implemented ? "YES" : "NO",
    unitTested: e.unitTested ? "YES" : "NO",
    behaviourTested: e.behaviourTested ? "YES" : "NO",
    websiteUsed: e.websiteUsed ? "YES" : "NO",
    notes: e.notes || "",
  }));

  // Set outputs for downstream jobs
  core.setOutput("completeness-advice", (reviewResult.advice || "").substring(0, 500));
  core.setOutput("gaps", JSON.stringify((reviewResult.gaps || []).slice(0, 20)));
  core.setOutput("review-table", JSON.stringify(reviewTable));

  return {
    outcome: "implementation-reviewed",
    tokensUsed,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    narrative: result.narrative || reviewResult.advice,
    reviewTable,
    reviewGaps: reviewResult.gaps,
    completenessAdvice: reviewResult.advice,
    misleadingMetrics: reviewResult.misleadingMetrics,
    details: `Traced ${reviewResult.elements.length} element(s), found ${reviewResult.gaps.length} gap(s)`,
  };
}
