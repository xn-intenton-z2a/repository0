// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// schedule-utils.cjs — Shared schedule maps and helpers for workflow YAML updates.
//
// Used by agentic-lib-schedule.yml and agentic-lib-init.yml via:
//   const { WORKFLOW_SCHEDULE_MAP, ... } = require('./.github/agentic-lib/scripts/schedule-utils.cjs');
//
// CRITICAL: These maps must stay in sync. That's the whole point of this file —
// a single source of truth for proportional schedule crons.

const fs = require("fs");

// Workflow (main pipeline) — runs most often
const WORKFLOW_SCHEDULE_MAP = {
  off: "0 0 31 2 *",
  weekly: "25 6 * * 1", // Monday 6:25am
  daily: "25 6 * * *", // Every day 6:25am
  hourly: "25 * * * *", // Every hour at :25
  continuous: "5,25,45 * * * *", // Every 20 min
};

// Init (infrastructure updates) — runs least often
const INIT_SCHEDULE_MAP = {
  off: "0 0 31 2 *",
  weekly: "0 4 1 * *", // 1st of month 4:00am
  daily: "0 4 * * 1", // Monday 4:00am
  hourly: "0 4 * * *", // Every day 4:00am
  continuous: "0 1,5,9,13,17,21 * * *", // Every 4 hours
};

// Test (CI health checks) — more often than init, less than workflow
const TEST_SCHEDULE_MAP = {
  off: "0 0 31 2 *",
  weekly: "40 6 * * 1", // Monday 6:40am
  daily: "40 6 * * *", // Every day 6:40am
  hourly: "40 0,4,8,12,16,20 * * *", // Every 4 hours at :40
  continuous: "40 * * * *", // Every hour at :40
};

/**
 * Update the cron schedule in a workflow YAML file.
 * Handles duplicate schedule: block deduplication.
 *
 * @param {string} path - Path to the workflow YAML file
 * @param {string} cron - New cron expression
 * @param {string} label - Label for log messages
 * @param {Object} [logger] - Logger with .info() method (defaults to console)
 */
function updateWorkflowCron(path, cron, label, logger) {
  const log = logger || { info: console.log };
  if (!fs.existsSync(path)) {
    log.info(`${label}: file not found at ${path}, skipping`);
    return;
  }
  let content = fs.readFileSync(path, "utf8");
  // Remove any duplicate schedule: blocks (keep only the first)
  const dupScheduleRegex =
    /(\n  schedule:\n    - cron: "[^"]*"\n)(\s*schedule:\n\s*- cron: "[^"]*"\n)/;
  if (dupScheduleRegex.test(content)) {
    content = content.replace(dupScheduleRegex, "$1");
    log.info(`${label}: removed duplicate schedule block`);
  }
  const cronRegex = /- cron: "[^"]*"/;
  if (cronRegex.test(content)) {
    content = content.replace(cronRegex, `- cron: "${cron}"`);
  } else {
    const scheduleBlock = `\n  schedule:\n    - cron: "${cron}"\n`;
    content = content.replace(/\non:\n/, `\non:${scheduleBlock}`);
  }
  fs.writeFileSync(path, content);
  log.info(`${label}: set cron to "${cron}"`);
}

/**
 * Update all three workflow crons proportionally for a given frequency.
 *
 * @param {string} frequency - off | weekly | daily | hourly | continuous
 * @param {Object} [logger] - Logger with .info() method
 */
function updateAllSchedules(frequency, logger) {
  const workflowCron = WORKFLOW_SCHEDULE_MAP[frequency];
  const initCron = INIT_SCHEDULE_MAP[frequency];
  const testCron = TEST_SCHEDULE_MAP[frequency];

  if (workflowCron) {
    updateWorkflowCron(
      ".github/workflows/agentic-lib-workflow.yml",
      workflowCron,
      "workflow",
      logger,
    );
  }
  if (initCron) {
    updateWorkflowCron(
      ".github/workflows/agentic-lib-init.yml",
      initCron,
      "init",
      logger,
    );
  }
  if (testCron) {
    updateWorkflowCron(
      ".github/workflows/agentic-lib-test.yml",
      testCron,
      "test",
      logger,
    );
  }
}

module.exports = {
  WORKFLOW_SCHEDULE_MAP,
  INIT_SCHEDULE_MAP,
  TEST_SCHEDULE_MAP,
  updateWorkflowCron,
  updateAllSchedules,
};
