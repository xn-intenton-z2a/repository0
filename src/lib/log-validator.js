// SPDX-License-Identifier: MIT
// src/lib/log-validator.js

/**
 * Determine whether a mission is complete based on numeric counters.
 * @param {{passed:number,total:number}} counters
 * @returns {boolean}
 * @throws {Error} when counters are invalid (non-integer, negative, total <= 0, passed > total)
 */
export function isMissionComplete({ passed, total } = {}) {
  if (!Number.isInteger(passed) || !Number.isInteger(total)) {
    throw new Error("Invalid counters: passed and total must be integer numbers");
  }
  if (Number.isNaN(passed) || Number.isNaN(total)) {
    throw new Error("Invalid counters: NaN encountered");
  }
  if (total <= 0) {
    throw new Error("Invalid counters: total must be > 0");
  }
  if (passed < 0) {
    throw new Error("Invalid counters: passed cannot be negative");
  }
  if (passed > total) {
    throw new Error("Invalid counters: passed greater than total");
  }
  return passed === total;
}

/**
 * Parse plain-text logs to find contradictions where a mission is declared complete
 * while acceptance counters do not indicate completion.
 *
 * Returns an array of contradiction objects with helpful fields for reporting.
 */
export function findMissionContradictions(logText) {
  if (typeof logText !== "string") {
    throw new TypeError("findMissionContradictions: logText must be a string");
  }

  const lines = logText.split(/\r?\n/);
  const acceptanceRegex = /Acceptance criteria\s*\|\s*(\d+)\s*\/\s*(\d+)/i;
  const missionRegex = /Mission complete declared\s*\|\s*(YES|NO)/i;

  const acceptanceEntries = [];
  const missionEntries = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const aMatch = acceptanceRegex.exec(line);
    if (aMatch) {
      acceptanceEntries.push({
        passed: Number(aMatch[1]),
        total: Number(aMatch[2]),
        index: i,
        raw: line,
      });
    }
    const mMatch = missionRegex.exec(line);
    if (mMatch) {
      missionEntries.push({
        missionDeclared: mMatch[1].toUpperCase() === "YES",
        index: i,
        raw: line,
      });
    }
  }

  const contradictions = [];

  // Acceptance-counter validity checks
  for (const a of acceptanceEntries) {
    if (!Number.isInteger(a.passed) || !Number.isInteger(a.total) || a.passed < 0 || a.total < 0) {
      contradictions.push({
        runId: null,
        timestamp: null,
        message: "Acceptance counters invalid (non-integer or negative)",
        acceptance: { passed: a.passed, total: a.total },
        missionDeclared: null,
      });
    }
    if (a.passed > a.total) {
      contradictions.push({
        runId: null,
        timestamp: null,
        message: "Acceptance counters invalid: passed greater than total",
        acceptance: { passed: a.passed, total: a.total },
        missionDeclared: null,
      });
    }
  }

  // Pair mission declarations with nearest acceptance entry (by line index)
  for (const m of missionEntries) {
    let nearest = null;
    let bestDist = Infinity;
    for (const a of acceptanceEntries) {
      const dist = Math.abs(a.index - m.index);
      if (dist < bestDist) {
        bestDist = dist;
        nearest = a;
      }
    }
    if (!nearest) {
      // No acceptance counters in the log; if mission declared true, it's suspicious
      if (m.missionDeclared) {
        contradictions.push({
          runId: null,
          timestamp: null,
          message: "Mission declared without acceptance counters",
          acceptance: null,
          missionDeclared: true,
        });
      }
      continue;
    }

    if (m.missionDeclared && nearest.passed !== nearest.total) {
      contradictions.push({
        runId: null,
        timestamp: null,
        message: "Mission declared complete but acceptance counters mismatch",
        acceptance: { passed: nearest.passed, total: nearest.total },
        missionDeclared: true,
      });
    }
  }

  return contradictions;
}
