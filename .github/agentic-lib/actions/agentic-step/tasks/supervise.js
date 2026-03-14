// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/supervise.js — Supervisor orchestration via LLM
//
// Uses runCopilotSession with lean prompts: the model explores issues, PRs,
// and repository state via tools, then reports its chosen actions via a
// report_supervisor_plan tool whose handler executes them.

import * as core from "@actions/core";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { readOptionalFile, scanDirectory, filterIssues, extractNarrative, NARRATIVE_INSTRUCTION } from "../copilot.js";
import { runCopilotSession } from "../../../copilot/copilot-session.js";
import { createGitHubTools, createDiscussionTools, createGitTools } from "../../../copilot/github-tools.js";

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
  // Read recent activity from agent-log files
  let recentActivity = "";
  let cumulativeTransformationCost = 0;
  try {
    const { readdirSync } = await import("fs");
    const logFiles = readdirSync(".").filter(f => f.startsWith("agent-log-") && f.endsWith(".md")).sort();
    const recent = logFiles.slice(-5);
    recentActivity = recent.map(f => readOptionalFile(f)).join("\n---\n").split("\n").slice(-40).join("\n");
    for (const f of logFiles) {
      const content = readOptionalFile(f);
      const costMatches = content.matchAll(/\*\*agentic-lib transformation cost:\*\* (\d+)/g);
      cumulativeTransformationCost += [...costMatches].reduce((sum, m) => sum + parseInt(m[1], 10), 0);
    }
  } catch { /* no agent-log files yet */ }

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
        // Check for automerge closure (issue has "merged" label — set by ci-automerge)
        if (closeReason !== "RESOLVED") {
          const issueLabels = ci.labels.map((l) => (typeof l === "string" ? l : l.name));
          if (issueLabels.includes("merged")) {
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

  // Count dedicated test files (not just seed tests)
  // A dedicated test imports from the source directory (src/lib/) rather than being a seed test
  let dedicatedTestCount = 0;
  let dedicatedTestFiles = [];
  try {
    const testDirs = ["tests", "__tests__"];
    for (const dir of testDirs) {
      if (existsSync(dir)) {
        const testFiles = scanDirectory(dir, [".js", ".ts", ".mjs"], { limit: 20 });
        for (const tf of testFiles) {
          // Skip seed test files (main.test.js, web.test.js, behaviour.test.js)
          if (/^(main|web|behaviour)\.test\.[jt]s$/.test(tf.name)) continue;
          const content = readFileSync(tf.path, "utf8");
          // Check if it imports from src/lib/ (mission-specific code)
          if (/from\s+['"].*src\/lib\//.test(content) || /require\s*\(\s*['"].*src\/lib\//.test(content)) {
            dedicatedTestCount++;
            dedicatedTestFiles.push(tf.name);
          }
        }
      }
    }
  } catch { /* ignore */ }

  // W9: Count TODO comments in source directory
  let sourceTodoCount = 0;
  try {
    const sourcePath = config.paths.source?.path || "src/lib/";
    const sourceDir = sourcePath.endsWith("/") ? sourcePath.slice(0, -1) : sourcePath;
    const srcRoot = sourceDir.includes("/") ? sourceDir.split("/").slice(0, -1).join("/") || "src" : "src";
    // Inline recursive TODO counter (avoids circular import with index.js)
    const countTodos = (dir) => {
      let n = 0;
      if (!existsSync(dir)) return 0;
      try {
        const entries = readdirSync(dir);
        for (const entry of entries) {
          if (entry === "node_modules" || entry.startsWith(".")) continue;
          const fp = `${dir}/${entry}`;
          try {
            const stat = statSync(fp);
            if (stat.isDirectory()) {
              n += countTodos(fp);
            } else if (/\.(js|ts|mjs)$/.test(entry)) {
              const content = readFileSync(fp, "utf8");
              const m = content.match(/\bTODO\b/gi);
              if (m) n += m.length;
            }
          } catch { /* skip */ }
        }
      } catch { /* skip */ }
      return n;
    };
    sourceTodoCount = countTodos(srcRoot);
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
    dedicatedTestCount,
    dedicatedTestFiles,
    sourceTodoCount,
  };
}

function buildPrompt(ctx, agentInstructions, config) {
  // Build mission-complete metrics inline for the LLM
  const thresholds = config?.missionCompleteThresholds || {};
  const minResolved = thresholds.minResolvedIssues ?? 3;
  const minTests = thresholds.minDedicatedTests ?? 1;
  const maxTodos = thresholds.maxSourceTodos ?? 0;
  const resolvedCount = ctx.recentlyClosedSummary.filter((s) => s.includes("RESOLVED")).length;

  return [
    "## Instructions",
    agentInstructions,
    "",
    "## Mission",
    ctx.mission || "(no mission defined)",
    "",
    "## Repository Summary",
    `Open issues: ${ctx.issuesSummary.length}`,
    ctx.issuesSummary.join("\n") || "(none)",
    "",
    `Recently closed issues: ${ctx.recentlyClosedSummary.length}`,
    ctx.recentlyClosedSummary.join("\n") || "(none)",
    "",
    `Open PRs: ${ctx.prsSummary.length}`,
    ctx.prsSummary.join("\n") || "(none)",
    "",
    `Features: ${ctx.featureNames.length}/${ctx.featuresLimit}`,
    `Library docs: ${ctx.libraryNames.length}/${ctx.libraryLimit}`,
    `Dedicated test files: ${ctx.dedicatedTestCount}`,
    `Source TODOs: ${ctx.sourceTodoCount}`,
    "",
    `### Mission-Complete Metrics`,
    "| Metric | Value | Target | Status |",
    "|--------|-------|--------|--------|",
    `| Open issues | ${ctx.issuesSummary.length} | 0 | ${ctx.issuesSummary.length === 0 ? "MET" : "NOT MET"} |`,
    `| Open PRs | ${ctx.prsSummary.length} | 0 | ${ctx.prsSummary.length === 0 ? "MET" : "NOT MET"} |`,
    `| Issues resolved (RESOLVED) | ${resolvedCount} | >= ${minResolved} | ${resolvedCount >= minResolved ? "MET" : "NOT MET"} |`,
    `| Dedicated test files | ${ctx.dedicatedTestCount} | >= ${minTests} | ${ctx.dedicatedTestCount >= minTests ? "MET" : "NOT MET"} |`,
    `| Source TODO count | ${ctx.sourceTodoCount} | <= ${maxTodos} | ${ctx.sourceTodoCount <= maxTodos ? "MET" : "NOT MET"} |`,
    `| Budget used | ${ctx.cumulativeTransformationCost}/${ctx.transformationBudget} | < ${ctx.transformationBudget || "unlimited"} | ${ctx.transformationBudget > 0 && ctx.cumulativeTransformationCost >= ctx.transformationBudget ? "EXHAUSTED" : "OK"} |`,
    "",
    `### Supervisor: ${ctx.supervisor}`,
    ...(ctx.activeDiscussionUrl ? [`### Active Discussion`, `${ctx.activeDiscussionUrl}`, ""] : []),
    ...(ctx.oldestReadyIssue
      ? [`### Oldest Ready Issue`, `#${ctx.oldestReadyIssue.number}: ${ctx.oldestReadyIssue.title}`, ""]
      : []),
    ...(ctx.missionComplete
      ? [
          `### Mission Status: COMPLETE`,
          "Transformation budget is frozen — no transform, maintain, or fix-code dispatches allowed.",
          "",
        ]
      : []),
    ...(ctx.missionFailed
      ? [
          `### Mission Status: FAILED`,
          "The mission has been declared failed. The schedule should be set to off.",
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
    `### Recent Activity`,
    ctx.recentActivity || "none",
    "",
    ...(process.env.REVIEW_ADVICE ? [
      "### Implementation Review",
      `**Completeness:** ${process.env.REVIEW_ADVICE}`,
      ...((() => {
        try {
          const gaps = JSON.parse(process.env.REVIEW_GAPS || "[]");
          if (gaps.length > 0) {
            return [
              "",
              "**Gaps Found:**",
              ...gaps.map((g) => `- [${g.severity}] ${g.element}: ${g.description} (${g.gapType})`),
              "",
              "Consider creating issues with label 'implementation-gap' for critical gaps.",
            ];
          }
        } catch { /* ignore */ }
        return [];
      })()),
      "",
    ] : []),
    "## Your Task",
    "Use list_issues, list_prs, read_file, and search_discussions to explore the repository state.",
    "Then call report_supervisor_plan with your chosen actions and reasoning.",
    "",
    "**You MUST call report_supervisor_plan exactly once.**",
  ].join("\n");
}

// Legacy text parsers — kept as fallback if the model doesn't call report_supervisor_plan
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
  // Derive title: use params.title, fall back to first line of body, fall back to feature name
  let title = (params.title || "").trim();
  const bodyText = (params.body || params.details || "").trim();
  const feature = (params.feature || "").trim();

  if (!title && bodyText) {
    // Extract title from body: use first heading or first non-empty line
    const headingMatch = bodyText.match(/^#+ (.+)/m);
    const titleMatch = bodyText.match(/^Title:\s*(.+)/im);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else if (headingMatch) {
      title = headingMatch[1].trim();
    } else {
      // Use first line, truncated
      title = bodyText.split("\n")[0].substring(0, 120).trim();
    }
  }
  if (!title && feature) {
    title = `feat: implement ${feature}`;
  }
  if (!title) {
    core.warning("create-issue: no title, body, or feature provided — skipping");
    return "skipped:no-title";
  }

  const rawLabels = params.labels;
  const labels = Array.isArray(rawLabels)
    ? rawLabels.map((l) => String(l).trim()).filter(Boolean)
    : typeof rawLabels === "string"
      ? rawLabels.split(",").map((l) => l.trim()).filter(Boolean)
      : ["automated"];
  if (!labels.includes("automated")) labels.push("automated");

  // Build rich issue body with context
  const bodyParts = [];
  if (bodyText) {
    bodyParts.push(bodyText);
  }
  if (feature) {
    bodyParts.push("");
    bodyParts.push(`## Related Feature`);
    bodyParts.push(`Feature spec: \`features/${feature}.md\``);
  }
  // Add mission context from MISSION.md
  const missionText = ctx?.mission || "";
  if (missionText) {
    const missionHeading = missionText.match(/^#\s+(.+)/m);
    const missionName = missionHeading ? missionHeading[1].trim() : "MISSION.md";
    bodyParts.push("");
    bodyParts.push(`## Context`);
    bodyParts.push(`Mission: ${missionName}`);
    bodyParts.push(`Created by: agentic-step supervisor`);
  }
  const body = bodyParts.join("\n");

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
  const { data: issue } = await octokit.rest.issues.create({ ...repo, title, body, labels });
  return `created-issue:#${issue.number}`;
}

async function executeLabelIssue(octokit, repo, params) {
  const issueNumber = Number(params["issue-number"]);
  const rawLabels = params.labels;
  const labels = Array.isArray(rawLabels)
    ? rawLabels.map((l) => String(l).trim()).filter(Boolean)
    : typeof rawLabels === "string"
      ? rawLabels.split(",").map((l) => l.trim()).filter(Boolean)
      : [];
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
  core.debug(`Ignoring unrecognised action: ${action}`);
  return `unknown:${action}`;
}

/**
 * Supervisor task: gather context, ask LLM to choose actions, execute them.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function supervise(context) {
  const { octokit, repo, config, instructions, model, logFilePath, screenshotFilePath } = context;
  const t = config.tuning || {};

  const ctx = await gatherContext(octokit, repo, config, t);
  const websiteUrl = getWebsiteUrl(repo);

  // --- Deterministic lifecycle posts (before LLM) ---

  // Step 2: Auto-announce on first run after init
  if (ctx.initTimestamp && !ctx.missionComplete && !ctx.missionFailed) {
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

  // --- LLM decision via hybrid session ---
  const agentInstructions = instructions || "You are the supervisor. Decide what actions to take.";
  const prompt = buildPrompt(ctx, agentInstructions, config);

  const systemPrompt =
    "You are the supervisor of an autonomous coding repository. Your job is to advance the mission by choosing which workflows to dispatch and which GitHub actions to take. Pick multiple actions when appropriate. Be strategic — consider what's already in progress, what's blocked, and what will make the most impact." +
    NARRATIVE_INSTRUCTION;

  // Shared mutable state to capture the plan
  const planResult = { actions: [], reasoning: "" };

  const createTools = (defineTool, _wp, logger) => {
    const ghTools = createGitHubTools(octokit, repo, defineTool, logger);
    const discTools = createDiscussionTools(octokit, repo, defineTool, logger);
    const gitTools = createGitTools(defineTool, logger);

    const reportPlan = defineTool("report_supervisor_plan", {
      description: "Report the supervisor's chosen actions and reasoning. Call this exactly once. Actions will be executed automatically.",
      parameters: {
        type: "object",
        properties: {
          actions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                action: { type: "string", description: "Action name (e.g. dispatch:agentic-lib-workflow, github:create-issue, set-schedule:weekly, nop)" },
                params: { type: "object", description: "Action parameters (e.g. mode, issue-number, title, labels, message, discussion-url, frequency)" },
              },
              required: ["action"],
            },
            description: "List of actions to execute",
          },
          reasoning: { type: "string", description: "Why you chose these actions" },
        },
        required: ["actions", "reasoning"],
      },
      handler: async ({ actions, reasoning }) => {
        planResult.reasoning = reasoning || "";

        // Execute each action using existing handlers
        const results = [];
        for (const { action, params } of (actions || [])) {
          try {
            const result = await executeAction(octokit, repo, action, params || {}, ctx);
            results.push(result);
            logger.info(`Action result: ${result}`);
          } catch (err) {
            logger.warning(`Action ${action} failed: ${err.message}`);
            results.push(`error:${action}:${err.message}`);
          }
        }

        planResult.actions = actions || [];
        planResult.results = results;
        return { textResultForLlm: `Executed ${results.length} action(s): ${results.join(", ")}` };
      },
    });

    return [...ghTools, ...discTools, ...gitTools, reportPlan];
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
    excludedTools: ["write_file", "run_command", "run_tests"],
    logger: { info: core.info, warning: core.warning, error: core.error, debug: core.debug },
  });

  const tokensUsed = result.tokensIn + result.tokensOut;

  // Extract actions — prefer tool result, fall back to text parsing
  let actions = planResult.actions;
  let reasoning = planResult.reasoning;
  let results = planResult.results || [];

  if (actions.length === 0 && result.agentMessage) {
    actions = parseActions(result.agentMessage);
    reasoning = parseReasoning(result.agentMessage);

    // Execute fallback-parsed actions
    for (const { action, params } of actions) {
      try {
        const r = await executeAction(octokit, repo, action, params, ctx);
        results.push(r);
        core.info(`Action result: ${r}`);
      } catch (err) {
        core.warning(`Action ${action} failed: ${err.message}`);
        results.push(`error:${action}:${err.message}`);
      }
    }
  }

  core.info(`Supervisor reasoning: ${reasoning.substring(0, 200)}`);
  core.info(`Supervisor chose ${actions.length} action(s)`);

  // --- Deterministic lifecycle posts (after LLM) ---

  // Step 3: Auto-respond when a message referral is present
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
    .filter((r) => r.startsWith("created-issue:"))
    .map((r) => ({ action: "created-issue", file: r.replace("created-issue:", ""), sizeInfo: "" }));

  return {
    outcome: actions.length === 0 ? "nop" : `supervised:${actions.length}-actions`,
    tokensUsed,
    inputTokens: result.tokensIn,
    outputTokens: result.tokensOut,
    cost: 0,
    model,
    details: `Actions: ${results.join(", ")}\nReasoning: ${reasoning.substring(0, 300)}`,
    narrative: result.narrative || reasoning.substring(0, 500),
    changes,
  };
}
