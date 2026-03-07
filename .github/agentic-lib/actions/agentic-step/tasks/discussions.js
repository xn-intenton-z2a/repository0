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

function buildPrompt(discussionUrl, discussion, context, t, repoContext, triggerComment) {
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
      // Identify the triggering comment: match by node_id, then by createdAt, then fall back to latest
      let isTrigger = false;
      if (triggerComment?.nodeId && c.id) {
        isTrigger = c.id === triggerComment.nodeId;
      } else if (triggerComment?.createdAt && c.createdAt) {
        isTrigger = c.createdAt === triggerComment.createdAt;
      } else {
        isTrigger = c === latestHumanComment;
      }
      const prefix = isTrigger ? ">>> **[TRIGGER — RESPOND TO THIS]** " : "";
      const nodeIdTag = c.id ? ` [node:${c.id}]` : "";
      parts.push(`${prefix}**${c.author?.login || "unknown"}** (${c.createdAt})${nodeIdTag}:\n${c.body}`);
    }
  }

  if (lastBotReply) {
    parts.push("", "### Your Last Reply (DO NOT REPEAT THIS)", lastBotReply.body.substring(0, 500));
  }

  // Include supervisor message if dispatched with context
  const botMessage = process.env.BOT_MESSAGE || "";
  if (botMessage) {
    parts.push(
      "",
      "## Triggering Request",
      "The supervisor dispatched you with the following message. This is your primary request — respond to it in the discussion thread:",
      "",
      botMessage,
    );
  }

  parts.push(
    "",
    "## Repository Context",
    `### Mission\n${mission}`,
    contributing ? `### Contributing\n${contributing}` : "",
    `### Current Features\n${featureNames.join(", ") || "none"}`,
  );

  // Add issue context
  if (repoContext?.issuesSummary?.length > 0) {
    parts.push(`### Open Issues (${repoContext.issuesSummary.length})`, repoContext.issuesSummary.join("\n"));
  }

  // Add actions-since-init context
  if (repoContext?.actionsSinceInit?.length > 0) {
    parts.push(
      `### Actions Since Last Init${repoContext.initTimestamp ? ` (${repoContext.initTimestamp})` : ""}`,
      ...repoContext.actionsSinceInit.map((a) => {
        let line = `- ${a.name}: ${a.conclusion} (${a.created}) [${a.commitSha}] ${a.commitMessage}`;
        if (a.prNumber) {
          line += ` — PR #${a.prNumber}: +${a.additions}/-${a.deletions} in ${a.changedFiles} file(s)`;
        }
        return line;
      }),
    );
  }

  parts.push(
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
  const { octokit, model, discussionUrl, repo, config } = context;
  const t = config?.tuning || {};

  if (!discussionUrl) {
    throw new Error("discussions task requires discussion-url input");
  }

  // Gather repo context: issues + actions since init
  const repoContext = { issuesSummary: [], actionsSinceInit: [], initTimestamp: null };
  if (octokit && repo) {
    try {
      const { data: openIssues } = await octokit.rest.issues.listForRepo({
        ...repo, state: "open", per_page: 10, sort: "created", direction: "asc",
      });
      const initTimestampForIssues = config?.init?.timestamp || null;
      const initEpochForIssues = initTimestampForIssues ? new Date(initTimestampForIssues).getTime() : 0;
      repoContext.issuesSummary = openIssues
        .filter((i) => !i.pull_request && (initEpochForIssues <= 0 || new Date(i.created_at).getTime() >= initEpochForIssues))
        .map((i) => {
          const labels = i.labels.map((l) => l.name).join(", ");
          return `#${i.number}: ${i.title} [${labels || "no labels"}]`;
        });
    } catch (err) {
      core.warning(`Could not fetch issues for discussion context: ${err.message}`);
    }

    const initTimestamp = config?.init?.timestamp || null;
    repoContext.initTimestamp = initTimestamp;
    try {
      const { data: runs } = await octokit.rest.actions.listWorkflowRunsForRepo({
        ...repo, per_page: 20,
      });
      const initDate = initTimestamp ? new Date(initTimestamp) : null;
      const relevantRuns = initDate
        ? runs.workflow_runs.filter((r) => new Date(r.created_at) >= initDate)
        : runs.workflow_runs.slice(0, 10);

      for (const run of relevantRuns) {
        const commit = run.head_commit;
        const entry = {
          name: run.name,
          conclusion: run.conclusion || run.status,
          created: run.created_at,
          commitMessage: commit?.message?.split("\n")[0] || "",
          commitSha: run.head_sha?.substring(0, 7) || "",
        };
        if (run.head_branch?.startsWith("agentic-lib-issue-")) {
          try {
            const { data: prs } = await octokit.rest.pulls.list({
              ...repo, head: `${repo.owner}:${run.head_branch}`, state: "all", per_page: 1,
            });
            if (prs.length > 0) {
              entry.prNumber = prs[0].number;
              entry.additions = prs[0].additions;
              entry.deletions = prs[0].deletions;
              entry.changedFiles = prs[0].changed_files;
            }
          } catch { /* ignore */ }
        }
        repoContext.actionsSinceInit.push(entry);
      }
    } catch (err) {
      core.warning(`Could not fetch workflow runs for discussion context: ${err.message}`);
    }
  }

  const discussion = await fetchDiscussion(octokit, discussionUrl, t.discussionComments || 10);

  // Filter discussion comments to only those after the most recent init
  const initTs = config?.init?.timestamp || null;
  if (initTs && discussion.comments.length > 0) {
    const initDate = new Date(initTs);
    discussion.comments = discussion.comments.filter((c) => new Date(c.createdAt) >= initDate);
  }

  // Extract trigger comment info from multiple sources:
  // 1. Event payload (discussion_comment event) — most reliable
  // 2. Explicit inputs (comment-node-id, comment-created-at) — for workflow_dispatch
  // 3. Fall back to latest human comment (handled in buildPrompt)
  const triggerComment = {};
  const eventComment = context.github?.payload?.comment;
  if (eventComment) {
    triggerComment.nodeId = eventComment.node_id || "";
    triggerComment.createdAt = eventComment.created_at || "";
    triggerComment.body = eventComment.body || "";
    triggerComment.login = eventComment.user?.login || "";
    core.info(`Trigger comment from event payload: ${triggerComment.login} at ${triggerComment.createdAt}`);
  }
  // Explicit inputs override event payload (workflow_dispatch or workflow_call may pass these)
  if (context.commentNodeId) triggerComment.nodeId = context.commentNodeId;
  if (context.commentCreatedAt) triggerComment.createdAt = context.commentCreatedAt;

  const prompt = buildPrompt(discussionUrl, discussion, context, t, repoContext, triggerComment);
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

  // Guard: never dispatch workflows from the SDK repo itself (agentic-lib)
  const isSdkRepo = process.env.GITHUB_REPOSITORY === "xn-intenton-z2a/agentic-lib";

  // Request supervisor evaluation
  if (action === "request-supervisor") {
    if (isSdkRepo) {
      core.info("Skipping supervisor dispatch — running in SDK repo");
    } else {
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
  }

  // Stop automation
  if (action === "stop") {
    if (isSdkRepo) {
      core.info("Skipping schedule dispatch — running in SDK repo");
    } else {
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
    narrative: `Responded to discussion with action ${action}${argSuffix}.`,
    action,
    actionArg,
    replyBody,
  };
}
