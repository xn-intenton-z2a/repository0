// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// copilot.js — Shared utilities for Copilot SDK task handlers
//
// Extracts repeated patterns from the 8 task handlers into reusable functions.

import { CopilotClient, approveAll } from "@github/copilot-sdk";
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join } from "path";
import { createAgentTools } from "./tools.js";
import * as core from "@actions/core";

// Models known to support the reasoningEffort SessionConfig parameter.
// Updated from Copilot SDK ModelInfo.supportedReasoningEfforts (v0.1.30).
// When in doubt, omit reasoning-effort — the SDK uses its default.
const MODELS_SUPPORTING_REASONING_EFFORT = new Set(["gpt-5-mini", "o4-mini"]);

/**
 * Strip noise from source code that has zero information value.
 * Removes license headers, collapses blank lines, strips linter directives.
 *
 * @param {string} raw - Raw source code
 * @returns {string} Cleaned source code
 */
export function cleanSource(raw) {
  let cleaned = raw;
  cleaned = cleaned.replace(/^\/\/\s*SPDX-License-Identifier:.*\n/gm, "");
  cleaned = cleaned.replace(/^\/\/\s*Copyright.*\n/gm, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.replace(/^\s*\/\/\s*eslint-disable.*\n/gm, "");
  cleaned = cleaned.replace(/^\s*\/\*\s*eslint-disable[\s\S]*?\*\/\s*\n/gm, "");
  return cleaned.trimStart();
}

/**
 * Generate a structural outline of a source file using regex-based extraction.
 * Captures imports, exports, function/class declarations with line numbers.
 *
 * @param {string} raw - Raw source code
 * @param {string} filePath - File path for the header line
 * @returns {string} Structural outline
 */
export function generateOutline(raw, filePath) {
  const lines = raw.split("\n");
  const sizeKB = (raw.length / 1024).toFixed(1);
  const parts = [`// file: ${filePath} (${lines.length} lines, ${sizeKB}KB)`];

  const importSources = [];
  for (const l of lines) {
    const m = l.match(/^import\s.*from\s+["']([^"']+)["']/);
    if (m) importSources.push(m[1]);
  }
  if (importSources.length > 0) parts.push(`// imports: ${importSources.join(", ")}`);

  const exportNames = [];
  for (const l of lines) {
    const m = l.match(/^export\s+(?:default\s+)?(?:async\s+)?(?:function|class|const|let|var)\s+(\w+)/);
    if (m) exportNames.push(m[1]);
  }
  if (exportNames.length > 0) parts.push(`// exports: ${exportNames.join(", ")}`);

  parts.push("//");

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const funcMatch = l.match(/^(export\s+)?(async\s+)?function\s+(\w+)\s*\(/);
    if (funcMatch) {
      parts.push(`// function ${funcMatch[3]}() — line ${i + 1}`);
      continue;
    }
    const classMatch = l.match(/^(export\s+)?(default\s+)?class\s+(\w+)/);
    if (classMatch) {
      parts.push(`// class ${classMatch[3]} — line ${i + 1}`);
      continue;
    }
    const methodMatch = l.match(/^\s+(async\s+)?(\w+)\s*\([^)]*\)\s*\{/);
    if (methodMatch && !["if", "for", "while", "switch", "catch", "try"].includes(methodMatch[2])) {
      parts.push(`//   ${methodMatch[2]}() — line ${i + 1}`);
    }
  }

  return parts.join("\n");
}

/**
 * Filter issues by recency, init epoch, and label quality.
 *
 * @param {Array} issues - GitHub issue objects
 * @param {Object} [options]
 * @param {number} [options.staleDays=30] - Issues older than this with no activity are excluded
 * @param {boolean} [options.excludeBotOnly=true] - Exclude issues with only bot labels
 * @param {string} [options.initTimestamp] - ISO timestamp; exclude issues created before this epoch
 * @returns {Array} Filtered issues
 */
export function filterIssues(issues, options = {}) {
  const { staleDays = 30, excludeBotOnly = true, initTimestamp } = options;
  const cutoff = Date.now() - staleDays * 86400000;
  const initEpoch = initTimestamp ? new Date(initTimestamp).getTime() : 0;

  return issues.filter((issue) => {
    // Exclude issues created before the most recent init
    if (initEpoch > 0) {
      const created = new Date(issue.created_at).getTime();
      if (created < initEpoch) return false;
    }

    const lastActivity = new Date(issue.updated_at || issue.created_at).getTime();
    if (lastActivity < cutoff) return false;

    if (excludeBotOnly) {
      const labels = (issue.labels || []).map((l) => (typeof l === "string" ? l : l.name));
      const botLabels = ["automated", "stale", "bot", "wontfix"];
      if (labels.length > 0 && labels.every((l) => botLabels.includes(l))) return false;
    }

    return true;
  });
}

/**
 * Create a compact summary of an issue for inclusion in prompts.
 *
 * @param {Object} issue - GitHub issue object
 * @param {number} [bodyLimit=500] - Max chars for issue body
 * @returns {string} Compact issue summary
 */
export function summariseIssue(issue, bodyLimit = 500) {
  const labels = (issue.labels || []).map((l) => (typeof l === "string" ? l : l.name)).join(", ") || "no labels";
  const age = Math.floor((Date.now() - new Date(issue.created_at).getTime()) / 86400000);
  const body = (issue.body || "").substring(0, bodyLimit).replace(/\n+/g, " ").trim();
  return `#${issue.number}: ${issue.title} [${labels}] (${age}d old)${body ? `\n  ${body}` : ""}`;
}

/**
 * Extract a structured summary from a feature markdown file.
 *
 * @param {string} content - Feature file content
 * @param {string} fileName - Feature file name
 * @returns {string} Structured feature summary
 */
export function extractFeatureSummary(content, fileName) {
  const lines = content.split("\n");
  const title = lines.find((l) => l.startsWith("#"))?.replace(/^#+\s*/, "") || fileName;
  const checked = (content.match(/- \[x\]/gi) || []).length;
  const unchecked = (content.match(/- \[ \]/g) || []).length;
  const total = checked + unchecked;

  const parts = [`Feature: ${title}`];
  if (total > 0) {
    parts.push(`Status: ${checked}/${total} items complete`);
    const remaining = [];
    for (const line of lines) {
      if (/- \[ \]/.test(line)) {
        remaining.push(line.replace(/^[\s-]*\[ \]\s*/, "").trim());
      }
    }
    if (remaining.length > 0) {
      parts.push(`Remaining: ${remaining.map((r) => `[ ] ${r}`).join(", ")}`);
    }
  }
  return parts.join("\n");
}

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
 * Log tuning parameter application with profile context.
 *
 * @param {string} param - Parameter name
 * @param {*} value - Resolved value being applied
 * @param {string} profileName - Profile the default came from
 * @param {string} model - Model being used
 * @param {Object} [clip] - Optional clipping info { available, requested }
 */
export function logTuningParam(param, value, profileName, model, clip) {
  const clipInfo = clip
    ? ` (requested=${clip.requested}, available=${clip.available}, excess=${clip.requested - clip.available})`
    : "";
  core.info(`[tuning] ${param}=${value} profile=${profileName} model=${model}${clipInfo}`);
}

/**
 * Check if a model supports reasoningEffort.
 * Uses the static allowlist; at runtime the SDK's models.list() could be used
 * but that requires an authenticated client which isn't available at config time.
 *
 * @param {string} model - Model name
 * @returns {boolean}
 */
export function supportsReasoningEffort(model) {
  return MODELS_SUPPORTING_REASONING_EFFORT.has(model);
}

/**
 * Detect whether an error is an HTTP 429 Too Many Requests (rate limit) response.
 * The Copilot SDK may surface this as an Error with a status, statusCode, or message.
 *
 * @param {unknown} err - The error to test
 * @returns {boolean}
 */
export function isRateLimitError(err) {
  if (!err || typeof err !== "object") return false;
  const status = err.status ?? err.statusCode ?? err.code;
  if (status === 429 || status === "429") return true;
  const msg = (err.message || "").toLowerCase();
  return msg.includes("429") || msg.includes("too many requests") || msg.includes("rate limit");
}

/**
 * Extract the retry delay in milliseconds from a rate-limit error.
 * Tries the Retry-After header (seconds) first, then falls back to exponential backoff.
 *
 * @param {unknown} err - The error (may have headers or retryAfter)
 * @param {number} attempt - Zero-based attempt number (0 = first retry)
 * @param {number} [baseDelayMs=60000] - Base delay for exponential backoff (ms)
 * @returns {number} Milliseconds to wait before retrying
 */
export function retryDelayMs(err, attempt, baseDelayMs = 60000) {
  const retryAfterHeader =
    err?.headers?.["retry-after"] ?? err?.retryAfter ?? err?.response?.headers?.["retry-after"];
  if (retryAfterHeader != null) {
    const parsed = Number(retryAfterHeader);
    if (!isNaN(parsed) && parsed > 0) return parsed * 1000;
  }
  return baseDelayMs * Math.pow(2, attempt);
}

/**
 * Run a Copilot SDK session and return the response.
 * Handles the full lifecycle: create client → create session → send → stop.
 * Retries automatically on HTTP 429 rate-limit responses (up to maxRetries times).
 *
 * @param {Object} options
 * @param {string} options.model - Copilot SDK model name
 * @param {string} options.systemMessage - System message content
 * @param {string} options.prompt - The prompt to send
 * @param {string[]} options.writablePaths - Paths the agent may modify
 * @param {string} [options.githubToken] - Optional token; falls back to COPILOT_GITHUB_TOKEN env var.
 * @param {Object} [options.tuning] - Tuning config (reasoningEffort, infiniteSessions)
 * @param {string} [options.profileName] - Profile name for logging
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts on rate-limit errors
 * @returns {Promise<{content: string, tokensUsed: number}>}
 */
export async function runCopilotTask({
  model,
  systemMessage,
  prompt,
  writablePaths,
  githubToken,
  tuning,
  profileName,
  maxRetries = 3,
}) {
  const profile = profileName || "unknown";

  // Attempt 0 is the initial call; attempts 1..maxRetries are retries after 429s.
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await _runCopilotTaskOnce({ model, systemMessage, prompt, writablePaths, githubToken, tuning, profileName: profile });
    } catch (err) {
      if (isRateLimitError(err) && attempt < maxRetries) {
        const delayMs = retryDelayMs(err, attempt);
        core.warning(
          `[copilot] Rate limit (429) hit — waiting ${Math.round(delayMs / 1000)}s before retry ${attempt + 1}/${maxRetries}`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        throw err;
      }
    }
  }
  // Unreachable: loop always returns or throws, but satisfies static analysis.
  throw new Error("[copilot] runCopilotTask: all retry attempts exhausted");
}

async function _runCopilotTaskOnce({
  model,
  systemMessage,
  prompt,
  writablePaths,
  githubToken,
  tuning,
  profileName,
}) {
  const profile = profileName || "unknown";
  core.info(
    `[copilot] Creating client (model=${model}, promptLen=${prompt.length}, writablePaths=${writablePaths.length}, tuning=${tuning?.reasoningEffort || "default"}, profile=${profile})`,
  );

  const clientOptions = buildClientOptions(githubToken);
  const client = new CopilotClient(clientOptions);

  try {
    core.info("[copilot] Creating session...");
    const sessionConfig = {
      model,
      systemMessage: { content: systemMessage },
      tools: createAgentTools(writablePaths),
      onPermissionRequest: approveAll,
      workingDirectory: process.cwd(),
    };

    // Only set reasoningEffort for models that support it
    if (tuning?.reasoningEffort && tuning.reasoningEffort !== "none") {
      if (supportsReasoningEffort(model)) {
        sessionConfig.reasoningEffort = tuning.reasoningEffort;
        logTuningParam("reasoningEffort", tuning.reasoningEffort, profile, model);
      } else {
        core.info(
          `[copilot] Skipping reasoningEffort="${tuning.reasoningEffort}" — not supported by model "${model}". Only supported by: ${[...MODELS_SUPPORTING_REASONING_EFFORT].join(", ")}`,
        );
      }
    }

    if (tuning?.infiniteSessions === true) {
      sessionConfig.infiniteSessions = {};
      logTuningParam("infiniteSessions", true, profile, model);
    }

    // Log scan/context tuning params
    if (tuning?.featuresScan) logTuningParam("featuresScan", tuning.featuresScan, profile, model);
    if (tuning?.sourceScan) logTuningParam("sourceScan", tuning.sourceScan, profile, model);
    if (tuning?.sourceContent) logTuningParam("sourceContent", tuning.sourceContent, profile, model);
    if (tuning?.issuesScan) logTuningParam("issuesScan", tuning.issuesScan, profile, model);
    if (tuning?.documentSummary) logTuningParam("documentSummary", tuning.documentSummary, profile, model);
    if (tuning?.discussionComments) logTuningParam("discussionComments", tuning.discussionComments, profile, model);

    const session = await client.createSession(sessionConfig);
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
        core.info(
          `[copilot] event=${eventType}: model=${d.model} input=${input} output=${output} cacheRead=${cacheRead} cost=${cost}`,
        );
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
 * Extract a [NARRATIVE] line from an LLM response.
 * Returns the text after the tag, or a fallback summary.
 *
 * @param {string} content - Raw LLM response content
 * @param {string} [fallback] - Fallback if no [NARRATIVE] tag found
 * @returns {string} The narrative sentence
 */
export function extractNarrative(content, fallback) {
  if (!content) return fallback || "";
  const match = content.match(/\[NARRATIVE\]\s*(.+)/);
  if (match) return match[1].trim();
  return fallback || "";
}

/**
 * Narrative solicitation to append to system messages.
 * Asks the LLM to end its response with a one-sentence summary.
 */
export const NARRATIVE_INSTRUCTION =
  "\n\nAfter completing your task, end your response with a line starting with [NARRATIVE] followed by one plain English sentence describing what you did and why, for the activity log.";

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
 * @param {boolean} [options.sortByMtime=false] - Sort files by modification time (most recent first)
 * @param {boolean} [options.clean=false] - Strip source noise (license headers, blank lines, linter directives)
 * @param {boolean} [options.outline=false] - Generate structural outline when content exceeds limit
 * @returns {Array<{name: string, content: string}>}
 */
export function scanDirectory(dirPath, extensions, options = {}) {
  const { fileLimit = 10, contentLimit, recursive = false, sortByMtime = false, clean = false, outline = false } = options;
  const exts = Array.isArray(extensions) ? extensions : [extensions];

  if (!existsSync(dirPath)) return [];

  const allFiles = readdirSync(dirPath, recursive ? { recursive: true } : undefined).filter((f) =>
    exts.some((ext) => String(f).endsWith(ext)),
  );

  if (sortByMtime) {
    allFiles.sort((a, b) => {
      try {
        return statSync(join(dirPath, String(b))).mtimeMs - statSync(join(dirPath, String(a))).mtimeMs;
      } catch {
        return 0;
      }
    });
  }

  const clipped = allFiles.slice(0, fileLimit);
  if (allFiles.length > fileLimit) {
    core.info(
      `[scanDirectory] Clipped ${dirPath}: ${allFiles.length} files found, returning ${fileLimit} (excess=${allFiles.length - fileLimit})`,
    );
  }

  return clipped.map((f) => {
    const fileName = String(f);
    try {
      let raw = readFileSync(join(dirPath, fileName), "utf8");
      if (clean) raw = cleanSource(raw);

      let content;
      if (outline && contentLimit && raw.length > contentLimit) {
        const outlineText = generateOutline(raw, fileName);
        const halfLimit = Math.floor(contentLimit / 2);
        content = outlineText + "\n\n" + raw.substring(0, halfLimit);
        core.info(
          `[scanDirectory] Outlined ${fileName}: ${raw.length} chars → outline + ${halfLimit} chars`,
        );
      } else {
        content = contentLimit ? raw.substring(0, contentLimit) : raw;
        if (contentLimit && raw.length > contentLimit) {
          core.info(
            `[scanDirectory] Clipped ${fileName}: ${raw.length} chars, returning ${contentLimit} (excess=${raw.length - contentLimit})`,
          );
        }
      }
      return { name: fileName, content };
    } catch (err) {
      core.debug(`[scanDirectory] ${join(dirPath, fileName)}: ${err.message}`);
      return { name: fileName, content: "" };
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
