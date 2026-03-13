// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/session.js — Copilot SDK session management (shared between Actions + CLI)
//
// Ported from src/actions/agentic-step/copilot.js with logger abstraction
// replacing direct @actions/core imports.

import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join } from "path";
import { defaultLogger } from "./logger.js";

// Models known to support the reasoningEffort SessionConfig parameter.
const MODELS_SUPPORTING_REASONING_EFFORT = new Set(["gpt-5-mini", "o4-mini"]);

// ── Source utilities ────────────────────────────────────────────────

export function cleanSource(raw) {
  let cleaned = raw;
  cleaned = cleaned.replace(/^\/\/\s*SPDX-License-Identifier:.*\n/gm, "");
  cleaned = cleaned.replace(/^\/\/\s*Copyright.*\n/gm, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.replace(/^\s*\/\/\s*eslint-disable.*\n/gm, "");
  cleaned = cleaned.replace(/^\s*\/\*\s*eslint-disable[\s\S]*?\*\/\s*\n/gm, "");
  return cleaned.trimStart();
}

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
    if (funcMatch) { parts.push(`// function ${funcMatch[3]}() — line ${i + 1}`); continue; }
    const classMatch = l.match(/^(export\s+)?(default\s+)?class\s+(\w+)/);
    if (classMatch) { parts.push(`// class ${classMatch[3]} — line ${i + 1}`); continue; }
    const methodMatch = l.match(/^\s+(async\s+)?(\w+)\s*\([^)]*\)\s*\{/);
    if (methodMatch && !["if", "for", "while", "switch", "catch", "try"].includes(methodMatch[2])) {
      parts.push(`//   ${methodMatch[2]}() — line ${i + 1}`);
    }
  }
  return parts.join("\n");
}

// ── Issue/feature utilities ─────────────────────────────────────────

export function filterIssues(issues, options = {}) {
  const { staleDays = 30, excludeBotOnly = true, initTimestamp } = options;
  const cutoff = Date.now() - staleDays * 86400000;
  const initEpoch = initTimestamp ? new Date(initTimestamp).getTime() : 0;

  return issues.filter((issue) => {
    if (initEpoch > 0 && new Date(issue.created_at).getTime() < initEpoch) return false;
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

export function summariseIssue(issue, bodyLimit = 500) {
  const labels = (issue.labels || []).map((l) => (typeof l === "string" ? l : l.name)).join(", ") || "no labels";
  const age = Math.floor((Date.now() - new Date(issue.created_at).getTime()) / 86400000);
  const body = (issue.body || "").substring(0, bodyLimit).replace(/\n+/g, " ").trim();
  return `#${issue.number}: ${issue.title} [${labels}] (${age}d old)${body ? `\n  ${body}` : ""}`;
}

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
      if (/- \[ \]/.test(line)) remaining.push(line.replace(/^[\s-]*\[ \]\s*/, "").trim());
    }
    if (remaining.length > 0) parts.push(`Remaining: ${remaining.map((r) => `[ ] ${r}`).join(", ")}`);
  }
  return parts.join("\n");
}

// ── File utilities ──────────────────────────────────────────────────

export function readOptionalFile(filePath, limit) {
  try {
    const content = readFileSync(filePath, "utf8");
    return limit ? content.substring(0, limit) : content;
  } catch {
    return "";
  }
}

export function scanDirectory(dirPath, extensions, options = {}, logger = defaultLogger) {
  const { fileLimit = 10, contentLimit, recursive = false, sortByMtime = false, clean = false, outline = false } = options;
  const exts = Array.isArray(extensions) ? extensions : [extensions];
  if (!existsSync(dirPath)) return [];

  const allFiles = readdirSync(dirPath, recursive ? { recursive: true } : undefined).filter((f) =>
    exts.some((ext) => String(f).endsWith(ext)),
  );

  if (sortByMtime) {
    allFiles.sort((a, b) => {
      try { return statSync(join(dirPath, String(b))).mtimeMs - statSync(join(dirPath, String(a))).mtimeMs; }
      catch { return 0; }
    });
  }

  const clipped = allFiles.slice(0, fileLimit);
  if (allFiles.length > fileLimit) {
    logger.info(`[scanDirectory] Clipped ${dirPath}: ${allFiles.length} files, returning ${fileLimit}`);
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
      } else {
        content = contentLimit ? raw.substring(0, contentLimit) : raw;
      }
      return { name: fileName, content };
    } catch {
      return { name: fileName, content: "" };
    }
  });
}

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

// ── Narrative ───────────────────────────────────────────────────────

export function extractNarrative(content, fallback) {
  if (!content) return fallback || "";
  const match = content.match(/\[NARRATIVE\]\s*(.+)/);
  if (match) return match[1].trim();
  return fallback || "";
}

export const NARRATIVE_INSTRUCTION =
  "\n\nAfter completing your task, end your response with a line starting with [NARRATIVE] followed by one plain English sentence describing what you did and why, for the activity log.";

// ── Auth ────────────────────────────────────────────────────────────

export function buildClientOptions(githubToken, logger = defaultLogger) {
  const copilotToken = githubToken || process.env.COPILOT_GITHUB_TOKEN;
  if (!copilotToken) {
    throw new Error("COPILOT_GITHUB_TOKEN is required. Set it in your environment.");
  }
  logger.info("[copilot] COPILOT_GITHUB_TOKEN found — overriding subprocess env");
  const env = { ...process.env };
  env.GITHUB_TOKEN = copilotToken;
  env.GH_TOKEN = copilotToken;
  return { env };
}

// ── Tuning helpers ──────────────────────────────────────────────────

export function supportsReasoningEffort(model) {
  return MODELS_SUPPORTING_REASONING_EFFORT.has(model);
}

export function logTuningParam(param, value, profileName, model, clip, logger = defaultLogger) {
  const clipInfo = clip ? ` (requested=${clip.requested}, available=${clip.available})` : "";
  logger.info(`[tuning] ${param}=${value} profile=${profileName} model=${model}${clipInfo}`);
}

// ── Rate limit ──────────────────────────────────────────────────────

export function isRateLimitError(err) {
  if (!err || typeof err !== "object") return false;
  const status = err.status ?? err.statusCode ?? err.code;
  if (status === 429 || status === "429") return true;
  const msg = (err.message || "").toLowerCase();
  return msg.includes("429") || msg.includes("too many requests") || msg.includes("rate limit");
}

export function retryDelayMs(err, attempt, baseDelayMs = 60000) {
  const retryAfterHeader = err?.headers?.["retry-after"] ?? err?.retryAfter ?? err?.response?.headers?.["retry-after"];
  if (retryAfterHeader != null) {
    const parsed = Number(retryAfterHeader);
    if (!isNaN(parsed) && parsed > 0) return parsed * 1000;
  }
  return baseDelayMs * Math.pow(2, attempt);
}

