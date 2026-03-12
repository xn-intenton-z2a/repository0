// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/agents.js — Load agent prompt files from src/agents/

import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const agentsDir = resolve(__dirname, "..", "agents");

/**
 * Load an agent prompt file by name.
 *
 * @param {string} agentName - Agent name without extension (e.g. "agent-iterate")
 * @returns {string} The agent prompt text
 * @throws {Error} If the agent file is not found
 */
export function loadAgentPrompt(agentName) {
  const filename = agentName.endsWith(".md") ? agentName : `${agentName}.md`;
  const filePath = resolve(agentsDir, filename);
  try {
    return readFileSync(filePath, "utf8");
  } catch {
    throw new Error(`Agent prompt not found: ${filePath}`);
  }
}

/**
 * List all available agent prompt files.
 *
 * @returns {string[]} Array of agent names (without .md extension)
 */
export function listAgents() {
  return readdirSync(agentsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""))
    .sort();
}
