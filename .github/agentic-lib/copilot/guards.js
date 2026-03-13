// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// guards.js — Short-circuit checks that skip LLM invocation when unnecessary
//
// Phase 4 Step 10a: Restores the guards that existed in the per-task handlers
// (transform.js, fix-code.js, maintain-features.js, maintain-library.js)
// before Phase 4 convergence replaced them with unconditional runCopilotSession().

import { existsSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";
import { readCumulativeCost } from "./telemetry.js";

/**
 * Task-to-guard mapping. Each task has an ordered list of guards.
 * Guards are checked in order; the first that triggers returns skip.
 */
const TASK_GUARDS = {
  "transform": ["no-mission", "mission-complete", "budget-exhausted"],
  "fix-code": ["tests-pass", "budget-exhausted"],
  "maintain-features": ["mission-complete", "budget-exhausted"],
  "maintain-library": ["mission-complete", "budget-exhausted"],
};

/**
 * Check whether a task should be skipped before invoking the LLM.
 *
 * @param {string} taskName - Task name (e.g. "transform", "fix-code")
 * @param {Object} config - Parsed agentic-lib config
 * @param {string} workspacePath - Path to the workspace
 * @param {Object} [options]
 * @param {Object} [options.logger] - Logger interface
 * @returns {{ skip: boolean, reason: string }}
 */
export function checkGuards(taskName, config, workspacePath, { logger } = {}) {
  const guards = TASK_GUARDS[taskName];
  if (!guards) return { skip: false, reason: "" };

  const wsPath = resolve(workspacePath);

  for (const guard of guards) {
    switch (guard) {
      case "no-mission": {
        const missionPath = config.paths?.mission?.path || "MISSION.md";
        if (!existsSync(resolve(wsPath, missionPath))) {
          return { skip: true, reason: `No mission file found at ${missionPath}` };
        }
        break;
      }

      case "mission-complete": {
        // Match the old behaviour: skip if MISSION_COMPLETE.md exists
        // unless supervisor is in maintenance mode
        if (existsSync(resolve(wsPath, "MISSION_COMPLETE.md")) && config.supervisor !== "maintenance") {
          return { skip: true, reason: "Mission already complete (MISSION_COMPLETE.md exists)" };
        }
        break;
      }

      case "tests-pass": {
        const testCommand = config.testScript || "npm test";
        try {
          execSync(testCommand, { cwd: wsPath, encoding: "utf8", timeout: 120000, stdio: "pipe" });
          return { skip: true, reason: "Tests already pass — nothing to fix" };
        } catch {
          // Tests fail — proceed with fix-code
        }
        break;
      }

      case "budget-exhausted": {
        const budget = config.transformationBudget || 0;
        if (budget > 0) {
          const intentionFilepath = config.intentionBot?.intentionFilepath;
          const filePath = intentionFilepath ? resolve(wsPath, intentionFilepath) : null;
          const cumulativeCost = readCumulativeCost(filePath);
          if (cumulativeCost >= budget) {
            return { skip: true, reason: `Transformation budget exhausted (${cumulativeCost}/${budget})` };
          }
        }
        break;
      }
    }
  }

  return { skip: false, reason: "" };
}
