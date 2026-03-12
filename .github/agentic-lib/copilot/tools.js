// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/tools.js — Shared tool definitions (Actions + CLI)
//
// Ported from src/actions/agentic-step/tools.js with logger abstraction.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { dirname, resolve } from "path";
import { defaultLogger } from "./logger.js";

/**
 * Check if a target path is within the allowed writable paths.
 */
export function isPathWritable(targetPath, writablePaths) {
  const resolvedTarget = resolve(targetPath);
  return writablePaths.some((allowed) => {
    const resolvedAllowed = resolve(allowed);
    if (resolvedTarget === resolvedAllowed) return true;
    if (allowed.endsWith("/") && resolvedTarget.startsWith(resolvedAllowed)) return true;
    if (resolvedTarget.startsWith(resolvedAllowed + "/")) return true;
    return false;
  });
}

/**
 * Create the standard set of agent tools.
 * Can accept defineTool as a parameter (for dynamic SDK import) or import it.
 *
 * @param {string[]} writablePaths
 * @param {Object} [logger]
 * @param {Function} [defineToolFn] - SDK defineTool function (optional — auto-imported if not provided)
 * @returns {Array} Array of tools for createSession()
 */
export function createAgentTools(writablePaths, logger = defaultLogger, defineToolFn) {
  // If defineTool not provided, the caller must pass it.
  // We can't dynamically import SDK here synchronously.
  const defineTool = defineToolFn;
  if (!defineTool) {
    throw new Error("createAgentTools requires defineToolFn parameter (from Copilot SDK)");
  }

  const readFile = defineTool("read_file", {
    description: "Read the contents of a file at the given path.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Absolute or relative file path to read" },
      },
      required: ["path"],
    },
    handler: ({ path }) => {
      const resolved = resolve(path);
      logger.info(`[tool] read_file: ${resolved}`);
      if (!existsSync(resolved)) return { error: `File not found: ${resolved}` };
      try {
        return { content: readFileSync(resolved, "utf8") };
      } catch (err) {
        return { error: `Failed to read ${resolved}: ${err.message}` };
      }
    },
  });

  const writeFile = defineTool("write_file", {
    description: "Write content to a file. Parent directories created automatically. Only writable paths allowed.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Absolute or relative file path to write" },
        content: { type: "string", description: "The full content to write to the file" },
      },
      required: ["path", "content"],
    },
    handler: ({ path, content }) => {
      const resolved = resolve(path);
      logger.info(`[tool] write_file: ${resolved}`);
      if (!isPathWritable(resolved, writablePaths)) {
        return { error: `Path is not writable: ${path}. Writable: ${writablePaths.join(", ")}` };
      }
      try {
        const dir = dirname(resolved);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(resolved, content, "utf8");
        return { success: true, path: resolved };
      } catch (err) {
        return { error: `Failed to write ${resolved}: ${err.message}` };
      }
    },
  });

  const listFiles = defineTool("list_files", {
    description: "List files and directories at the given path.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Directory path to list" },
        recursive: { type: "boolean", description: "Whether to list recursively (default false)" },
      },
      required: ["path"],
    },
    handler: ({ path, recursive }) => {
      const resolved = resolve(path);
      logger.info(`[tool] list_files: ${resolved}`);
      if (!existsSync(resolved)) return { error: `Directory not found: ${resolved}` };
      try {
        const entries = readdirSync(resolved, { withFileTypes: true, recursive: !!recursive });
        return { files: entries.map((e) => (e.isDirectory() ? `${e.name}/` : e.name)) };
      } catch (err) {
        return { error: `Failed to list ${resolved}: ${err.message}` };
      }
    },
  });

  const runCommand = defineTool("run_command", {
    description: "Run a shell command and return stdout/stderr.",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "The shell command to execute" },
        cwd: { type: "string", description: "Working directory (default: current)" },
      },
      required: ["command"],
    },
    handler: ({ command, cwd }) => {
      const workDir = cwd ? resolve(cwd) : process.cwd();
      logger.info(`[tool] run_command: ${command} (cwd=${workDir})`);
      const blocked = /\bgit\s+(commit|push|add|reset|checkout|rebase|merge|stash)\b/;
      if (blocked.test(command)) {
        return { error: "Git write commands are not allowed." };
      }
      try {
        const stdout = execSync(command, { cwd: workDir, encoding: "utf8", timeout: 120000, maxBuffer: 1024 * 1024 });
        return { stdout, exitCode: 0 };
      } catch (err) {
        return { stdout: err.stdout || "", stderr: err.stderr || "", exitCode: err.status || 1, error: err.message };
      }
    },
  });

  return [readFile, writeFile, listFiles, runCommand];
}
