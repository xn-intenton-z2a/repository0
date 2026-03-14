// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/github-tools.js — GitHub API + Discussion tools for SDK sessions
//
// These tools are injected into Copilot SDK sessions to give the model direct
// access to GitHub APIs (issues, PRs, discussions, workflows) and git state.
// Task handlers select which tools to inject via createTools parameter.

import { execSync } from "child_process";
import { defaultLogger } from "./logger.js";

// ── Discussion tools ────────────────────────────────────────────────

/**
 * Create discussion-related tools for the bot and supervisor.
 *
 * @param {Object} octokit - Authenticated Octokit instance
 * @param {{ owner: string, repo: string }} repo - Repository context
 * @param {Function} defineTool - SDK defineTool function
 * @param {Object} [logger]
 * @returns {Array} Array of discussion tools
 */
export function createDiscussionTools(octokit, repo, defineTool, logger = defaultLogger) {
  const fetchDiscussion = defineTool("fetch_discussion", {
    description: "Fetch a GitHub Discussion by URL or number. Returns title, body, comments, and node ID.",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string", description: "Full discussion URL (e.g. https://github.com/owner/repo/discussions/42)" },
        number: { type: "number", description: "Discussion number (alternative to URL)" },
        comments_limit: { type: "number", description: "Max comments to fetch (default 20)" },
      },
    },
    handler: async ({ url, number, comments_limit }) => {
      const limit = comments_limit || 20;
      let owner, repoName, discussionNumber;

      if (url) {
        const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/discussions\/(\d+)/);
        if (!match) return { error: `Could not parse discussion URL: ${url}` };
        [, owner, repoName, discussionNumber] = match;
        discussionNumber = parseInt(discussionNumber, 10);
      } else if (number) {
        owner = repo.owner;
        repoName = repo.repo;
        discussionNumber = number;
      } else {
        return { error: "Provide either url or number" };
      }

      try {
        const query = `query($owner: String!, $repo: String!, $num: Int!, $limit: Int!) {
          repository(owner: $owner, name: $repo) {
            discussion(number: $num) {
              id
              title
              body
              createdAt
              author { login }
              comments(last: $limit) {
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
        const result = await octokit.graphql(query, { owner, repo: repoName, num: discussionNumber, limit });
        const d = result.repository.discussion;
        logger.info(`[tool] fetch_discussion: #${discussionNumber} "${d.title}" (${d.comments.nodes.length} comments)`);
        return {
          title: d.title,
          body: d.body,
          nodeId: d.id,
          author: d.author?.login,
          createdAt: d.createdAt,
          comments: d.comments.nodes.map((c) => ({
            id: c.id,
            body: c.body,
            author: c.author?.login,
            createdAt: c.createdAt,
          })),
        };
      } catch (err) {
        return { error: `Failed to fetch discussion #${discussionNumber}: ${err.message}` };
      }
    },
  });

  const listDiscussions = defineTool("list_discussions", {
    description: "List recent GitHub Discussions for the repository. Returns title, URL, comment count, and last activity.",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max discussions to return (default 10)" },
        category: { type: "string", description: "Filter by category name (optional)" },
      },
    },
    handler: async ({ limit, category }) => {
      const n = limit || 10;
      try {
        const query = `query($owner: String!, $repo: String!, $limit: Int!) {
          repository(owner: $owner, name: $repo) {
            discussions(first: $limit, orderBy: { field: UPDATED_AT, direction: DESC }) {
              nodes {
                number
                title
                url
                createdAt
                updatedAt
                comments { totalCount }
                category { name }
                author { login }
              }
            }
          }
        }`;
        const result = await octokit.graphql(query, { owner: repo.owner, repo: repo.repo, limit: n });
        let discussions = result.repository.discussions.nodes;
        if (category) {
          discussions = discussions.filter((d) => d.category?.name?.toLowerCase() === category.toLowerCase());
        }
        logger.info(`[tool] list_discussions: ${discussions.length} discussions`);
        return {
          discussions: discussions.map((d) => ({
            number: d.number,
            title: d.title,
            url: d.url,
            author: d.author?.login,
            commentCount: d.comments.totalCount,
            category: d.category?.name,
            updatedAt: d.updatedAt,
          })),
        };
      } catch (err) {
        return { error: `Failed to list discussions: ${err.message}` };
      }
    },
  });

  const postDiscussionComment = defineTool("post_discussion_comment", {
    description: "Post a comment on a GitHub Discussion. Requires the discussion node ID (from fetch_discussion).",
    parameters: {
      type: "object",
      properties: {
        discussion_node_id: { type: "string", description: "The discussion node ID (e.g. D_kwDON6E8ZM4AgQKM)" },
        body: { type: "string", description: "The comment body (markdown)" },
      },
      required: ["discussion_node_id", "body"],
    },
    handler: async ({ discussion_node_id, body }) => {
      try {
        const mutation = `mutation($discussionId: ID!, $body: String!) {
          addDiscussionComment(input: { discussionId: $discussionId, body: $body }) {
            comment { url }
          }
        }`;
        const result = await octokit.graphql(mutation, { discussionId: discussion_node_id, body });
        const url = result.addDiscussionComment.comment.url;
        logger.info(`[tool] post_discussion_comment: ${url}`);
        return { success: true, url };
      } catch (err) {
        return { error: `Failed to post comment: ${err.message}` };
      }
    },
  });

  const searchDiscussions = defineTool("search_discussions", {
    description: "Search GitHub Discussions by keyword. Returns matching discussions.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        limit: { type: "number", description: "Max results (default 10)" },
      },
      required: ["query"],
    },
    handler: async ({ query, limit }) => {
      const n = limit || 10;
      try {
        const searchQuery = `repo:${repo.owner}/${repo.repo} ${query}`;
        const gqlQuery = `query($q: String!, $limit: Int!) {
          search(query: $q, type: DISCUSSION, first: $limit) {
            nodes {
              ... on Discussion {
                number
                title
                url
                body
                createdAt
                comments { totalCount }
                author { login }
              }
            }
          }
        }`;
        const result = await octokit.graphql(gqlQuery, { q: searchQuery, limit: n });
        logger.info(`[tool] search_discussions: ${result.search.nodes.length} results for "${query}"`);
        return {
          results: result.search.nodes.map((d) => ({
            number: d.number,
            title: d.title,
            url: d.url,
            body: d.body?.substring(0, 500),
            author: d.author?.login,
            commentCount: d.comments?.totalCount,
          })),
        };
      } catch (err) {
        return { error: `Failed to search discussions: ${err.message}` };
      }
    },
  });

  return [fetchDiscussion, listDiscussions, postDiscussionComment, searchDiscussions];
}

// ── GitHub API tools (issues, PRs, workflows) ───────────────────────

/**
 * Create GitHub API tools for issue/PR/workflow operations.
 *
 * @param {Object} octokit - Authenticated Octokit instance
 * @param {{ owner: string, repo: string }} repo - Repository context
 * @param {Function} defineTool - SDK defineTool function
 * @param {Object} [logger]
 * @returns {Array} Array of GitHub API tools
 */
export function createGitHubTools(octokit, repo, defineTool, logger = defaultLogger) {
  const createIssue = defineTool("create_issue", {
    description: "Create a new GitHub issue with title, body, and optional labels.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Issue title" },
        body: { type: "string", description: "Issue body (markdown)" },
        labels: { type: "array", items: { type: "string" }, description: "Labels to add (e.g. ['automated', 'enhancement'])" },
      },
      required: ["title"],
    },
    handler: async ({ title, body, labels }) => {
      const REJECTED_TITLES = ["untitled", "untitled issue", "no title", "new issue", "issue", ""];
      const trimmed = (title || "").trim();
      if (!trimmed || REJECTED_TITLES.includes(trimmed.toLowerCase())) {
        logger.warning(`[tool] create_issue: rejected empty/generic title "${title}"`);
        return { error: `Issue title "${title}" is too generic. Provide a specific, descriptive title.` };
      }
      try {
        const { data: issue } = await octokit.rest.issues.create({
          ...repo, title: trimmed, body: body || "", labels: labels || [],
        });
        logger.info(`[tool] create_issue: #${issue.number} "${trimmed}"`);
        return { number: issue.number, url: issue.html_url, title: issue.title };
      } catch (err) {
        return { error: `Failed to create issue: ${err.message}` };
      }
    },
  });

  const closeIssue = defineTool("close_issue", {
    description: "Close a GitHub issue with an optional comment.",
    parameters: {
      type: "object",
      properties: {
        issue_number: { type: "number", description: "Issue number to close" },
        comment: { type: "string", description: "Optional closing comment" },
      },
      required: ["issue_number"],
    },
    handler: async ({ issue_number, comment }) => {
      try {
        if (comment) {
          await octokit.rest.issues.createComment({ ...repo, issue_number, body: comment });
        }
        await octokit.rest.issues.update({ ...repo, issue_number, state: "closed" });
        logger.info(`[tool] close_issue: #${issue_number}`);
        return { success: true, issue_number };
      } catch (err) {
        return { error: `Failed to close issue #${issue_number}: ${err.message}` };
      }
    },
  });

  const labelIssue = defineTool("label_issue", {
    description: "Add labels to a GitHub issue.",
    parameters: {
      type: "object",
      properties: {
        issue_number: { type: "number", description: "Issue number" },
        labels: { type: "array", items: { type: "string" }, description: "Labels to add" },
      },
      required: ["issue_number", "labels"],
    },
    handler: async ({ issue_number, labels }) => {
      try {
        await octokit.rest.issues.addLabels({ ...repo, issue_number, labels });
        logger.info(`[tool] label_issue: #${issue_number} +${labels.join(",")}`);
        return { success: true, issue_number, labels };
      } catch (err) {
        return { error: `Failed to label issue #${issue_number}: ${err.message}` };
      }
    },
  });

  const dispatchWorkflow = defineTool("dispatch_workflow", {
    description: "Trigger a GitHub Actions workflow_dispatch event.",
    parameters: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow filename (e.g. 'agentic-lib-workflow.yml')" },
        ref: { type: "string", description: "Branch or tag ref (default: 'main')" },
        inputs: { type: "object", description: "Workflow inputs as key-value pairs" },
      },
      required: ["workflow_id"],
    },
    handler: async ({ workflow_id, ref, inputs }) => {
      try {
        await octokit.rest.actions.createWorkflowDispatch({
          ...repo, workflow_id, ref: ref || "main", inputs: inputs || {},
        });
        logger.info(`[tool] dispatch_workflow: ${workflow_id} (ref=${ref || "main"})`);
        return { success: true, workflow_id, ref: ref || "main" };
      } catch (err) {
        return { error: `Failed to dispatch workflow ${workflow_id}: ${err.message}` };
      }
    },
  });

  const listIssues = defineTool("list_issues", {
    description: "List GitHub issues for the repository, with optional filters.",
    parameters: {
      type: "object",
      properties: {
        state: { type: "string", description: "Issue state: open, closed, all (default: open)" },
        labels: { type: "string", description: "Comma-separated label filter" },
        limit: { type: "number", description: "Max issues to return (default 20)" },
        sort: { type: "string", description: "Sort by: created, updated, comments (default: created)" },
      },
    },
    handler: async ({ state, labels, limit, sort }) => {
      try {
        const { data: issues } = await octokit.rest.issues.listForRepo({
          ...repo,
          state: state || "open",
          labels: labels || undefined,
          per_page: limit || 20,
          sort: sort || "created",
          direction: "desc",
        });
        const filtered = issues.filter((i) => !i.pull_request);
        logger.info(`[tool] list_issues: ${filtered.length} issues (state=${state || "open"})`);
        return {
          issues: filtered.map((i) => ({
            number: i.number,
            title: i.title,
            state: i.state,
            labels: i.labels.map((l) => l.name),
            created_at: i.created_at,
            updated_at: i.updated_at,
            body: i.body?.substring(0, 500),
          })),
        };
      } catch (err) {
        return { error: `Failed to list issues: ${err.message}` };
      }
    },
  });

  const listPrs = defineTool("list_prs", {
    description: "List open pull requests for the repository.",
    parameters: {
      type: "object",
      properties: {
        state: { type: "string", description: "PR state: open, closed, all (default: open)" },
        limit: { type: "number", description: "Max PRs to return (default 10)" },
      },
    },
    handler: async ({ state, limit }) => {
      try {
        const { data: prs } = await octokit.rest.pulls.list({
          ...repo, state: state || "open", per_page: limit || 10,
        });
        logger.info(`[tool] list_prs: ${prs.length} PRs`);
        return {
          prs: prs.map((p) => ({
            number: p.number,
            title: p.title,
            state: p.state,
            head: p.head.ref,
            base: p.base.ref,
            labels: p.labels.map((l) => l.name),
            mergeable: p.mergeable,
            created_at: p.created_at,
          })),
        };
      } catch (err) {
        return { error: `Failed to list PRs: ${err.message}` };
      }
    },
  });

  const getIssue = defineTool("get_issue", {
    description: "Get full details of a GitHub issue including comments.",
    parameters: {
      type: "object",
      properties: {
        issue_number: { type: "number", description: "Issue number" },
        include_comments: { type: "boolean", description: "Include comments (default true)" },
      },
      required: ["issue_number"],
    },
    handler: async ({ issue_number, include_comments }) => {
      try {
        const { data: issue } = await octokit.rest.issues.get({ ...repo, issue_number });
        const result = {
          number: issue.number,
          title: issue.title,
          state: issue.state,
          body: issue.body,
          labels: issue.labels.map((l) => l.name),
          created_at: issue.created_at,
          updated_at: issue.updated_at,
          author: issue.user?.login,
        };
        if (include_comments !== false) {
          const { data: comments } = await octokit.rest.issues.listComments({
            ...repo, issue_number, per_page: 30,
          });
          result.comments = comments.map((c) => ({
            author: c.user?.login,
            body: c.body,
            created_at: c.created_at,
          }));
        }
        logger.info(`[tool] get_issue: #${issue_number} "${issue.title}"`);
        return result;
      } catch (err) {
        return { error: `Failed to get issue #${issue_number}: ${err.message}` };
      }
    },
  });

  const commentOnIssue = defineTool("comment_on_issue", {
    description: "Add a comment to a GitHub issue.",
    parameters: {
      type: "object",
      properties: {
        issue_number: { type: "number", description: "Issue number" },
        body: { type: "string", description: "Comment body (markdown)" },
      },
      required: ["issue_number", "body"],
    },
    handler: async ({ issue_number, body }) => {
      try {
        const { data: comment } = await octokit.rest.issues.createComment({
          ...repo, issue_number, body,
        });
        logger.info(`[tool] comment_on_issue: #${issue_number}`);
        return { success: true, url: comment.html_url };
      } catch (err) {
        return { error: `Failed to comment on issue #${issue_number}: ${err.message}` };
      }
    },
  });

  return [createIssue, closeIssue, labelIssue, dispatchWorkflow, listIssues, listPrs, getIssue, commentOnIssue];
}

// ── Git state tools ─────────────────────────────────────────────────

/**
 * Create git state inspection tools.
 *
 * @param {Function} defineTool - SDK defineTool function
 * @param {Object} [logger]
 * @returns {Array} Array of git tools
 */
export function createGitTools(defineTool, logger = defaultLogger) {
  const gitDiff = defineTool("git_diff", {
    description: "Show uncommitted changes (git diff). Use to inspect what has changed before committing.",
    parameters: {
      type: "object",
      properties: {
        staged: { type: "boolean", description: "Show staged changes only (default: false, shows unstaged)" },
      },
    },
    handler: ({ staged }) => {
      const cmd = staged ? "git diff --cached" : "git diff";
      logger.info(`[tool] git_diff: ${cmd}`);
      try {
        const output = execSync(cmd, { encoding: "utf8", timeout: 30000 });
        return { diff: output || "(no changes)" };
      } catch (err) {
        return { error: `git diff failed: ${err.message}` };
      }
    },
  });

  const gitStatus = defineTool("git_status", {
    description: "Show the working tree status (git status --porcelain).",
    parameters: {
      type: "object",
      properties: {},
    },
    handler: () => {
      logger.info("[tool] git_status");
      try {
        const output = execSync("git status --porcelain", { encoding: "utf8", timeout: 30000 });
        return { status: output || "(clean working tree)" };
      } catch (err) {
        return { error: `git status failed: ${err.message}` };
      }
    },
  });

  return [gitDiff, gitStatus];
}
