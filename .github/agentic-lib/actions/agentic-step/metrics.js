// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// metrics.js — GitHub API metric gathering for agentic-step
//
// Extracts issue counting, resolved issue tracking, and dedicated test
// counting from index.js so it remains a thin adapter.

import { existsSync, readFileSync, readdirSync } from "fs";

/**
 * Check if an issue has the instability label.
 *
 * @param {Object} context - Task context with octokit and repo
 * @param {string} issueNumber - Issue number to check
 * @returns {Promise<boolean>} True if the issue has the instability label
 */
export async function checkInstabilityLabel(context, issueNumber) {
  try {
    const { data: issueData } = await context.octokit.rest.issues.get({
      ...context.repo, issue_number: Number(issueNumber),
    });
    return issueData.labels.some((l) => l.name === "instability");
  } catch {
    return false;
  }
}

/**
 * Count dedicated test files that import from src/lib/.
 *
 * @param {Function} scanDir - scanDirectory function from copilot.js
 * @returns {number} Count of dedicated test files
 */
export function countDedicatedTests(scanDir) {
  let count = 0;
  for (const dir of ["tests", "__tests__"]) {
    if (!existsSync(dir)) continue;
    try {
      const testFiles = scanDir(dir, [".js", ".ts", ".mjs"], { limit: 20 });
      for (const tf of testFiles) {
        if (/^(main|web|behaviour)\.test\.[jt]s$/.test(tf.name)) continue;
        const content = readFileSync(tf.path, "utf8");
        if (/from\s+['"].*src\/lib\//.test(content) || /require\s*\(\s*['"].*src\/lib\//.test(content)) {
          count++;
        }
      }
    } catch { /* ignore */ }
  }
  return count;
}

/**
 * Count open automated issues split by feature vs maintenance.
 *
 * @param {Object} context - Task context with octokit and repo
 * @returns {Promise<{featureIssueCount: number, maintenanceIssueCount: number}>}
 */
export async function countOpenIssues(context) {
  let featureIssueCount = 0, maintenanceIssueCount = 0;
  try {
    const { data: openAutoIssues } = await context.octokit.rest.issues.listForRepo({
      ...context.repo, state: "open", labels: "automated", per_page: 50,
    });
    for (const oi of openAutoIssues.filter((i) => !i.pull_request)) {
      if (oi.labels.map((l) => l.name).includes("maintenance")) maintenanceIssueCount++;
      else featureIssueCount++;
    }
  } catch { /* API not available */ }
  return { featureIssueCount, maintenanceIssueCount };
}

/**
 * Count resolved automated issues since init.
 *
 * @param {Object} context - Task context with octokit, repo, config
 * @returns {Promise<number>} Count of resolved issues
 */
export async function countResolvedIssues(context) {
  let resolvedCount = 0;
  try {
    const initTimestamp = context.config.init?.timestamp;
    const { data: closedIssues } = await context.octokit.rest.issues.listForRepo({
      ...context.repo, state: "closed", labels: "automated", per_page: 10, sort: "updated", direction: "desc",
    });
    const initEpoch = initTimestamp ? new Date(initTimestamp).getTime() : 0;
    for (const ci of closedIssues.filter((i) => !i.pull_request && (initEpoch <= 0 || new Date(i.created_at).getTime() >= initEpoch))) {
      try {
        const { data: comments } = await context.octokit.rest.issues.listComments({
          ...context.repo, issue_number: ci.number, per_page: 5, sort: "created", direction: "desc",
        });
        if (comments.some((c) => c.body?.includes("Automated Review Result"))) {
          resolvedCount++;
        } else {
          const { data: events } = await context.octokit.rest.issues.listEvents({
            ...context.repo, issue_number: ci.number, per_page: 10,
          });
          if (events.some((e) => e.event === "closed" && e.commit_id)) resolvedCount++;
          else if (ci.labels.map((l) => (typeof l === "string" ? l : l.name)).includes("merged")) resolvedCount++;
        }
      } catch { /* ignore */ }
    }
  } catch { /* API not available */ }
  return resolvedCount;
}

/**
 * Count .md files in a directory.
 *
 * @param {string} dirPath - Directory to count in
 * @returns {number} Count (0 if directory doesn't exist)
 */
export function countMdFiles(dirPath) {
  if (!dirPath || !existsSync(dirPath)) return 0;
  return readdirSync(dirPath).filter((f) => f.endsWith(".md")).length;
}
