// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// logging.js — intentïon.md activity log writer
//
// Appends structured entries to the intentïon.md activity log,
// including commit URLs and safety-check outcomes.

import { writeFileSync, readFileSync, appendFileSync, existsSync, mkdirSync } from "fs";
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
 * @param {number} [options.tokensUsed] - Total tokens consumed (input + output)
 * @param {number} [options.inputTokens] - Input tokens consumed
 * @param {number} [options.outputTokens] - Output tokens consumed
 * @param {number} [options.cost] - Model invocations (from Copilot SDK)
 * @param {number} [options.durationMs] - Task wall-clock duration in milliseconds
 * @param {string} [options.model] - Model used
 * @param {string} [options.details] - Additional details
 * @param {string} [options.workflowUrl] - URL to the workflow run
 * @param {string} [options.profile] - Active tuning profile name
 * @param {Array} [options.changes] - List of file changes { action, file, sizeInfo }
 * @param {string} [options.contextNotes] - English notes about task observations
 * @param {Array} [options.limitsStatus] - Limit status entries { name, value, remaining, status }
 * @param {Array} [options.promptBudget] - Prompt budget entries { section, size, files, notes }
 * @param {string} [options.closingNotes] - Auto-generated limit concern notes
 * @param {number} [options.transformationCost] - Transformation cost for this entry (0 or 1)
 */
export function logActivity({
  filepath,
  task,
  outcome,
  issueNumber,
  prNumber,
  commitUrl,
  tokensUsed,
  inputTokens,
  outputTokens,
  cost,
  durationMs,
  model,
  details,
  workflowUrl,
  profile,
  changes,
  contextNotes,
  limitsStatus,
  promptBudget,
  closingNotes,
  transformationCost,
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
  if (profile) parts.push(`**Profile:** ${profile}`);
  if (tokensUsed) parts.push(`**Token Count:** ${tokensUsed} (in: ${inputTokens || 0}, out: ${outputTokens || 0})`);
  if (cost) parts.push(`**Model Invocations:** ${cost}`);
  if (durationMs) {
    const secs = Math.round(durationMs / 1000);
    const mins = (durationMs / 60000).toFixed(1);
    parts.push(`**Duration:** ${secs}s (~${mins} GitHub Actions min)`);
  }
  if (transformationCost != null) parts.push(`**agentic-lib transformation cost:** ${transformationCost}`);
  if (workflowUrl) parts.push(`**Workflow:** [${workflowUrl}](${workflowUrl})`);
  if (changes && changes.length > 0) {
    parts.push("", "### What Changed");
    for (const c of changes) {
      parts.push(`- ${c.action}: \`${c.file}\`${c.sizeInfo ? ` (${c.sizeInfo})` : ""}`);
    }
  }
  if (contextNotes) {
    parts.push("", "### Context Notes");
    parts.push(contextNotes);
  }
  if (limitsStatus && limitsStatus.length > 0) {
    parts.push("", "### Limits Status");
    parts.push("| Limit | Value | Capacity | Status |");
    parts.push("|---|---|---|---|");
    for (const ls of limitsStatus) {
      parts.push(`| ${ls.name} | ${ls.value} | ${ls.remaining} remaining | ${ls.status || ""} |`);
    }
  }
  if (promptBudget && promptBudget.length > 0) {
    parts.push("", "### Prompt Budget");
    parts.push("| Section | Size | Files | Notes |");
    parts.push("|---|---|---|---|");
    for (const pb of promptBudget) {
      parts.push(`| ${pb.section} | ${pb.size} chars | ${pb.files || "—"} | ${pb.notes || ""} |`);
    }
  }
  if (closingNotes) {
    parts.push("", "### Closing Notes");
    parts.push(closingNotes);
  }
  if (details) {
    parts.push("");
    parts.push(details);
  }
  parts.push("");
  parts.push("---");

  const entry = parts.join("\n");

  const MAX_ENTRIES = 30;

  if (existsSync(filepath)) {
    // Rotate: keep only the header + last MAX_ENTRIES entries
    const existing = readFileSync(filepath, "utf8");
    const sections = existing.split("\n## ");
    if (sections.length > MAX_ENTRIES + 1) {
      // sections[0] is the header, sections[1..] are entries (prefixed with "## " after split)
      const header = sections[0];
      const kept = sections.slice(-(MAX_ENTRIES));
      writeFileSync(filepath, header + "\n## " + kept.join("\n## ") + entry);
    } else {
      appendFileSync(filepath, entry);
    }
  } else {
    writeFileSync(filepath, `# intentïon Activity Log\n${entry}`);
  }
}

/**
 * Generate closing notes from limits status, flagging limits at or approaching capacity.
 *
 * @param {Array} limitsStatus - Array of { name, value, remaining, status, valueNum, capacityNum }
 * @returns {string} Closing notes text
 */
export function generateClosingNotes(limitsStatus) {
  if (!limitsStatus || limitsStatus.length === 0) return "";

  const concerns = [];
  let anyChecked = false;
  for (const ls of limitsStatus) {
    if (ls.status === "n/a") continue;
    const used = ls.valueNum || 0;
    const capacity = ls.capacityNum || 0;
    if (capacity === 0) continue;
    anyChecked = true;
    const pct = Math.round((used / capacity) * 100);
    if (pct >= 100) {
      concerns.push(`${ls.name} at capacity (${ls.value}) — actions will be blocked.`);
    } else if (pct >= 80) {
      concerns.push(`${ls.name} approaching capacity (${ls.value}).`);
    }
  }

  if (!anyChecked) return "";
  return concerns.length > 0 ? concerns.join("\n") : "All limits within normal range.";
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
