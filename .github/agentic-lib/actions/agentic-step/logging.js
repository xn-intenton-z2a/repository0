// logging.js — intentïon.md activity log writer
//
// Appends structured entries to the intentïon.md activity log,
// including commit URLs and safety-check outcomes.

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import * as core from "@actions/core";

/**
 * Log an activity to the intentïon.md file.
 *
 * @param {Object} options
 * @param {string} options.filepath - Path to the intentïon.md file
 * @param {string} options.task - The task that was performed
 * @param {string} options.outcome - The outcome (e.g. 'pr-created', 'nop', 'error')
 * @param {string} [options.issueNumber] - Related issue number
 * @param {string} [options.prNumber] - Related PR number
 * @param {string} [options.commitUrl] - URL to the commit
 * @param {number} [options.tokensUsed] - Tokens consumed
 * @param {string} [options.model] - Model used
 * @param {string} [options.details] - Additional details
 * @param {string} [options.workflowUrl] - URL to the workflow run
 */
export function logActivity({
  filepath,
  task,
  outcome,
  issueNumber,
  prNumber,
  commitUrl,
  tokensUsed,
  model,
  details,
  workflowUrl,
}) {
  const dir = dirname(filepath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const isoDate = new Date().toISOString();
  const parts = [`\n## ${task} at ${isoDate}`, "", `**Outcome:** ${outcome}`];

  if (issueNumber) parts.push(`**Issue:** #${issueNumber}`);
  if (prNumber) parts.push(`**PR:** #${prNumber}`);
  if (commitUrl) parts.push(`**Commit:** [${commitUrl}](${commitUrl})`);
  if (model) parts.push(`**Model:** ${model}`);
  if (tokensUsed !== undefined) parts.push(`**Tokens:** ${tokensUsed}`);
  if (workflowUrl) parts.push(`**Workflow:** [${workflowUrl}](${workflowUrl})`);
  if (details) {
    parts.push("");
    parts.push(details);
  }
  parts.push("");
  parts.push("---");

  const entry = parts.join("\n");

  if (existsSync(filepath)) {
    appendFileSync(filepath, entry);
  } else {
    writeFileSync(filepath, `# intentïon Activity Log\n${entry}`);
  }
}

/**
 * Log a safety check outcome to the GitHub Actions log.
 *
 * @param {string} checkName - The name of the safety check (e.g. 'attempt-limit', 'wip-limit', 'issue-resolved')
 * @param {boolean} passed - Whether the check passed (true = allowed to proceed)
 * @param {Object} [details] - Additional details about the check
 */
export function logSafetyCheck(checkName, passed, details = {}) {
  const detailStr = Object.entries(details)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  const status = passed ? "PASSED" : "BLOCKED";
  const suffix = detailStr ? ` (${detailStr})` : "";
  const message = `Safety check [${checkName}]: ${status}${suffix}`;
  if (passed) {
    core.info(message);
  } else {
    core.warning(message);
  }
}
