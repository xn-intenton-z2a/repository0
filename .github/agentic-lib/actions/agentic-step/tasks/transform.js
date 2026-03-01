// tasks/transform.js — Full mission → features → issues → code pipeline
//
// Reads the mission, analyzes the current state, identifies what to build next,
// and either creates features, issues, or code.

import * as core from "@actions/core";
import { runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection } from "../copilot.js";

/**
 * Run the full transformation pipeline from mission to code.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function transform(context) {
  const { config, instructions, writablePaths, testCommand, model, octokit, repo } = context;

  // Read mission (required)
  const missionPath = config.paths.missionFilepath?.path || "MISSION.md";
  const mission = readOptionalFile(missionPath);
  if (!mission) {
    core.warning(`No mission file found at ${missionPath}`);
    return { outcome: "nop", details: "No mission file found" };
  }

  const features = scanDirectory(config.paths.featuresPath?.path || "features/", ".md");
  const sourceFiles = scanDirectory(config.paths.targetSourcePath?.path || "src/", [".js", ".ts"], {
    contentLimit: 2000,
    recursive: true,
  });

  const { data: openIssues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "open",
    per_page: 20,
  });

  const agentInstructions =
    instructions || "Transform the repository toward its mission by identifying the next best action.";
  const readOnlyPaths = config.readOnlyPaths || [];

  // TDD mode: split into test-first + implementation phases
  if (config.tdd === true) {
    return await transformTdd({
      config,
      instructions: agentInstructions,
      writablePaths,
      readOnlyPaths,
      testCommand,
      model,
      mission,
      features,
      sourceFiles,
      openIssues,
    });
  }

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    "## Mission",
    mission,
    "",
    `## Current Features (${features.length})`,
    ...features.map((f) => `### ${f.name}\n${f.content.substring(0, 500)}`),
    "",
    `## Current Source Files (${sourceFiles.length})`,
    ...sourceFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
    "",
    `## Open Issues (${openIssues.length})`,
    ...openIssues.slice(0, 10).map((i) => `- #${i.number}: ${i.title}`),
    "",
    "## Your Task",
    "Analyze the mission, features, source code, and open issues.",
    "Determine the single most impactful next step to transform this repository.",
    "Then implement that step.",
    "",
    formatPathsSection(writablePaths, readOnlyPaths),
    "",
    "## Constraints",
    `- Run \`${testCommand}\` to validate your changes`,
  ].join("\n");

  core.info(`Transform prompt length: ${prompt.length} chars`);

  const { content: resultContent, tokensUsed } = await runCopilotTask({
    model,
    systemMessage:
      "You are an autonomous code transformation agent. Your goal is to advance the repository toward its mission by making the most impactful change possible in a single step.",
    prompt,
    writablePaths,
  });

  core.info(`Transformation step completed (${tokensUsed} tokens)`);

  return {
    outcome: "transformed",
    tokensUsed,
    model,
    details: resultContent.substring(0, 500),
  };
}

/**
 * TDD-mode transformation: Phase 1 creates a failing test, Phase 2 writes implementation.
 */
async function transformTdd({
  config: _config,
  instructions,
  writablePaths,
  readOnlyPaths,
  testCommand,
  model,
  mission,
  features,
  sourceFiles,
  openIssues,
}) {
  let totalTokens = 0;

  // Phase 1: Create a failing test
  core.info("TDD Phase 1: Creating failing test");

  const testPrompt = [
    "## Instructions",
    instructions,
    "",
    "## Mode: TDD Phase 1 — Write Failing Test",
    "You are in TDD mode. In this phase, you must ONLY write a test.",
    "The test should capture the next feature requirement based on the mission and current state.",
    "The test MUST fail against the current codebase (it tests something not yet implemented).",
    "Do NOT write any implementation code in this phase.",
    "",
    "## Mission",
    mission,
    "",
    `## Current Features (${features.length})`,
    ...features.map((f) => `### ${f.name}\n${f.content.substring(0, 500)}`),
    "",
    `## Current Source Files (${sourceFiles.length})`,
    ...sourceFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
    "",
    `## Open Issues (${openIssues.length})`,
    ...openIssues.slice(0, 10).map((i) => `- #${i.number}: ${i.title}`),
    "",
    formatPathsSection(writablePaths, readOnlyPaths),
    "",
    "## Constraints",
    "- Write ONLY test code in this phase",
    "- The test must fail when run (it tests unimplemented functionality)",
    `- Run \`${testCommand}\` to confirm the test fails`,
  ].join("\n");

  const phase1 = await runCopilotTask({
    model,
    systemMessage:
      "You are a TDD agent. In this phase, write ONLY a failing test that captures the next feature requirement. Do not write implementation code.",
    prompt: testPrompt,
    writablePaths,
  });
  totalTokens += phase1.tokensUsed;
  const testResult = phase1.content;

  core.info(`TDD Phase 1 completed (${totalTokens} tokens): test created`);

  // Phase 2: Write implementation to make the test pass
  core.info("TDD Phase 2: Writing implementation");

  const implPrompt = [
    "## Instructions",
    instructions,
    "",
    "## Mode: TDD Phase 2 — Write Implementation",
    "A failing test has been written in Phase 1. Your job is to write the MINIMUM implementation",
    "code needed to make the test pass. Do not modify the test.",
    "",
    "## What was done in Phase 1",
    testResult.substring(0, 1000),
    "",
    "## Mission",
    mission,
    "",
    `## Current Source Files (${sourceFiles.length})`,
    ...sourceFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
    "",
    formatPathsSection(writablePaths, readOnlyPaths),
    "",
    "## Constraints",
    "- Write implementation code to make the failing test pass",
    "- Do NOT modify the test file created in Phase 1",
    `- Run \`${testCommand}\` to confirm all tests pass`,
  ].join("\n");

  const phase2 = await runCopilotTask({
    model,
    systemMessage:
      "You are a TDD agent. A failing test was written in Phase 1. Write the minimum implementation to make it pass. Do not modify the test.",
    prompt: implPrompt,
    writablePaths,
  });
  totalTokens += phase2.tokensUsed;

  core.info(`TDD Phase 2 completed (total ${totalTokens} tokens)`);

  return {
    outcome: "transformed-tdd",
    tokensUsed: totalTokens,
    model,
    details: `TDD transformation: Phase 1 (failing test) + Phase 2 (implementation). ${testResult.substring(0, 200)}`,
  };
}
