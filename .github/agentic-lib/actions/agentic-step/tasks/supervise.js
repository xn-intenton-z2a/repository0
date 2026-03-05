// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/supervise.js — Supervisor orchestration via LLM
//
// Gathers repository context (issues, PRs, workflows, features, library, activity),
// asks the Copilot SDK to choose multiple concurrent actions, then dispatches them.

import * as core from "@actions/core";
import { existsSync } from "fs";
import { runCopilotTask, readOptionalFile, scanDirectory } from "../copilot.js";

async function gatherContext(octokit, repo, config) {
  const mission = readOptionalFile(config.paths.mission.path);
  const recentActivity = readOptionalFile(config.intentionBot.intentionFilepath).split("\n").slice(-20).join("\n");

  const featuresPath = config.paths.features.path;
  const featureNames = existsSync(featuresPath)
    ? scanDirectory(featuresPath, ".md").map((f) => f.name.replace(".md", ""))
    : [];
  const featuresLimit = config.paths.features.limit || 4;

  const libraryPath = config.paths.library?.path || "library/";
  const libraryNames = existsSync(libraryPath)
    ? scanDirectory(libraryPath, ".md").map((f) => f.name.replace(".md", ""))
    : [];
  const libraryLimit = config.paths.library?.limit || 32;

  const { data: openIssues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "open",
    per_page: 20,
    sort: "created",
    direction: "asc",
  });
  const issuesOnly = openIssues.filter((i) => !i.pull_request);
  const oldestReadyIssue = issuesOnly.find((i) => i.labels.some((l) => l.name === "ready"));
  const issuesSummary = issuesOnly.map((i) => {
    const age = Math.floor((Date.now() - new Date(i.created_at).getTime()) / 86400000);
    const labels = i.labels.map((l) => l.name).join(", ");
    return `#${i.number}: ${i.title} [${labels || "no labels"}] (${age}d old)`;
  });

  const { data: openPRs } = await octokit.rest.pulls.list({
    ...repo,
    state: "open",
    per_page: 10,
    sort: "updated",
    direction: "desc",
  });
  const prsSummary = openPRs.map((pr) => {
    const age = Math.floor((Date.now() - new Date(pr.created_at).getTime()) / 86400000);
    const labels = pr.labels.map((l) => l.name).join(", ");
    return `#${pr.number}: ${pr.title} (${pr.head.ref}) [${labels || "no labels"}] (${age}d old)`;
  });

  let workflowsSummary = [];
  try {
    const { data: runs } = await octokit.rest.actions.listWorkflowRunsForRepo({
      ...repo,
      per_page: 10,
    });
    workflowsSummary = runs.workflow_runs.map((r) => `${r.name}: ${r.conclusion || r.status} (${r.created_at})`);
  } catch (err) {
    core.warning(`Could not fetch workflow runs: ${err.message}`);
  }

  return {
    mission,
    recentActivity,
    featureNames,
    featuresLimit,
    libraryNames,
    libraryLimit,
    issuesSummary,
    oldestReadyIssue,
    prsSummary,
    workflowsSummary,
    supervisor: config.supervisor,
    configToml: config.configToml,
    packageJson: config.packageJson,
    featureIssuesWipLimit: config.featureDevelopmentIssuesWipLimit,
    maintenanceIssuesWipLimit: config.maintenanceIssuesWipLimit,
  };
}

function buildPrompt(ctx, agentInstructions) {
  return [
    "## Instructions",
    agentInstructions,
    "",
    "## Mission",
    ctx.mission || "(no mission defined)",
    "",
    "## Repository State",
    `### Open Issues (${ctx.issuesSummary.length})`,
    ctx.issuesSummary.join("\n") || "none",
    "",
    `### Open PRs (${ctx.prsSummary.length})`,
    ctx.prsSummary.join("\n") || "none",
    "",
    `### Features (${ctx.featureNames.length}/${ctx.featuresLimit})`,
    ctx.featureNames.join(", ") || "none",
    "",
    `### Library Docs (${ctx.libraryNames.length}/${ctx.libraryLimit})`,
    ctx.libraryNames.join(", ") || "none",
    "",
    `### Recent Workflow Runs`,
    ctx.workflowsSummary.join("\n") || "none",
    "",
    `### Recent Activity`,
    ctx.recentActivity || "none",
    "",
    `### Supervisor: ${ctx.supervisor}`,
    "",
    "### Configuration (agentic-lib.toml)",
    "```toml",
    ctx.configToml || "",
    "```",
    "",
    ...(ctx.packageJson ? ["### Dependencies (package.json)", "```json", ctx.packageJson, "```", ""] : []),
    ...(ctx.oldestReadyIssue
      ? [`### Oldest Ready Issue`, `#${ctx.oldestReadyIssue.number}: ${ctx.oldestReadyIssue.title}`, ""]
      : []),
    `### Issue Limits`,
    `Feature development WIP limit: ${ctx.featureIssuesWipLimit}`,
    `Maintenance WIP limit: ${ctx.maintenanceIssuesWipLimit}`,
    `Open issues: ${ctx.issuesSummary.length} (capacity for ${Math.max(0, ctx.featureIssuesWipLimit - ctx.issuesSummary.length)} more)`,
    "",
    "## Available Actions",
    "Pick one or more actions. Output them in the format below.",
    "",
    "### Workflow Dispatches",
    "- `dispatch:agentic-lib-workflow | mode: dev-only | issue-number: <N>` — Pick up issue #N, generate code, open PR. Always specify the issue-number of the oldest ready issue.",
    "- `dispatch:agentic-lib-workflow | mode: maintain-only` — Refresh feature definitions and library docs",
    "- `dispatch:agentic-lib-workflow | mode: review-only` — Close resolved issues, enhance issue criteria",
    "- `dispatch:agentic-lib-workflow | mode: pr-cleanup-only` — Merge open PRs with the automerge label if checks pass",
    "- `dispatch:agentic-lib-bot` — Proactively post in discussions",
    "",
    "### GitHub API Actions",
    "- `github:create-issue | title: <text> | labels: <comma-separated>` — Create a new issue",
    "- `github:label-issue | issue-number: <N> | labels: <comma-separated>` — Add labels to an issue",
    "- `github:close-issue | issue-number: <N>` — Close an issue",
    "",
    "### Communication",
    "- `respond:discussions | message: <text> | discussion-url: <url>` — Reply via discussions bot",
    "",
    "### Schedule Control",
    "- `set-schedule:<frequency>` — Change supervisor schedule (off, weekly, daily, hourly, continuous). Use `set-schedule:weekly` when mission is substantially complete, `set-schedule:continuous` to ramp up.",
    "",
    "- `nop` — No action needed this cycle",
    "",
    "## Output Format",
    "Respond with EXACTLY this structure:",
    "```",
    "[ACTIONS]",
    "action-name | param: value | param: value",
    "[/ACTIONS]",
    "[REASONING]",
    "Why you chose these actions...",
    "[/REASONING]",
    "```",
  ].join("\n");
}

function parseActions(content) {
  const actionsMatch = content.match(/\[ACTIONS\]([\s\S]*?)\[\/ACTIONS\]/);
  if (!actionsMatch) return [];

  return actionsMatch[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const action = parts[0];
      const params = {};
      for (const part of parts.slice(1)) {
        const colonIdx = part.indexOf(":");
        if (colonIdx > 0) {
          params[part.substring(0, colonIdx).trim()] = part.substring(colonIdx + 1).trim();
        }
      }
      return { action, params };
    });
}

function parseReasoning(content) {
  const match = content.match(/\[REASONING\]([\s\S]*?)\[\/REASONING\]/);
  return match ? match[1].trim() : "";
}

async function executeDispatch(octokit, repo, actionName, params) {
  const workflowFile = actionName.replace("dispatch:", "") + ".yml";
  const inputs = {};
  if (params["pr-number"]) inputs["pr-number"] = params["pr-number"];
  if (params["issue-number"]) inputs["issue-number"] = params["issue-number"];

  // Guard: skip transform dispatch if one is already running
  if (workflowFile === "agentic-lib-workflow.yml") {
    try {
      const { data: runs } = await octokit.rest.actions.listWorkflowRuns({
        ...repo,
        workflow_id: "agentic-lib-workflow.yml",
        status: "in_progress",
        per_page: 1,
      });
      if (runs.total_count > 0) {
        core.info("Workflow already running — skipping dispatch");
        return "skipped:workflow-already-running";
      }
    } catch (err) {
      core.warning(`Could not check workflow status: ${err.message}`);
    }
  }

  core.info(`Dispatching workflow: ${workflowFile}`);
  await octokit.rest.actions.createWorkflowDispatch({ ...repo, workflow_id: workflowFile, ref: "main", inputs });
  return `dispatched:${workflowFile}`;
}

async function executeCreateIssue(octokit, repo, params) {
  const title = params.title || "Untitled issue";
  const labels = params.labels ? params.labels.split(",").map((l) => l.trim()) : ["automated"];
  core.info(`Creating issue: ${title}`);
  const { data: issue } = await octokit.rest.issues.create({ ...repo, title, labels });
  return `created-issue:#${issue.number}`;
}

async function executeLabelIssue(octokit, repo, params) {
  const issueNumber = Number(params["issue-number"]);
  const labels = params.labels ? params.labels.split(",").map((l) => l.trim()) : [];
  if (issueNumber && labels.length > 0) {
    core.info(`Labelling issue #${issueNumber}: ${labels.join(", ")}`);
    await octokit.rest.issues.addLabels({ ...repo, issue_number: issueNumber, labels });
    return `labelled-issue:#${issueNumber}`;
  }
  return "skipped:label-issue-missing-params";
}

async function executeCloseIssue(octokit, repo, params) {
  const issueNumber = Number(params["issue-number"]);
  if (issueNumber) {
    core.info(`Closing issue #${issueNumber}`);
    await octokit.rest.issues.update({ ...repo, issue_number: issueNumber, state: "closed" });
    return `closed-issue:#${issueNumber}`;
  }
  return "skipped:close-issue-missing-number";
}

async function executeRespondDiscussions(octokit, repo, params) {
  const message = params.message || "";
  const url = params["discussion-url"] || "";
  if (message) {
    core.info(`Dispatching discussions bot with response: ${message.substring(0, 100)}`);
    const inputs = { message };
    if (url) inputs["discussion-url"] = url;
    await octokit.rest.actions.createWorkflowDispatch({
      ...repo,
      workflow_id: "agentic-lib-bot.yml",
      ref: "main",
      inputs,
    });
    return `respond-discussions:${url || "no-url"}`;
  }
  return "skipped:respond-no-message";
}

const ACTION_HANDLERS = {
  "github:create-issue": executeCreateIssue,
  "github:label-issue": executeLabelIssue,
  "github:close-issue": executeCloseIssue,
  "respond:discussions": executeRespondDiscussions,
};

async function executeSetSchedule(octokit, repo, frequency) {
  const valid = ["off", "weekly", "daily", "hourly", "continuous"];
  if (!valid.includes(frequency)) {
    return `skipped:invalid-frequency:${frequency}`;
  }
  core.info(`Setting supervisor schedule to: ${frequency}`);
  await octokit.rest.actions.createWorkflowDispatch({
    ...repo,
    workflow_id: "agentic-lib-schedule.yml",
    ref: "main",
    inputs: { frequency },
  });
  return `set-schedule:${frequency}`;
}

async function executeAction(octokit, repo, action, params) {
  if (action.startsWith("dispatch:")) return executeDispatch(octokit, repo, action, params);
  if (action.startsWith("set-schedule:")) return executeSetSchedule(octokit, repo, action.replace("set-schedule:", ""));
  if (action === "nop") return "nop";
  const handler = ACTION_HANDLERS[action];
  if (handler) return handler(octokit, repo, params);
  core.warning(`Unknown action: ${action}`);
  return `unknown:${action}`;
}

/**
 * Supervisor task: gather context, ask LLM to choose actions, execute them.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function supervise(context) {
  const { octokit, repo, config, instructions, model } = context;

  const ctx = await gatherContext(octokit, repo, config);
  const agentInstructions = instructions || "You are the supervisor. Decide what actions to take.";
  const prompt = buildPrompt(ctx, agentInstructions);

  const { content, tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage:
      "You are the supervisor of an autonomous coding repository. Your job is to advance the mission by choosing which workflows to dispatch and which GitHub actions to take. Pick multiple actions when appropriate. Be strategic — consider what's already in progress, what's blocked, and what will make the most impact.",
    prompt,
    writablePaths: [],
  });

  const actions = parseActions(content);
  const reasoning = parseReasoning(content);

  core.info(`Supervisor reasoning: ${reasoning.substring(0, 200)}`);
  core.info(`Supervisor chose ${actions.length} action(s)`);

  const results = [];
  for (const { action, params } of actions) {
    try {
      const result = await executeAction(octokit, repo, action, params);
      results.push(result);
      core.info(`Action result: ${result}`);
    } catch (err) {
      core.warning(`Action ${action} failed: ${err.message}`);
      results.push(`error:${action}:${err.message}`);
    }
  }

  return {
    outcome: actions.length === 0 ? "nop" : `supervised:${actions.length}-actions`,
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Actions: ${results.join(", ")}\nReasoning: ${reasoning.substring(0, 300)}`,
  };
}
