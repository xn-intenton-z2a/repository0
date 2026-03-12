// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// copilot.js — Thin re-export layer from shared src/copilot/ module.
//
// Phase 4: All Copilot SDK logic now lives in src/copilot/.
// This file re-exports with an @actions/core logger for backwards compatibility
// with existing task handlers that import from "../copilot.js".

import * as core from "@actions/core";

// Re-export pure functions directly — no logger needed
export {
  cleanSource,
  generateOutline,
  filterIssues,
  summariseIssue,
  extractFeatureSummary,
  extractNarrative,
  NARRATIVE_INSTRUCTION,
  isRateLimitError,
  retryDelayMs,
  supportsReasoningEffort,
} from "../../copilot/session.js";

// Re-export path formatting directly — pure function
export { formatPathsSection } from "../../copilot/session.js";

// Logger that delegates to @actions/core
const actionsLogger = {
  info: (...args) => core.info(args.join(" ")),
  warning: (...args) => core.warning(args.join(" ")),
  error: (...args) => core.error(args.join(" ")),
  debug: (...args) => core.debug(args.join(" ")),
};

// Wrap functions that take a logger parameter to inject the @actions/core logger
import {
  readOptionalFile as _readOptionalFile,
  scanDirectory as _scanDirectory,
  buildClientOptions as _buildClientOptions,
  logTuningParam as _logTuningParam,
  runCopilotTask as _runCopilotTask,
} from "../../copilot/session.js";

export function readOptionalFile(filePath, limit) {
  return _readOptionalFile(filePath, limit);
}

export function scanDirectory(dirPath, extensions, options = {}) {
  return _scanDirectory(dirPath, extensions, options, actionsLogger);
}

export function buildClientOptions(githubToken) {
  return _buildClientOptions(githubToken, actionsLogger);
}

export function logTuningParam(param, value, profileName, model, clip) {
  return _logTuningParam(param, value, profileName, model, clip, actionsLogger);
}

export async function runCopilotTask(options) {
  return _runCopilotTask({ ...options, logger: actionsLogger });
}
