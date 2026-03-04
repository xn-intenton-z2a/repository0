// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// copilot.js — Shared utilities for Copilot SDK task handlers
//
// Extracts repeated patterns from the 8 task handlers into reusable functions.

import { CopilotClient, approveAll } from "@github/copilot-sdk";
import { readFileSync, readdirSync, existsSync } from "fs";
import { createAgentTools } from "./tools.js";
import * as core from "@actions/core";

/**
 * Build the CopilotClient options for authentication.
 *
 * Auth strategy (in order of preference):
 * 1. COPILOT_GITHUB_TOKEN env var → override GITHUB_TOKEN/GH_TOKEN in subprocess env
 *    so the Copilot CLI's auto-login finds the PAT instead of the Actions token.
 * 2. Fall back to whatever auth is available (GITHUB_TOKEN, gh CLI login, etc.)
 *
 * Note: Passing githubToken directly to CopilotClient causes 400 on models.list.
 * Instead we override the env vars so the CLI subprocess picks up the right token
 * via its auto-login flow (useLoggedInUser: true).
 *
 * @param {string} [githubToken] - Optional token; falls back to COPILOT_GITHUB_TOKEN env var.
 */
export function buildClientOptions(githubToken) {
  const copilotToken = githubToken || process.env.COPILOT_GITHUB_TOKEN;
  if (!copilotToken) {
    throw new Error("COPILOT_GITHUB_TOKEN is required. Set it as a repository secret.");
  }
  core.info("[copilot] COPILOT_GITHUB_TOKEN found — overriding subprocess env");
  const env = { ...process.env };
  // Override both GITHUB_TOKEN and GH_TOKEN so the Copilot CLI
  // subprocess uses the Copilot PAT for its auto-login flow
  env.GITHUB_TOKEN = copilotToken;
  env.GH_TOKEN = copilotToken;
  return { env };
}

/**
 * Run a Copilot SDK session and return the response.
 * Handles the full lifecycle: create client → create session → send → stop.
 *
 * @param {Object} options
 * @param {string} options.model - Copilot SDK model name
 * @param {string} options.systemMessage - System message content
 * @param {string} options.prompt - The prompt to send
 * @param {string[]} options.writablePaths - Paths the agent may modify
 * @param {string} [options.githubToken] - Optional token; falls back to COPILOT_GITHUB_TOKEN env var.
 * @returns {Promise<{content: string, tokensUsed: number}>}
 */
export async function runCopilotTask({ model, systemMessage, prompt, writablePaths, githubToken }) {
  core.info(
    `[copilot] Creating client (model=${model}, promptLen=${prompt.length}, writablePaths=${writablePaths.length})`,
  );

  const clientOptions = buildClientOptions(githubToken);
  const client = new CopilotClient(clientOptions);

  try {
    core.info("[copilot] Creating session...");
    const session = await client.createSession({
      model,
      systemMessage: { content: systemMessage },
      tools: createAgentTools(writablePaths),
      onPermissionRequest: approveAll,
      workingDirectory: process.cwd(),
    });
    core.info(`[copilot] Session created: ${session.sessionId}`);

    // Check auth status now that client is connected
    try {
      const authStatus = await client.getAuthStatus();
      core.info(`[copilot] Auth status: ${JSON.stringify(authStatus)}`);
    } catch (authErr) {
      core.warning(`[copilot] Auth check failed: ${authErr.message}`);
    }

    // Accumulate usage from assistant.usage events (tokens are NOT on the sendAndWait response)
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCost = 0;

    // Register wildcard event handler for ALL events
    session.on((event) => {
      const eventType = event?.type || "unknown";
      if (eventType === "assistant.message") {
        const preview = event?.data?.content?.substring(0, 100) || "(no content)";
        core.info(`[copilot] event=${eventType}: ${preview}...`);
      } else if (eventType === "assistant.usage") {
        const d = event?.data || {};
        const input = d.inputTokens || 0;
        const output = d.outputTokens || 0;
        const cacheRead = d.cacheReadTokens || 0;
        const cost = d.cost || 0;
        totalInputTokens += input;
        totalOutputTokens += output;
        totalCost += cost;
        core.info(`[copilot] event=${eventType}: model=${d.model} input=${input} output=${output} cacheRead=${cacheRead} cost=${cost}`);
      } else if (eventType === "session.idle") {
        core.info(`[copilot] event=${eventType}`);
      } else if (eventType === "session.error") {
        core.error(`[copilot] event=${eventType}: ${JSON.stringify(event?.data || event)}`);
      } else {
        core.info(`[copilot] event=${eventType}: ${JSON.stringify(event?.data || event).substring(0, 200)}`);
      }
    });

    core.info("[copilot] Sending prompt and waiting for idle...");
    const response = await session.sendAndWait({ prompt }, 600000);
    core.info(`[copilot] sendAndWait resolved`);
    const tokensUsed = totalInputTokens + totalOutputTokens;
    const content = response?.data?.content || "";

    return { content, tokensUsed, inputTokens: totalInputTokens, outputTokens: totalOutputTokens, cost: totalCost };
  } finally {
    await client.stop();
  }
}

/**
 * Read a file, returning empty string on failure. For optional context files.
 *
 * @param {string} filePath - Path to read
 * @param {number} [limit] - Maximum characters to return
 * @returns {string}
 */
export function readOptionalFile(filePath, limit) {
  try {
    const content = readFileSync(filePath, "utf8");
    return limit ? content.substring(0, limit) : content;
  } catch (err) {
    core.debug(`[readOptionalFile] ${filePath}: ${err.message}`);
    return "";
  }
}

/**
 * Scan a directory for files matching an extension, returning name+content pairs.
 *
 * @param {string} dirPath - Directory to scan
 * @param {string|string[]} extensions - File extension(s) to match (e.g. '.md', ['.js', '.ts'])
 * @param {Object} [options]
 * @param {number} [options.fileLimit=10] - Max files to return
 * @param {number} [options.contentLimit] - Max chars per file content
 * @param {boolean} [options.recursive=false] - Scan recursively
 * @returns {Array<{name: string, content: string}>}
 */
export function scanDirectory(dirPath, extensions, options = {}) {
  const { fileLimit = 10, contentLimit, recursive = false } = options;
  const exts = Array.isArray(extensions) ? extensions : [extensions];

  if (!existsSync(dirPath)) return [];

  return readdirSync(dirPath, recursive ? { recursive: true } : undefined)
    .filter((f) => exts.some((ext) => f.endsWith(ext)))
    .slice(0, fileLimit)
    .map((f) => {
      try {
        const content = readFileSync(`${dirPath}${f}`, "utf8");
        return { name: f, content: contentLimit ? content.substring(0, contentLimit) : content };
      } catch (err) {
        core.debug(`[scanDirectory] ${dirPath}${f}: ${err.message}`);
        return { name: f, content: "" };
      }
    });
}

/**
 * Format the writable/read-only paths section for a prompt.
 *
 * @param {string[]} writablePaths
 * @param {string[]} [readOnlyPaths=[]]
 * @param {Object} [contextFiles] - Optional raw file contents to include
 * @param {string} [contextFiles.configToml] - Raw agentic-lib.toml text
 * @param {string} [contextFiles.packageJson] - Raw package.json text
 * @returns {string}
 */
export function formatPathsSection(writablePaths, readOnlyPaths = [], contextFiles) {
  const lines = [
    "## File Paths",
    "### Writable (you may modify these)",
    writablePaths.length > 0 ? writablePaths.map((p) => `- ${p}`).join("\n") : "- (none)",
    "",
    "### Read-Only (for context only, do NOT modify)",
    readOnlyPaths.length > 0 ? readOnlyPaths.map((p) => `- ${p}`).join("\n") : "- (none)",
  ];
  if (contextFiles?.configToml) {
    lines.push("", "### Configuration (agentic-lib.toml)", "```toml", contextFiles.configToml, "```");
  }
  if (contextFiles?.packageJson) {
    lines.push("", "### Dependencies (package.json)", "```json", contextFiles.packageJson, "```");
  }
  return lines.join("\n");
}
