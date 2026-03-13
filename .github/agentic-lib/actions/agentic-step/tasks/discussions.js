// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/discussions.js — GitHub Discussions bot
//
// Uses runCopilotSession with discussion tools: the model fetches, searches,
// and posts to discussions via tools instead of front-loaded prompts.

import * as core from "@actions/core";
import { writeFileSync } from "fs";
import { readOptionalFile, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createDiscussionTools, createGitHubTools } from "../../../copilot/github-tools.js";

const BOT_LOGINS = ["github-actions[bot]", "github-actions"];

/**
 * Pre-fetch discussion for the lean prompt (gives the model initial context).
 */
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
              id
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

/**
 * Respond to a GitHub Discussion using the Copilot SDK with tool-driven exploration.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, action, tokensUsed, model
 */
export async function discussions(context) {
  const { octokit, model, discussionUrl, repo, config, logFilePath, screenshotFilePath } = context;
  const t = config?.tuning || {};

  if (!discussionUrl) {
    throw new Error("discussions task requires discussion-url input");
  }

  // Pre-fetch discussion for the lean prompt
  const discussion = await fetchDiscussion(octokit, discussionUrl, t.discussionComments || 10);

  // Filter discussion comments to only those after the most recent init
  const initTs = config?.init?.timestamp || null;
  if (initTs && discussion.comments.length > 0) {
    const initDate = new Date(initTs);
    discussion.comments = discussion.comments.filter((c) => new Date(c.createdAt) >= initDate);
  }

  const humanComments = discussion.comments.filter((c) => !BOT_LOGINS.includes(c.author?.login));
  const botReplies = discussion.comments.filter((c) => BOT_LOGINS.includes(c.author?.login));
  const latestHumanComment = humanComments.length > 0 ? humanComments[humanComments.length - 1] : null;
  const lastBotReply = botReplies.length > 0 ? botReplies[botReplies.length - 1] : null;

  // Extract trigger comment info
  const triggerComment = {};
  const eventComment = context.github?.payload?.comment;
  if (eventComment) {
    triggerComment.nodeId = eventComment.node_id || "";
    triggerComment.createdAt = eventComment.created_at || "";
    triggerComment.body = eventComment.body || "";
    triggerComment.login = eventComment.user?.login || "";
    core.info(`Trigger comment from event payload: ${triggerComment.login} at ${triggerComment.createdAt}`);
  }
  if (context.commentNodeId) triggerComment.nodeId = context.commentNodeId;
  if (context.commentCreatedAt) triggerComment.createdAt = context.commentCreatedAt;

  const mission = readOptionalFile(config.paths.mission.path);
  const agentInstructions = context.instructions || "Respond to the GitHub Discussion as the repository bot.";
  const botMessage = process.env.BOT_MESSAGE || "";

  // ── Build lean prompt ──────────────────────────────────────────────
  const promptParts = [
    "## Instructions",
    agentInstructions,
    "",
    "## Discussion Thread",
    `URL: ${discussionUrl}`,
    discussion.title ? `### ${discussion.title}` : "",
    discussion.body || "(no body)",
  ];

  if (humanComments.length > 0) {
    promptParts.push("", "### Recent Conversation");
    for (const c of humanComments.slice(-5)) {
      let isTrigger = false;
      if (triggerComment?.nodeId && c.id) {
        isTrigger = c.id === triggerComment.nodeId;
      } else if (triggerComment?.createdAt && c.createdAt) {
        isTrigger = c.createdAt === triggerComment.createdAt;
      } else {
        isTrigger = c === latestHumanComment;
      }
      const prefix = isTrigger ? ">>> **[TRIGGER — RESPOND TO THIS]** " : "";
      promptParts.push(`${prefix}**${c.author?.login || "unknown"}** (${c.createdAt}):\n${c.body}`);
    }
  }

  if (lastBotReply) {
    promptParts.push("", "### Your Last Reply (DO NOT REPEAT THIS)", lastBotReply.body.substring(0, 500));
  }

  if (botMessage) {
    promptParts.push(
      "",
      "## Triggering Request",
      "The supervisor dispatched you with the following message. This is your primary request — respond to it in the discussion thread:",
      "",
      botMessage,
    );
  }

  promptParts.push(
    "",
    "## Repository Context",
    `### Mission\n${mission}`,
    "",
    "## Your Task",
    "Read the discussion above. Use list_issues to see open issues if relevant.",
    "Use list_discussions or search_discussions to find related conversations.",
    "Compose a concise, engaging reply and call report_action with your reply and chosen action.",
    "",
    "## Available Actions (pass to report_action)",
    "- `nop` — No action needed, just respond conversationally",
    "- `request-supervisor` — Ask the supervisor to evaluate and act on a user request",
    "- `create-feature` — Create a new feature (pass name as argument)",
    "- `create-issue` — Create a new issue (pass title as argument)",
    "- `mission-complete` — Declare mission complete",
    "- `stop` — Halt automation",
    "",
    "**You MUST call report_action exactly once** with your reply text and action choice.",
  );

  const prompt = promptParts.filter(Boolean).join("\n");

  const systemPrompt =
    "You are this repository. Respond in first person. Be concise and engaging — never repeat what you said in your last reply. Adapt to the user's language level. Encourage experimentation and suggest interesting projects. When a user requests an action, pass it to the supervisor via request-supervisor action. Protect the mission: push back on requests that contradict it." +
    NARRATIVE_INSTRUCTION;

  // ── Shared mutable state for action results ──────────────────────
  const actionResults = { action: "nop", actionArg: "", replyBody: "" };
  const isSdkRepo = process.env.GITHUB_REPOSITORY === "xn-intenton-z2a/agentic-lib";

  // ── Create tools ─────────────────────────────────────────────────
  const createTools = (defineTool, _wp, logger) => {
    const discTools = createDiscussionTools(octokit, repo, defineTool, logger);
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);

    // Action tool — lets the model report its action and reply
    const reportAction = defineTool("report_action", {
      description: "Report the action taken in this discussion response and post your reply. Call this exactly once.",
      parameters: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["nop", "request-supervisor", "create-feature", "update-feature", "delete-feature", "create-issue", "seed-repository", "mission-complete", "stop"],
            description: "The action type",
          },
          argument: { type: "string", description: "Action argument (e.g. feature name, issue title, supervisor message)" },
          reply: { type: "string", description: "The reply text to post to the discussion" },
        },
        required: ["action", "reply"],
      },
      handler: async ({ action, argument, reply }) => {
        actionResults.action = action;
        actionResults.actionArg = argument || "";
        actionResults.replyBody = reply;

        // Execute side effects
        if (action === "mission-complete") {
          const signal = [
            "# Mission Complete",
            "",
            `- **Timestamp:** ${new Date().toISOString()}`,
            `- **Detected by:** discussions`,
            `- **Reason:** ${argument || "Declared via discussion bot"}`,
            "",
            "This file was created automatically. To restart transformations, delete this file or run `npx @xn-intenton-z2a/agentic-lib init --reseed`.",
          ].join("\n");
          writeFileSync("MISSION_COMPLETE.md", signal);
          logger.info("Mission complete signal written (MISSION_COMPLETE.md)");
        }

        if (action === "create-issue" && argument) {
          try {
            const { data: issue } = await octokit.rest.issues.create({
              ...repo,
              title: argument,
              labels: ["automated", "enhancement"],
            });
            logger.info(`Created issue #${issue.number}: ${argument}`);
          } catch (err) {
            logger.warning(`Failed to create issue: ${err.message}`);
          }
        }

        if (action === "request-supervisor") {
          logger.info(`Supervisor requested: ${argument || "Discussion bot referral"} (dispatch handled by bot workflow)`);
        }

        if (action === "stop") {
          if (isSdkRepo) {
            logger.info("Skipping schedule dispatch — running in SDK repo");
          } else {
            try {
              await octokit.rest.actions.createWorkflowDispatch({
                ...repo,
                workflow_id: "agentic-lib-schedule.yml",
                ref: "main",
                inputs: { frequency: "off" },
              });
              logger.info("Automation stopped via discussions bot");
            } catch (err) {
              logger.warning(`Failed to stop automation: ${err.message}`);
            }
          }
        }

        // Post the reply to the discussion
        if (discussion.nodeId && reply) {
          try {
            const mutation = `mutation($discussionId: ID!, $body: String!) {
              addDiscussionComment(input: { discussionId: $discussionId, body: $body }) {
                comment { url }
              }
            }`;
            const { addDiscussionComment } = await octokit.graphql(mutation, {
              discussionId: discussion.nodeId,
              body: reply,
            });
            logger.info(`Posted reply: ${addDiscussionComment.comment.url}`);
          } catch (err) {
            logger.warning(`Failed to post discussion reply: ${err.message}`);
          }
        }

        return { textResultForLlm: `Action recorded: ${action}. Reply posted.` };
      },
    });

    return [...discTools, ...ghTools, reportAction];
  };

  // ── Run hybrid session ───────────────────────────────────────────
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
    excludedTools: ["write_file", "run_command", "run_tests", "dispatch_workflow"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  core.info(`Discussion bot action: ${actionResults.action}, arg: ${actionResults.actionArg}`);

  const argSuffix = actionResults.actionArg ? ` (${actionResults.actionArg})` : "";
  return {
    outcome: `discussion-${actionResults.action}`,
    tokensUsed: result.tokensIn + result.tokensOut,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: `Action: ${actionResults.action}${argSuffix}\nReply: ${(actionResults.replyBody || "").substring(0, 200)}`,
    narrative: result.narrative || extractNarrative(result.agentMessage, `Responded to discussion with action ${actionResults.action}${argSuffix}.`),
    action: actionResults.action,
    actionArg: actionResults.actionArg,
    replyBody: actionResults.replyBody,
  };
}
