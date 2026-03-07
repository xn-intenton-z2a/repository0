// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/discussions.js — GitHub Discussions bot
//
// Responds to GitHub Discussions, creates features, seeds repositories,
// and provides status updates. Uses the Copilot SDK for natural conversation.

import * as core from "@actions/core";
import { existsSync, writeFileSync } from "fs";
import { runCopilotTask, readOptionalFile, scanDirectory } from "../copilot.js";

const BOT_LOGINS = ["github-actions[bot]", "github-actions"];

async function fetchDiscussion(octokit, discussionUrl, commentsLimit = 10) {
  const urlMatch = discussionUrl.match(/github\.com\/([^/]+)\/([^/]+)\/discussions\/(\d+)/);
  if (!urlMatch) {
    core.warning(`Could not parse discussion URL: ${discussionUrl}`);
    return { title: "", body: "", comments: [], nodeId: "" };
  }

  const [, urlOwner, urlRepo, discussionNumber] = urlMatch;
  try {
    const query = `query {
      repository(owner: "${urlOwner}", name: "${urlRepo}") {
        discussion(number: ${discussionNumber}) {
          id
          title
          body
          comments(last: ${commentsLimit}) {
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
    core.info(
      `Fetched discussion #${discussionNumber}: "${discussion.title}" (${discussion.comments.nodes.length} comments)`,
    );
    return {
      title: discussion.title || "",
      body: discussion.body || "",
      comments: discussion.comments.nodes || [],
      nodeId: discussion.id || "",
    };
  } catch (err) {
    core.warning(`Failed to fetch discussion content via GraphQL: ${err.message}. Falling back to URL-only.`);
    return { title: "", body: "", comments: [], nodeId: "" };
  }
}

function buildPrompt(discussionUrl, discussion, context, t) {
  const { config, instructions } = context;
  const { title, body, comments } = discussion;

  const humanComments = comments.filter((c) => !BOT_LOGINS.includes(c.author?.login));
  const botReplies = comments.filter((c) => BOT_LOGINS.includes(c.author?.login));
  const latestHumanComment = humanComments.length > 0 ? humanComments[humanComments.length - 1] : null;
  const lastBotReply = botReplies.length > 0 ? botReplies[botReplies.length - 1] : null;

  const mission = readOptionalFile(config.paths.mission.path);
  const contributing = readOptionalFile(config.paths.contributing.path, t.documentSummary || 1000);
  const featuresPath = config.paths.features.path;
  const featureNames = existsSync(featuresPath)
    ? scanDirectory(featuresPath, ".md").map((f) => f.name.replace(".md", ""))
    : [];
  const recentActivity = readOptionalFile(config.intentionBot.intentionFilepath).split("\n").slice(-20).join("\n");
  const agentInstructions = instructions || "Respond to the GitHub Discussion as the repository bot.";

  const parts = [
    "## Instructions",
    agentInstructions,
    "",
    "## Discussion Thread",
    `URL: ${discussionUrl}`,
    title ? `### ${title}` : "",
    body || "(no body)",
  ];

  if (humanComments.length > 0) {
    parts.push("", "### Conversation History");
    for (const c of humanComments) {
      const prefix = c === latestHumanComment ? ">>> **[LATEST — RESPOND TO THIS]** " : "";
      parts.push(`${prefix}**${c.author?.login || "unknown"}** (${c.createdAt}):\n${c.body}`);
    }
  }

  if (lastBotReply) {
    parts.push("", "### Your Last Reply (DO NOT REPEAT THIS)", lastBotReply.body.substring(0, 500));
  }

  parts.push(
    "",
    "## Repository Context",
    `### Mission\n${mission}`,
    contributing ? `### Contributing\n${contributing}` : "",
    `### Current Features\n${featureNames.join(", ") || "none"}`,
    recentActivity ? `### Recent Activity\n${recentActivity}` : "",
    config.configToml ? `### Configuration (agentic-lib.toml)\n\`\`\`toml\n${config.configToml}\n\`\`\`` : "",
    config.packageJson ? `### Dependencies (package.json)\n\`\`\`json\n${config.packageJson}\n\`\`\`` : "",
    "",
    "## Actions",
    "Include exactly one action tag in your response. Only mention actions to the user when relevant.",
    "`[ACTION:request-supervisor] <free text>` — Ask the supervisor to evaluate and act on a user request",
    "`[ACTION:create-feature] <name>` — Create a new feature",
    "`[ACTION:update-feature] <name>` — Update an existing feature",
    "`[ACTION:delete-feature] <name>` — Delete a feature",
    "`[ACTION:create-issue] <title>` — Create a new issue",
    "`[ACTION:seed-repository]` — Reset to initial state",
    "`[ACTION:nop]` — No action needed, just respond conversationally",
    "`[ACTION:mission-complete]` — Declare mission complete",
    "`[ACTION:stop]` — Halt automation",
  );

  return parts.filter(Boolean).join("\n");
}

async function postReply(octokit, nodeId, replyBody) {
  if (!nodeId) {
    core.warning("Cannot post reply: discussion node ID not available");
    return;
  }
  if (!replyBody) {
    core.warning("Cannot post reply: no reply content generated");
    return;
  }
  try {
    const mutation = `mutation($discussionId: ID!, $body: String!) {
      addDiscussionComment(input: { discussionId: $discussionId, body: $body }) {
        comment { url }
      }
    }`;
    const { addDiscussionComment } = await octokit.graphql(mutation, {
      discussionId: nodeId,
      body: replyBody,
    });
    core.info(`Posted reply to discussion: ${addDiscussionComment.comment.url}`);
  } catch (err) {
    core.warning(`Failed to post discussion reply: ${err.message}`);
  }
}

/**
 * Respond to a GitHub Discussion using the Copilot SDK.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, action, tokensUsed, model
 */
export async function discussions(context) {
  const { octokit, model, discussionUrl } = context;
  const t = context.config?.tuning || {};

  if (!discussionUrl) {
    throw new Error("discussions task requires discussion-url input");
  }

  const discussion = await fetchDiscussion(octokit, discussionUrl, t.discussionComments || 10);
  const prompt = buildPrompt(discussionUrl, discussion, context, t);
  const { content, tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage:
      "You are this repository. Respond in first person. Be concise and engaging — never repeat what you said in your last reply. Adapt to the user's language level. Encourage experimentation and suggest interesting projects. When a user requests an action, pass it to the supervisor via [ACTION:request-supervisor]. Protect the mission: push back on requests that contradict it.",
    prompt,
    writablePaths: [],
    tuning: t,
  });

  const actionMatch = content.match(/\[ACTION:(\S+?)\](.+)?/);
  const action = actionMatch ? actionMatch[1] : "nop";
  const actionArg = actionMatch && actionMatch[2] ? actionMatch[2].trim() : "";
  const replyBody = content.replace(/\[ACTION:\S+?\].+/, "").trim();

  core.info(`Discussion bot action: ${action}, arg: ${actionArg}`);

  // Write MISSION_COMPLETE.md signal when bot declares mission complete
  if (action === "mission-complete") {
    const signal = [
      "# Mission Complete",
      "",
      `- **Timestamp:** ${new Date().toISOString()}`,
      `- **Detected by:** discussions`,
      `- **Reason:** ${actionArg || "Declared via discussion bot"}`,
      "",
      "This file was created automatically. To restart transformations, delete this file or run `npx @xn-intenton-z2a/agentic-lib init --reseed`.",
    ].join("\n");
    writeFileSync("MISSION_COMPLETE.md", signal);
    core.info("Mission complete signal written (MISSION_COMPLETE.md)");
  }

  // Create issue when bot requests it
  if (action === "create-issue" && actionArg) {
    try {
      const { data: issue } = await octokit.rest.issues.create({
        ...context.repo,
        title: actionArg,
        labels: ["automated", "enhancement"],
      });
      core.info(`Created issue #${issue.number}: ${actionArg}`);
    } catch (err) {
      core.warning(`Failed to create issue: ${err.message}`);
    }
  }

  // Request supervisor evaluation
  if (action === "request-supervisor") {
    try {
      await octokit.rest.actions.createWorkflowDispatch({
        ...context.repo,
        workflow_id: "agentic-lib-workflow.yml",
        ref: "main",
        inputs: { message: actionArg || "Discussion bot referral" },
      });
      core.info(`Dispatched supervisor with message: ${actionArg}`);
    } catch (err) {
      core.warning(`Failed to dispatch supervisor: ${err.message}`);
    }
  }

  // Stop automation
  if (action === "stop") {
    try {
      await octokit.rest.actions.createWorkflowDispatch({
        ...context.repo,
        workflow_id: "agentic-lib-schedule.yml",
        ref: "main",
        inputs: { frequency: "off" },
      });
      core.info("Automation stopped via discussions bot");
    } catch (err) {
      core.warning(`Failed to stop automation: ${err.message}`);
    }
  }

  await postReply(octokit, discussion.nodeId, replyBody);

  const argSuffix = actionArg ? ` (${actionArg})` : "";
  return {
    outcome: `discussion-${action}`,
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Action: ${action}${argSuffix}\nReply: ${replyBody.substring(0, 200)}`,
    action,
    actionArg,
    replyBody,
  };
}
