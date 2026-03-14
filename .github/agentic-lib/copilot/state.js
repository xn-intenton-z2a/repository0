// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// state.js — Persistent state across workflow runs via agentic-lib-state.toml
//
// Lives on the agentic-lib-logs branch. Read at the start of each
// agentic-step invocation, written at the end.

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Default state structure — used when no state file exists (first run after init).
 */
export function defaultState() {
  return {
    counters: {
      "log-sequence": 0,
      "cumulative-transforms": 0,
      "cumulative-maintain-features": 0,
      "cumulative-maintain-library": 0,
      "cumulative-nop-cycles": 0,
      "total-tokens": 0,
    },
    budget: {
      "transformation-budget-used": 0,
      "transformation-budget-cap": 0,
    },
    status: {
      "mission-complete": false,
      "mission-failed": false,
      "mission-failed-reason": "",
      "last-transform-at": "",
      "last-non-nop-at": "",
    },
    schedule: {
      current: "",
      "auto-disabled": false,
      "auto-disabled-reason": "",
    },
  };
}

/**
 * Serialize a state object to TOML format.
 * Uses a simple serializer — no external TOML library needed for writing.
 */
export function serializeState(state) {
  const lines = [
    "# agentic-lib-state.toml — Persistent state across workflow runs",
    "# Written to the agentic-lib-logs branch by each agentic-step invocation",
    "",
  ];

  for (const [section, values] of Object.entries(state)) {
    lines.push(`[${section}]`);
    for (const [key, val] of Object.entries(values)) {
      if (typeof val === "boolean") {
        lines.push(`${key} = ${val}`);
      } else if (typeof val === "number") {
        lines.push(`${key} = ${val}`);
      } else {
        lines.push(`${key} = "${String(val).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Parse a TOML state file into a state object.
 * Simple parser that handles the known state structure.
 */
export function parseState(content) {
  const state = defaultState();
  let currentSection = null;

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const sectionMatch = trimmed.match(/^\[(\w[\w-]*)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      if (!state[currentSection]) state[currentSection] = {};
      continue;
    }

    if (!currentSection) continue;

    const kvMatch = trimmed.match(/^([\w-]+)\s*=\s*(.+)$/);
    if (!kvMatch) continue;

    const [, key, rawVal] = kvMatch;
    let val;
    if (rawVal === "true") val = true;
    else if (rawVal === "false") val = false;
    else if (/^-?\d+$/.test(rawVal)) val = parseInt(rawVal, 10);
    else if (/^-?\d+\.\d+$/.test(rawVal)) val = parseFloat(rawVal);
    else if (rawVal.startsWith('"') && rawVal.endsWith('"')) {
      val = rawVal.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    } else {
      val = rawVal;
    }

    if (state[currentSection]) {
      state[currentSection][key] = val;
    }
  }

  return state;
}

/**
 * Read state from the agentic-lib-state.toml file in the given directory.
 *
 * @param {string} logsDir - Directory containing agentic-lib-state.toml (usually workspace root where logs are checked out)
 * @returns {Object} Parsed state, or defaults if file is missing
 */
export function readState(logsDir) {
  const filePath = join(logsDir || ".", "agentic-lib-state.toml");
  if (!existsSync(filePath)) return defaultState();
  try {
    const content = readFileSync(filePath, "utf8");
    return parseState(content);
  } catch {
    return defaultState();
  }
}

/**
 * Write state to the agentic-lib-state.toml file in the given directory.
 *
 * @param {string} logsDir - Directory to write to
 * @param {Object} state - State object to serialize
 */
export function writeState(logsDir, state) {
  const filePath = join(logsDir || ".", "agentic-lib-state.toml");
  writeFileSync(filePath, serializeState(state));
}

/**
 * Increment a counter in the state object. Returns the updated state.
 *
 * @param {Object} state - State object
 * @param {string} key - Counter key (e.g. "cumulative-transforms")
 * @returns {Object} The same state object (mutated)
 */
export function incrementCounter(state, key) {
  if (state.counters && key in state.counters) {
    state.counters[key] = (state.counters[key] || 0) + 1;
  }
  return state;
}

/**
 * Reset the consecutive nop cycle counter (called on any non-nop outcome).
 *
 * @param {Object} state - State object
 * @returns {Object} The same state object (mutated)
 */
export function resetConsecutiveNops(state) {
  if (state.counters) {
    state.counters["cumulative-nop-cycles"] = 0;
  }
  return state;
}

/**
 * Update state after a task completes.
 *
 * @param {Object} state - State object
 * @param {Object} params
 * @param {string} params.task - Task name
 * @param {string} params.outcome - Task outcome
 * @param {number} params.transformationCost - 0 or 1
 * @param {number} params.tokensUsed - Tokens consumed by this task
 * @returns {Object} The same state object (mutated)
 */
export function updateStateAfterTask(state, { task, outcome, transformationCost, tokensUsed }) {
  const now = new Date().toISOString();

  // Update counters
  state.counters["log-sequence"] = (state.counters["log-sequence"] || 0) + 1;
  state.counters["total-tokens"] = (state.counters["total-tokens"] || 0) + (tokensUsed || 0);

  if (transformationCost > 0) {
    state.counters["cumulative-transforms"] = (state.counters["cumulative-transforms"] || 0) + transformationCost;
    state.budget["transformation-budget-used"] = (state.budget["transformation-budget-used"] || 0) + transformationCost;
    state.status["last-transform-at"] = now;
  }

  // Track task-specific counters
  if (task === "maintain-features" && outcome !== "nop" && outcome !== "error") {
    state.counters["cumulative-maintain-features"] = (state.counters["cumulative-maintain-features"] || 0) + 1;
  }
  if (task === "maintain-library" && outcome !== "nop" && outcome !== "error") {
    state.counters["cumulative-maintain-library"] = (state.counters["cumulative-maintain-library"] || 0) + 1;
  }

  // Consecutive nop tracking
  if (outcome === "nop") {
    state.counters["cumulative-nop-cycles"] = (state.counters["cumulative-nop-cycles"] || 0) + 1;
  } else {
    state.counters["cumulative-nop-cycles"] = 0;
    state.status["last-non-nop-at"] = now;
  }

  return state;
}
