// tasks/maintain-features.js — Feature lifecycle management
//
// Reviews existing features, creates new ones from mission/library analysis,
// prunes completed/irrelevant features, and ensures quality.

import { runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection } from "../copilot.js";

/**
 * Maintain the feature set — create, update, or prune feature files.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function maintainFeatures(context) {
  const { config, instructions, writablePaths, model, octokit, repo } = context;

  const mission = readOptionalFile(config.paths.missionFilepath?.path || "MISSION.md");
  const featuresPath = config.paths.featuresPath?.path || "features/";
  const featureLimit = config.paths.featuresPath?.limit || 4;
  const features = scanDirectory(featuresPath, ".md");
  const libraryDocs = scanDirectory(config.paths.libraryDocumentsPath?.path || "library/", ".md", {
    contentLimit: 1000,
  });

  const { data: closedIssues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "closed",
    per_page: 20,
    sort: "updated",
    direction: "desc",
  });

  const agentInstructions = instructions || "Maintain the feature set by creating, updating, or pruning features.";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    "## Mission",
    mission,
    "",
    `## Current Features (${features.length}/${featureLimit} max)`,
    ...features.map((f) => `### ${f.name}\n${f.content}`),
    "",
    libraryDocs.length > 0 ? `## Library Documents (${libraryDocs.length})` : "",
    ...libraryDocs.map((d) => `### ${d.name}\n${d.content}`),
    "",
    `## Recently Closed Issues (${closedIssues.length})`,
    ...closedIssues.slice(0, 10).map((i) => `- #${i.number}: ${i.title}`),
    "",
    "## Your Task",
    `1. Review each existing feature — if it is already implemented or irrelevant, delete it.`,
    `2. If there are fewer than ${featureLimit} features, create new features aligned with the mission.`,
    "3. Ensure each feature has clear, testable acceptance criteria.",
    "",
    formatPathsSection(writablePaths, config.readOnlyPaths || []),
    "",
    "## Constraints",
    `- Maximum ${featureLimit} feature files`,
    "- Feature files must be markdown with a descriptive filename (e.g. HTTP_SERVER.md)",
  ].join("\n");

  const { tokensUsed } = await runCopilotTask({
    model,
    systemMessage:
      "You are a feature lifecycle manager. Create, update, and prune feature specification files to keep the project focused on its mission.",
    prompt,
    writablePaths,
  });

  return {
    outcome: "features-maintained",
    tokensUsed,
    model,
    details: `Maintained features (${features.length} existing, limit ${featureLimit})`,
  };
}
