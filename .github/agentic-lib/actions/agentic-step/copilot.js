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
 */
function buildClientOptions() {
  const copilotToken = process.env.COPILOT_GITHUB_TOKEN;
  if (copilotToken) {
    core.info("[copilot] COPILOT_GITHUB_TOKEN found — overriding subprocess env");
    const env = { ...process.env };
    // Override both GITHUB_TOKEN and GH_TOKEN so the Copilot CLI
    // subprocess uses the Copilot PAT for its auto-login flow
    env.GITHUB_TOKEN = copilotToken;
    env.GH_TOKEN = copilotToken;
    return { env };
  }
  core.info("[copilot] No COPILOT_GITHUB_TOKEN — using default auth");
  return {};
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
 * @returns {Promise<{content: string, tokensUsed: number}>}
 */
export async function runCopilotTask({ model, systemMessage, prompt, writablePaths }) {
  core.info(`[copilot] Creating client (model=${model}, promptLen=${prompt.length}, writablePaths=${writablePaths.length})`);

  const clientOptions = buildClientOptions();
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

    // Register wildcard event handler for ALL events
    session.on((event) => {
      const eventType = event?.type || "unknown";
      if (eventType === "assistant.message") {
        const preview = event?.data?.content?.substring(0, 100) || "(no content)";
        core.info(`[copilot] event=${eventType}: ${preview}...`);
      } else if (eventType === "session.idle") {
        core.info(`[copilot] event=${eventType}`);
      } else if (eventType === "session.error") {
        core.error(`[copilot] event=${eventType}: ${JSON.stringify(event?.data || event)}`);
      } else {
        core.info(`[copilot] event=${eventType}: ${JSON.stringify(event?.data || event).substring(0, 200)}`);
      }
    });

    core.info("[copilot] Sending prompt and waiting for idle...");
    const response = await session.sendAndWait({ prompt }, 300000);
    core.info(`[copilot] sendAndWait resolved`);
    const tokensUsed = response?.data?.usage?.totalTokens || 0;
    const content = response?.data?.content || "";

    return { content, tokensUsed };
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
  } catch {
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
      } catch {
        return { name: f, content: "" };
      }
    });
}

/**
 * Format the writable/read-only paths section for a prompt.
 *
 * @param {string[]} writablePaths
 * @param {string[]} [readOnlyPaths=[]]
 * @returns {string}
 */
export function formatPathsSection(writablePaths, readOnlyPaths = []) {
  return [
    "## File Paths",
    "### Writable (you may modify these)",
    writablePaths.length > 0 ? writablePaths.map((p) => `- ${p}`).join("\n") : "- (none)",
    "",
    "### Read-Only (for context only, do NOT modify)",
    readOnlyPaths.length > 0 ? readOnlyPaths.map((p) => `- ${p}`).join("\n") : "- (none)",
  ].join("\n");
}
