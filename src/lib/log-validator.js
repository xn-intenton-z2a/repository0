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
  // Accept multiple variants: "Acceptance criteria | 0/7", "Acceptance: 0/7", "Acceptance 0/7"
  const acceptanceRegex = /Acceptance(?:\s*criteria)?\s*(?:\||:)?\s*(\d+)\s*\/\s*(\d+)/i;
  const missionRegex = /Mission\s*(?:complete)?\s*declared\s*(?:\||:)?\s*(YES|NO)/i;

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

  // Pair mission declarations with the most recent prior acceptance entry when possible.
  // This avoids matching a later unrelated acceptance counter and causing false positives.
  for (const m of missionEntries) {
    // find acceptance entries that appear before or at the mission declaration
    const priorAcceptances = acceptanceEntries.filter((a) => a.index <= m.index);
    let matched = null;

    if (priorAcceptances.length > 0) {
      // choose the latest prior one
      matched = priorAcceptances.reduce((acc, cur) => (cur.index > acc.index ? cur : acc), priorAcceptances[0]);
    } else if (acceptanceEntries.length > 0) {
      // no prior acceptance entries; fall back to nearest (defensive)
      let best = acceptanceEntries[0];
      let bestDist = Math.abs(best.index - m.index);
      for (const a of acceptanceEntries) {
        const dist = Math.abs(a.index - m.index);
        if (dist < bestDist) {
          bestDist = dist;
          best = a;
        }
      }
      matched = best;
    } else {
      // no acceptance entries at all
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

    if (m.missionDeclared && matched && matched.passed !== matched.total) {
      contradictions.push({
        runId: null,
        timestamp: null,
        message: "Mission declared complete but acceptance counters mismatch",
        acceptance: { passed: matched.passed, total: matched.total },
        missionDeclared: true,
      });
    }
  }

  return contradictions;
}
