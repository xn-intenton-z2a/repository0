// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/supervise.js — Supervisor orchestration via LLM
//
// Gathers repository context (issues, PRs, workflows, features, library, activity),
// asks the Copilot SDK to choose multiple concurrent actions, then dispatches them.

import * as core from "@actions/core";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { runCopilotTask, readOptionalFile, scanDirectory, filterIssues } from "../copilot.js";

/**
 * Look up the "Talk to the repository" discussion URL via GraphQL.
 * Returns { url, nodeId } or { url: "", nodeId: "" } on failure.
 */
async function findTalkDiscussion(octokit, repo) {
  try {
    const query = `query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        discussions(first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
          nodes {
            id
            number
            title
            url
          }
        }
      }
    }`;
    const result = await octokit.graphql(query, { owner: repo.owner, name: repo.repo });
    const disc = result.repository.discussions.nodes.find(
      (d) => d.title.toLowerCase().includes("talk to the repository"),
    );
    if (disc) {
      return { url: disc.url, nodeId: disc.id };
    }
  } catch (err) {
    core.warning(`Could not look up Talk discussion: ${err.message}`);
  }
  return { url: "", nodeId: "" };
}

/**
 * Construct the GitHub Pages website URL for a repository.
 */
function getWebsiteUrl(repo) {
  return `https://${repo.owner}.github.io/${repo.repo}/`;
}

/**
 * Dispatch the discussions bot with a message and discussion URL.
 */
async function dispatchBot(octokit, repo, message, discussionUrl) {
  if (process.env.GITHUB_REPOSITORY === "xn-intenton-z2a/agentic-lib") {
    core.info("Skipping bot dispatch — running in SDK repo");
    return;
  }
  const inputs = {};
  if (message) inputs.message = message;
  if (discussionUrl) inputs["discussion-url"] = discussionUrl;
  try {
    await octokit.rest.actions.createWorkflowDispatch({
      ...repo,
      workflow_id: "agentic-lib-bot.yml",
      ref: "main",
      inputs,
    });
    core.info(`Dispatched bot: ${(message || discussionUrl || "(default)").substring(0, 100)}`);
  } catch (err) {
    core.warning(`Could not dispatch bot: ${err.message}`);
  }
}

/**
 * Post a comment directly to a discussion via GraphQL.
 * Used for supervisor-originated messages to avoid triggering the bot workflow
 * (which could loop back via request-supervisor).
 */
async function postDirectReply(octokit, repo, nodeId, body) {
  if (process.env.GITHUB_REPOSITORY === "xn-intenton-z2a/agentic-lib") {
    core.info("Skipping direct reply — running in SDK repo");
    return;
  }
  if (!nodeId || !body) {
    core.warning(`Cannot post direct reply: ${!nodeId ? "no nodeId" : "no body"}`);
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
      body,
    });
    core.info(`Posted direct reply: ${addDiscussionComment.comment.url}`);
  } catch (err) {
    core.warning(`Could not post direct reply: ${err.message}`);
  }
}

async function gatherContext(octokit, repo, config, t) {
  const mission = readOptionalFile(config.paths.mission.path);
  const intentionLogFull = readOptionalFile(config.intentionBot.intentionFilepath);
  const recentActivity = intentionLogFull.split("\n").slice(-20).join("\n");

  // Read cumulative transformation cost from the activity log
  const costMatches = intentionLogFull.matchAll(/\*\*agentic-lib transformation cost:\*\* (\d+)/g);
  const cumulativeTransformationCost = [...costMatches].reduce((sum, m) => sum + parseInt(m[1], 10), 0);

  // Check mission-complete signal
  const missionComplete = existsSync("MISSION_COMPLETE.md");
  let missionCompleteInfo = "";
  if (missionComplete) {
    missionCompleteInfo = readFileSync("MISSION_COMPLETE.md", "utf8").substring(0, 500);
  }

  // Check mission-failed signal
  const missionFailed = existsSync("MISSION_FAILED.md");
  let missionFailedInfo = "";
  if (missionFailed) {
    missionFailedInfo = readFileSync("MISSION_FAILED.md", "utf8").substring(0, 500);
  }

  // Check transformation budget
  const transformationBudget = config.transformationBudget || 0;

  // Extract discussion URL from recent activity for supervisor reporting
  const discussionUrlMatch = recentActivity.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/discussions\/\d+/);
  let activeDiscussionUrl = discussionUrlMatch ? discussionUrlMatch[0] : "";
  let activeDiscussionNodeId = "";

  // Fallback: look up the "Talk to the repository" discussion if not found in activity log
  if (!activeDiscussionUrl) {
    const talk = await findTalkDiscussion(octokit, repo);
    activeDiscussionUrl = talk.url;
    activeDiscussionNodeId = talk.nodeId;
  }

  // Resolve node ID from URL if we got the URL from activity log
  if (activeDiscussionUrl && !activeDiscussionNodeId) {
    const talk = await findTalkDiscussion(octokit, repo);
    if (talk.url === activeDiscussionUrl) {
      activeDiscussionNodeId = talk.nodeId;
    }
  }

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

  // Read init timestamp for epoch boundary (used by issue filtering below)
  const initTimestamp = config.init?.timestamp || null;

  const { data: openIssues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "open",
    per_page: t.issuesScan || 20,
    sort: "created",
    direction: "asc",
  });
  const issuesOnly = openIssues.filter((i) => !i.pull_request);
  const filteredIssues = filterIssues(issuesOnly, { staleDays: t.staleDays || 30, initTimestamp });
  const oldestReadyIssue = filteredIssues.find((i) => i.labels.some((l) => l.name === "ready"));
  const issuesSummary = filteredIssues.map((i) => {
    const age = Math.floor((Date.now() - new Date(i.created_at).getTime()) / 86400000);
    const labels = i.labels.map((l) => l.name).join(", ");
    return `#${i.number}: ${i.title} [${labels || "no labels"}] (${age}d old)`;
  });

  // Fetch recently-closed issues for mission-complete detection and dedup
  let recentlyClosedSummary = [];
  try {
    const { data: closedIssuesRaw } = await octokit.rest.issues.listForRepo({
      ...repo,
      state: "closed",
      labels: "automated",
      per_page: 10,
      sort: "updated",
      direction: "desc",
    });
    const initEpoch = initTimestamp ? new Date(initTimestamp).getTime() : 0;
    const closedIssuesFiltered = closedIssuesRaw.filter((i) =>
      !i.pull_request && (initEpoch <= 0 || new Date(i.created_at).getTime() >= initEpoch)
    );
    for (const ci of closedIssuesFiltered) {
      let closeReason = "closed";
      try {
        // Check for review-closed (Automated Review Result comment)
        const { data: comments } = await octokit.rest.issues.listComments({
          ...repo,
          issue_number: ci.number,
          per_page: 5,
          sort: "created",
          direction: "desc",
        });
        if (comments.some((c) => c.body?.includes("Automated Review Result"))) {
          closeReason = "RESOLVED";
        } else {
          // Check for PR-linked closure (GitHub auto-closes via "Closes #N")
          const { data: events } = await octokit.rest.issues.listEvents({
            ...repo,
            issue_number: ci.number,
            per_page: 10,
          });
          const closedByPR = events.some((e) => e.event === "closed" && e.commit_id);
          if (closedByPR) {
            closeReason = "RESOLVED";
          }
        }
      } catch (_) { /* ignore */ }
      recentlyClosedSummary.push(`#${ci.number}: ${ci.title} — ${closeReason}`);
    }
  } catch (err) {
    core.warning(`Could not fetch recently closed issues: ${err.message}`);
  }

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
  let actionsSinceInit = [];
  try {
    const { data: runs } = await octokit.rest.actions.listWorkflowRunsForRepo({
      ...repo,
      per_page: 20,
    });
    workflowsSummary = runs.workflow_runs.map((r) => `${r.name}: ${r.conclusion || r.status} (${r.created_at})`);

    // Build detailed actions-since-init with commit context
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
        branch: run.head_branch || "",
      };

      // For transform branches, try to get PR change stats
      if (run.head_branch?.startsWith("agentic-lib-issue-")) {
        try {
          const { data: prs } = await octokit.rest.pulls.list({
            ...repo,
            head: `${repo.owner}:${run.head_branch}`,
            state: "all",
            per_page: 1,
          });
          if (prs.length > 0) {
            entry.prNumber = prs[0].number;
            entry.prTitle = prs[0].title;
            entry.additions = prs[0].additions;
            entry.deletions = prs[0].deletions;
            entry.changedFiles = prs[0].changed_files;
          }
        } catch { /* ignore */ }
      }
      actionsSinceInit.push(entry);
    }
  } catch (err) {
    core.warning(`Could not fetch workflow runs: ${err.message}`);
  }

  // Scan source files for exported function/const names (Strategy E: source summary for supervisor)
  let sourceExports = [];
  try {
    const sourcePath = config.paths.source?.path || "src/lib/";
    if (existsSync(sourcePath)) {
      const sourceFiles = scanDirectory(sourcePath, [".js", ".ts"], { limit: 5 });
      for (const sf of sourceFiles) {
        const content = readFileSync(sf.path, "utf8");
        const exports = [...content.matchAll(/export\s+(?:async\s+)?(?:function|const|let|var|class)\s+(\w+)/g)]
          .map((m) => m[1]);
        if (exports.length > 0) {
          sourceExports.push(`${sf.name}: ${exports.join(", ")}`);
        }
      }
    }
  } catch { /* ignore */ }

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
    actionsSinceInit,
    initTimestamp,
    supervisor: config.supervisor,
    configToml: config.configToml,
    packageJson: config.packageJson,
    featureIssuesWipLimit: config.featureDevelopmentIssuesWipLimit,
    maintenanceIssuesWipLimit: config.maintenanceIssuesWipLimit,
    activeDiscussionUrl,
    activeDiscussionNodeId,
    missionComplete,
    missionCompleteInfo,
    missionFailed,
    missionFailedInfo,
    transformationBudget,
    cumulativeTransformationCost,
    recentlyClosedSummary,
    sourceExports,
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
    `### Recently Closed Issues (${ctx.recentlyClosedSummary.length})`,
    ctx.recentlyClosedSummary.join("\n") || "none",
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
    ...(ctx.sourceExports?.length > 0
      ? [
          `### Source Exports`,
          "Functions and constants exported from source files:",
          ...ctx.sourceExports.map((e) => `- ${e}`),
          "",
        ]
      : []),
    `### Recent Workflow Runs`,
    ctx.workflowsSummary.join("\n") || "none",
    "",
    ...(ctx.actionsSinceInit.length > 0
      ? [
          `### Actions Since Last Init${ctx.initTimestamp ? ` (${ctx.initTimestamp})` : ""}`,
          "Each entry: workflow | outcome | commit | branch | changes",
          ...ctx.actionsSinceInit.map((a) => {
            let line = `- ${a.name}: ${a.conclusion} (${a.created}) [${a.commitSha}] ${a.commitMessage}`;
            if (a.prNumber) {
              line += ` — PR #${a.prNumber}: +${a.additions}/-${a.deletions} in ${a.changedFiles} file(s)`;
            }
            return line;
          }),
          "",
        ]
      : []),
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
    ...(ctx.activeDiscussionUrl ? [`### Active Discussion`, `${ctx.activeDiscussionUrl}`, ""] : []),
    ...(ctx.oldestReadyIssue
      ? [`### Oldest Ready Issue`, `#${ctx.oldestReadyIssue.number}: ${ctx.oldestReadyIssue.title}`, ""]
      : []),
    ...(ctx.missionComplete
      ? [
          `### Mission Status: COMPLETE`,
          ctx.missionCompleteInfo,
          "Transformation budget is frozen — no transform, maintain, or fix-code dispatches allowed.",
          "You may still: review/close issues, respond to discussions, adjust schedule.",
          "",
        ]
      : []),
    ...(ctx.missionFailed
      ? [
          `### Mission Status: FAILED`,
          ctx.missionFailedInfo,
          "The mission has been declared failed. The schedule should be set to off.",
          "You may still: review/close issues, respond to discussions.",
          "",
        ]
      : []),
    ...(ctx.transformationBudget > 0
      ? [`### Transformation Budget: ${ctx.cumulativeTransformationCost}/${ctx.transformationBudget} used (${Math.max(0, ctx.transformationBudget - ctx.cumulativeTransformationCost)} remaining)`, ""]
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
    "### Mission Lifecycle",
    "- `mission-complete | reason: <text>` — Declare mission accomplished. Writes MISSION_COMPLETE.md and sets schedule to off. Use when: all acceptance criteria in MISSION.md are satisfied, tests pass, and recently-closed issues confirm resolution.",
    "- `mission-failed | reason: <text>` — Declare mission failed. Writes MISSION_FAILED.md and sets schedule to off. Use when: transformation budget is exhausted with no progress, pipeline is stuck in a loop, or the mission is unachievable.",
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

async function executeDispatch(octokit, repo, actionName, params, ctx) {
  const workflowFile = actionName.replace("dispatch:", "") + ".yml";
  const inputs = {};
  if (params["pr-number"]) inputs["pr-number"] = params["pr-number"];
  if (params["issue-number"]) inputs["issue-number"] = params["issue-number"];

  // Pass discussion-url when dispatching the bot
  if (workflowFile === "agentic-lib-bot.yml" && ctx?.activeDiscussionUrl) {
    if (!inputs["discussion-url"]) inputs["discussion-url"] = ctx.activeDiscussionUrl;
  }

  // Guard: never dispatch workflows from the SDK repo itself (agentic-lib)
  if (process.env.GITHUB_REPOSITORY === "xn-intenton-z2a/agentic-lib") {
    core.info(`Skipping dispatch of ${workflowFile} — running in SDK repo`);
    return `skipped:sdk-repo:${workflowFile}`;
  }

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

async function executeCreateIssue(octokit, repo, params, ctx) {
  const title = params.title || "Untitled issue";
  const labels = params.labels ? params.labels.split(",").map((l) => l.trim()) : ["automated"];

  // Dedup guard: skip if a similarly-titled issue was closed in the last hour
  // Exclude issues closed before the init timestamp (cross-scenario protection)
  try {
    const { data: recent } = await octokit.rest.issues.listForRepo({
      ...repo,
      state: "closed",
      sort: "updated",
      direction: "desc",
      per_page: 5,
    });
    const initTimestamp = ctx?.initTimestamp;
    const titlePrefix = title.toLowerCase().substring(0, 30);
    const duplicate = recent.find(
      (i) =>
        !i.pull_request &&
        i.title.toLowerCase().includes(titlePrefix) &&
        Date.now() - new Date(i.closed_at).getTime() < 3600000 &&
        (!initTimestamp || new Date(i.closed_at) > new Date(initTimestamp)),
    );
    if (duplicate) {
      core.info(`Skipping duplicate issue (similar to recently closed #${duplicate.number})`);
      return `skipped:duplicate-of-#${duplicate.number}`;
    }
  } catch (err) {
    core.warning(`Dedup check failed: ${err.message}`);
  }

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

async function executeRespondDiscussions(octokit, repo, params, ctx) {
  const message = params.message || "";
  const url = params["discussion-url"] || ctx?.activeDiscussionUrl || "";
  if (message || url) {
    if (process.env.GITHUB_REPOSITORY === "xn-intenton-z2a/agentic-lib") {
      core.info("Skipping bot dispatch — running in SDK repo");
      return `skipped:sdk-repo:respond-discussions`;
    }
    core.info(`Dispatching discussions bot: ${(message || url).substring(0, 100)}`);
    await dispatchBot(octokit, repo, message, url);
    return `respond-discussions:${url || "no-url"}`;
  }
  return "skipped:respond-no-message";
}

async function executeMissionComplete(octokit, repo, params, ctx) {
  const reason = params.reason || "All acceptance criteria satisfied";
  const signal = [
    "# Mission Complete",
    "",
    `- **Timestamp:** ${new Date().toISOString()}`,
    `- **Detected by:** supervisor`,
    `- **Reason:** ${reason}`,
    "",
    "This file was created automatically. To restart transformations, delete this file or run `npx @xn-intenton-z2a/agentic-lib init --reseed`.",
  ].join("\n");
  writeFileSync("MISSION_COMPLETE.md", signal);
  core.info(`Mission complete signal written: ${reason}`);

  // Persist MISSION_COMPLETE.md to the repository via Contents API so it survives across runs
  try {
    const contentBase64 = Buffer.from(signal).toString("base64");
    // Check if file already exists (to get its SHA for updates)
    let existingSha;
    try {
      const { data } = await octokit.rest.repos.getContent({ ...repo, path: "MISSION_COMPLETE.md", ref: "main" });
      existingSha = data.sha;
    } catch {
      // File doesn't exist yet — that's fine
    }
    await octokit.rest.repos.createOrUpdateFileContents({
      ...repo,
      path: "MISSION_COMPLETE.md",
      message: "mission-complete: " + reason.substring(0, 72),
      content: contentBase64,
      branch: "main",
      ...(existingSha ? { sha: existingSha } : {}),
    });
    core.info("MISSION_COMPLETE.md committed to main via Contents API");
  } catch (err) {
    core.warning(`Could not commit MISSION_COMPLETE.md to repo: ${err.message}`);
  }

  if (process.env.GITHUB_REPOSITORY !== "xn-intenton-z2a/agentic-lib") {
    try {
      await octokit.rest.actions.createWorkflowDispatch({
        ...repo,
        workflow_id: "agentic-lib-schedule.yml",
        ref: "main",
        inputs: { frequency: "off" },
      });
    } catch (err) {
      core.warning(`Could not set schedule to off: ${err.message}`);
    }

    // Announce mission complete via bot
    const websiteUrl = getWebsiteUrl(repo);
    const discussionUrl = ctx?.activeDiscussionUrl || "";
    await dispatchBot(octokit, repo, `Mission complete! ${reason}\n\nWebsite: ${websiteUrl}`, discussionUrl);
  }
  return `mission-complete:${reason.substring(0, 100)}`;
}

async function executeMissionFailed(octokit, repo, params, ctx) {
  const reason = params.reason || "Mission could not be completed";
  const signal = [
    "# Mission Failed",
    "",
    `- **Timestamp:** ${new Date().toISOString()}`,
    `- **Detected by:** supervisor`,
    `- **Reason:** ${reason}`,
    "",
    "This file was created automatically. To restart, delete this file and run `npx @xn-intenton-z2a/agentic-lib init --reseed`.",
  ].join("\n");
  writeFileSync("MISSION_FAILED.md", signal);
  core.info(`Mission failed signal written: ${reason}`);

  // Persist MISSION_FAILED.md to the repository via Contents API so it survives across runs
  try {
    const contentBase64 = Buffer.from(signal).toString("base64");
    let existingSha;
    try {
      const { data } = await octokit.rest.repos.getContent({ ...repo, path: "MISSION_FAILED.md", ref: "main" });
      existingSha = data.sha;
    } catch {
      // File doesn't exist yet — that's fine
    }
    await octokit.rest.repos.createOrUpdateFileContents({
      ...repo,
      path: "MISSION_FAILED.md",
      message: "mission-failed: " + reason.substring(0, 72),
      content: contentBase64,
      branch: "main",
      ...(existingSha ? { sha: existingSha } : {}),
    });
    core.info("MISSION_FAILED.md committed to main via Contents API");
  } catch (err) {
    core.warning(`Could not commit MISSION_FAILED.md to repo: ${err.message}`);
  }

  if (process.env.GITHUB_REPOSITORY !== "xn-intenton-z2a/agentic-lib") {
    try {
      await octokit.rest.actions.createWorkflowDispatch({
        ...repo,
        workflow_id: "agentic-lib-schedule.yml",
        ref: "main",
        inputs: { frequency: "off" },
      });
    } catch (err) {
      core.warning(`Could not set schedule to off: ${err.message}`);
    }

    // Announce mission failed via bot
    const websiteUrl = getWebsiteUrl(repo);
    const discussionUrl = ctx?.activeDiscussionUrl || "";
    await dispatchBot(octokit, repo, `Mission failed. ${reason}\n\nWebsite: ${websiteUrl}`, discussionUrl);
  }
  return `mission-failed:${reason.substring(0, 100)}`;
}

const ACTION_HANDLERS = {
  "github:create-issue": executeCreateIssue,
  "github:label-issue": executeLabelIssue,
  "github:close-issue": executeCloseIssue,
  "respond:discussions": executeRespondDiscussions,
  "mission-complete": executeMissionComplete,
  "mission-failed": executeMissionFailed,
};

async function executeSetSchedule(octokit, repo, frequency) {
  const valid = ["off", "weekly", "daily", "hourly", "continuous"];
  if (!valid.includes(frequency)) {
    return `skipped:invalid-frequency:${frequency}`;
  }
  if (process.env.GITHUB_REPOSITORY === "xn-intenton-z2a/agentic-lib") {
    core.info(`Skipping schedule dispatch — running in SDK repo`);
    return `skipped:sdk-repo:set-schedule:${frequency}`;
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

async function executeAction(octokit, repo, action, params, ctx) {
  if (action.startsWith("dispatch:")) return executeDispatch(octokit, repo, action, params, ctx);
  if (action.startsWith("set-schedule:")) return executeSetSchedule(octokit, repo, action.replace("set-schedule:", ""));
  if (action === "nop") return "nop";
  const handler = ACTION_HANDLERS[action];
  if (handler) return handler(octokit, repo, params, ctx);
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
  const t = config.tuning || {};

  const ctx = await gatherContext(octokit, repo, config, t);
  const websiteUrl = getWebsiteUrl(repo);

  // --- Deterministic lifecycle posts (before LLM) ---

  // Step 2: Auto-announce on first run after init
  // Detect first supervisor run: initTimestamp exists but no prior supervisor workflow runs since init
  if (ctx.initTimestamp && !ctx.missionComplete && !ctx.missionFailed) {
    // Check for any prior agentic-lib-workflow runs since init (count > 1 because current run is included)
    const supervisorRunCount = ctx.actionsSinceInit.filter(
      (a) => a.name.startsWith("agentic-lib-workflow"),
    ).length;
    const hasPriorSupervisor = supervisorRunCount > 1 || ctx.recentActivity.includes("supervised:");
    if (!hasPriorSupervisor && ctx.mission && ctx.activeDiscussionUrl) {
      core.info("First supervisor run after init — announcing mission directly");
      const announcement = `New mission started!\n\n**Mission:** ${ctx.mission.substring(0, 300)}\n\n**Website:** ${websiteUrl}`;
      await postDirectReply(octokit, repo, ctx.activeDiscussionNodeId, announcement);
    }
  }

  // --- LLM decision ---
  const agentInstructions = instructions || "You are the supervisor. Decide what actions to take.";
  const prompt = buildPrompt(ctx, agentInstructions);

  const { content, tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage:
      "You are the supervisor of an autonomous coding repository. Your job is to advance the mission by choosing which workflows to dispatch and which GitHub actions to take. Pick multiple actions when appropriate. Be strategic — consider what's already in progress, what's blocked, and what will make the most impact.",
    prompt,
    writablePaths: [],
    tuning: t,
  });

  const actions = parseActions(content);
  const reasoning = parseReasoning(content);

  core.info(`Supervisor reasoning: ${reasoning.substring(0, 200)}`);
  core.info(`Supervisor chose ${actions.length} action(s)`);

  const results = [];
  for (const { action, params } of actions) {
    try {
      const result = await executeAction(octokit, repo, action, params, ctx);
      results.push(result);
      core.info(`Action result: ${result}`);
    } catch (err) {
      core.warning(`Action ${action} failed: ${err.message}`);
      results.push(`error:${action}:${err.message}`);
    }
  }

  // --- Deterministic lifecycle posts (after LLM) ---

  // Strategy A: Deterministic mission-complete fallback
  // If the LLM didn't choose mission-complete but conditions are clearly met, auto-execute it.
  if (!ctx.missionComplete && !ctx.missionFailed) {
    const llmChoseMissionComplete = results.some((r) => r.startsWith("mission-complete:"));
    if (!llmChoseMissionComplete) {
      const resolvedCount = ctx.recentlyClosedSummary.filter((s) => s.includes("RESOLVED")).length;
      const hasNoOpenIssues = ctx.issuesSummary.length === 0;
      const hasNoOpenPRs = ctx.prsSummary.length === 0;
      if (hasNoOpenIssues && hasNoOpenPRs && resolvedCount >= 2) {
        core.info(`Deterministic mission-complete: 0 open issues, 0 open PRs, ${resolvedCount} recently resolved — LLM did not detect completion`);
        try {
          const autoResult = await executeMissionComplete(octokit, repo,
            { reason: `All acceptance criteria satisfied (${resolvedCount} issues resolved, 0 open issues, 0 open PRs)` },
            ctx);
          results.push(autoResult);
        } catch (err) {
          core.warning(`Deterministic mission-complete failed: ${err.message}`);
        }
      }
    }
  }

  // Step 3: Auto-respond when a message referral is present
  // If the workflow was triggered with a message (from bot's request-supervisor),
  // and the LLM didn't include a respond:discussions action, post back directly.
  // Posts directly via GraphQL to avoid triggering the bot workflow (which would
  // request-supervisor again, creating an infinite loop).
  const workflowMessage = context.discussionUrl ? "" : (process.env.INPUT_MESSAGE || "");
  if (workflowMessage && ctx.activeDiscussionUrl) {
    const hasDiscussionResponse = results.some((r) => r.startsWith("respond-discussions:"));
    if (!hasDiscussionResponse) {
      core.info("Message referral detected — posting auto-response directly");
      const response = reasoning
        ? `Supervisor update: ${reasoning.substring(0, 400)}`
        : `Supervisor processed your request. Actions taken: ${results.join(", ")}`;
      await postDirectReply(octokit, repo, ctx.activeDiscussionNodeId, response);
      results.push(`auto-respond:${ctx.activeDiscussionUrl}`);
    }
  }

  // Build changes list from executed actions
  const changes = results
    .filter((r) => r.startsWith("created-issue:") || r.startsWith("mission-complete:") || r.startsWith("mission-failed:"))
    .map((r) => {
      if (r.startsWith("created-issue:")) return { action: "created-issue", file: r.replace("created-issue:", ""), sizeInfo: "" };
      if (r.startsWith("mission-complete:")) return { action: "mission-complete", file: "MISSION_COMPLETE.md", sizeInfo: r.replace("mission-complete:", "") };
      if (r.startsWith("mission-failed:")) return { action: "mission-failed", file: "MISSION_FAILED.md", sizeInfo: r.replace("mission-failed:", "") };
      return null;
    })
    .filter(Boolean);

  return {
    outcome: actions.length === 0 ? "nop" : `supervised:${actions.length}-actions`,
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    model,
    details: `Actions: ${results.join(", ")}\nReasoning: ${reasoning.substring(0, 300)}`,
    narrative: reasoning.substring(0, 500),
    changes,
  };
}
