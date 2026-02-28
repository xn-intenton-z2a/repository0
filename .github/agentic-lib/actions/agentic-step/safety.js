// safety.js — WIP limits, attempt tracking, and path enforcement
//
// Provides safety checks that prevent the agentic system from:
// - Exceeding WIP (work-in-progress) limits on issues
// - Retrying failed branches/issues beyond configured limits
// - Writing to paths outside the allowed set

import { logSafetyCheck } from "./logging.js";

/**
 * Check if the number of open issues with a given label is below the WIP limit.
 *
 * @param {import('@actions/github').GitHub} octokit - GitHub API client
 * @param {Object} repo - { owner, repo } identifying the repository
 * @param {string} label - Issue label to count (e.g. 'feature', 'maintenance')
 * @param {number} limit - Maximum allowed open issues
 * @returns {Promise<{allowed: boolean, count: number}>}
 */
export async function checkWipLimit(octokit, repo, label, limit) {
  const { data: issues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "open",
    labels: label,
    per_page: limit + 1,
  });
  const count = issues.length;
  const allowed = count < limit;
  logSafetyCheck("wip-limit", allowed, { label, count, limit });
  return { allowed, count };
}

/**
 * Count how many branches exist for a given issue (by naming convention).
 *
 * @param {import('@actions/github').GitHub} octokit - GitHub API client
 * @param {Object} repo - { owner, repo } identifying the repository
 * @param {string|number} issueNumber - The issue number
 * @param {string} branchPrefix - Branch naming prefix (e.g. 'agentic-lib-issue-')
 * @returns {Promise<number>} Number of branches matching the pattern
 */
export async function countBranchAttempts(octokit, repo, issueNumber, branchPrefix) {
  const pattern = `${branchPrefix}${issueNumber}`;
  try {
    const { data: refs } = await octokit.rest.git.listMatchingRefs({
      ...repo,
      ref: `heads/${pattern}`,
    });
    return refs.length;
  } catch {
    return 0;
  }
}

/**
 * Check if the number of attempts for an issue is below the limit.
 *
 * @param {import('@actions/github').GitHub} octokit - GitHub API client
 * @param {Object} repo - { owner, repo }
 * @param {string|number} issueNumber - The issue number
 * @param {string} branchPrefix - Branch naming prefix
 * @param {number} maxAttempts - Maximum allowed attempts
 * @returns {Promise<{allowed: boolean, attempts: number}>}
 */
export async function checkAttemptLimit(octokit, repo, issueNumber, branchPrefix, maxAttempts) {
  const attempts = await countBranchAttempts(octokit, repo, issueNumber, branchPrefix);
  const allowed = attempts < maxAttempts;
  logSafetyCheck("attempt-limit", allowed, { issueNumber, attempts, maxAttempts });
  return { allowed, attempts };
}

/**
 * Validate that a target path is within the allowed writable paths.
 *
 * @param {string} targetPath - The path being written to
 * @param {string[]} writablePaths - Allowed writable paths
 * @returns {boolean} True if the path is allowed
 */
export function isPathWritable(targetPath, writablePaths) {
  const writable = writablePaths.some((allowed) => {
    if (targetPath === allowed) return true;
    if (allowed.endsWith("/") && targetPath.startsWith(allowed)) return true;
    if (targetPath.startsWith(allowed + "/")) return true;
    return false;
  });
  logSafetyCheck("path-writable", writable, { targetPath });
  return writable;
}

/**
 * Check if an issue is already resolved (closed).
 *
 * @param {import('@actions/github').GitHub} octokit - GitHub API client
 * @param {Object} repo - { owner, repo }
 * @param {string|number} issueNumber - The issue number
 * @returns {Promise<boolean>} True if the issue is closed
 */
export async function isIssueResolved(octokit, repo, issueNumber) {
  const { data: issue } = await octokit.rest.issues.get({
    ...repo,
    issue_number: Number(issueNumber),
  });
  const resolved = issue.state === "closed";
  logSafetyCheck("issue-resolved", !resolved, { issueNumber, state: issue.state });
  return resolved;
}
