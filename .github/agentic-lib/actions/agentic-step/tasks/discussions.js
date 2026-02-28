// tasks/discussions.js — GitHub Discussions bot
//
// Responds to GitHub Discussions, creates features, seeds repositories,
// and provides status updates. Uses the Copilot SDK for natural conversation.

import * as core from "@actions/core";
import { existsSync } from "fs";
import { runCopilotTask, readOptionalFile, scanDirectory } from "../copilot.js";

/**
 * Respond to a GitHub Discussion using the Copilot SDK.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, action, tokensUsed, model
 */
export async function discussions(context) {
  const { octokit, config, instructions, model, discussionUrl } = context;

  if (!discussionUrl) {
    throw new Error("discussions task requires discussion-url input");
  }

  // Parse discussion URL and fetch content via GraphQL
  const urlMatch = discussionUrl.match(/github\.com\/([^/]+)\/([^/]+)\/discussions\/(\d+)/);
  let discussionTitle = "";
  let discussionBody = "";
  let discussionComments = [];

  if (urlMatch) {
    const [, urlOwner, urlRepo, discussionNumber] = urlMatch;
    try {
      const query = `query {
        repository(owner: "${urlOwner}", name: "${urlRepo}") {
          discussion(number: ${discussionNumber}) {
            title
            body
            comments(last: 10) {
              nodes {
                body
                author { login }
                createdAt
              }
            }
          }
        }
      }`;
      const result = await octokit.graphql(query);
      const discussion = result.repository.discussion;
      discussionTitle = discussion.title || "";
      discussionBody = discussion.body || "";
      discussionComments = discussion.comments.nodes || [];
      core.info(
        `Fetched discussion #${discussionNumber}: "${discussionTitle}" (${discussionComments.length} comments)`,
      );
    } catch (err) {
      core.warning(`Failed to fetch discussion content via GraphQL: ${err.message}. Falling back to URL-only.`);
    }
  } else {
    core.warning(`Could not parse discussion URL: ${discussionUrl}`);
  }

  const mission = readOptionalFile(config.paths.missionFilepath?.path || "MISSION.md");
  const contributing = readOptionalFile(config.paths.contributingFilepath?.path || "CONTRIBUTING.md", 1000);

  const featuresPath = config.paths.featuresPath?.path || "features/";
  let featureNames = [];
  if (existsSync(featuresPath)) {
    featureNames = scanDirectory(featuresPath, ".md").map((f) => f.name.replace(".md", ""));
  }

  const intentionPath = config.intentionBot?.intentionFilepath || "intentïon.md";
  const recentActivity = readOptionalFile(intentionPath).split("\n").slice(-20).join("\n");

  const agentInstructions = instructions || "Respond to the GitHub Discussion as the repository bot.";

  const prompt = [
    "## Instructions",
    agentInstructions,
    "",
    "## Discussion",
    `URL: ${discussionUrl}`,
    discussionTitle ? `### ${discussionTitle}` : "",
    discussionBody || "(no body)",
    discussionComments.length > 0 ? `### Comments (${discussionComments.length})` : "",
    ...discussionComments.map((c) => `**${c.author?.login || "unknown"}** (${c.createdAt}):\n${c.body}`),
    "",
    "## Context",
    `### Mission\n${mission}`,
    contributing ? `### Contributing\n${contributing}` : "",
    `### Current Features\n${featureNames.join(", ") || "none"}`,
    recentActivity ? `### Recent Activity\n${recentActivity}` : "",
    "",
    "## Available Actions",
    "Respond with one of these action tags in your response:",
    "- `[ACTION:seed-repository]` — Reset the sandbox to initial state",
    "- `[ACTION:create-feature] <name>` — Create a new feature",
    "- `[ACTION:update-feature] <name>` — Update an existing feature",
    "- `[ACTION:delete-feature] <name>` — Delete a feature that is no longer needed",
    "- `[ACTION:create-issue] <title>` — Create a new issue",
    "- `[ACTION:nop]` — No action needed, just respond conversationally",
    "- `[ACTION:mission-complete]` — Declare the current mission complete",
    "- `[ACTION:stop]` — Halt automation",
    "",
    "Include exactly one action tag. The rest of your response is the discussion reply.",
    "",
    "## Mission Protection",
    "If the user requests something that contradicts or would undermine the mission,",
    "you MUST push back. Explain why the request conflicts with the mission and suggest",
    "an alternative that aligns with it. Use `[ACTION:nop]` in this case.",
    "The mission is the non-negotiable foundation of this repository.",
  ].join("\n");

  const { content, tokensUsed } = await runCopilotTask({
    model,
    systemMessage:
      "You are a repository bot that responds to GitHub Discussions. You are self-aware — you refer to yourself as the repository. Be helpful, adaptive, and proactive about suggesting features. You can update and delete features proactively when they are outdated or completed. You MUST protect the mission: if a user requests something that contradicts the mission, push back politely and suggest an aligned alternative.",
    prompt,
    writablePaths: [],
  });

  // Parse action from response
  const actionMatch = content.match(/\[ACTION:(\S+?)\](.+)?/);
  const action = actionMatch ? actionMatch[1] : "nop";
  const actionArg = actionMatch && actionMatch[2] ? actionMatch[2].trim() : "";
  const replyBody = content.replace(/\[ACTION:\S+?\].+/, "").trim();

  core.info(`Discussion bot action: ${action}, arg: ${actionArg}`);

  const argSuffix = actionArg ? ` (${actionArg})` : "";
  return {
    outcome: `discussion-${action}`,
    tokensUsed,
    model,
    details: `Action: ${action}${argSuffix}\nReply: ${replyBody.substring(0, 200)}`,
    action,
    actionArg,
    replyBody,
  };
}
