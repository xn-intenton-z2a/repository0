// tools.js — Shared tool definitions for agentic-step task handlers
//
// Defines file I/O and shell tools using the Copilot SDK's defineTool().
// The agent has no built-in filesystem access — these tools give it the
// ability to read, write, list files, and run commands.

import { defineTool } from "@github/copilot-sdk";
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { dirname, resolve } from "path";
import { isPathWritable } from "./safety.js";
import * as core from "@actions/core";

/**
 * Create the standard set of agent tools.
 *
 * @param {string[]} writablePaths - Paths the agent is allowed to write to
 * @returns {import('@github/copilot-sdk').Tool[]} Array of tools for createSession()
 */
export function createAgentTools(writablePaths) {
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
      core.info(`[tool] read_file: ${resolved}`);
      if (!existsSync(resolved)) {
        return { error: `File not found: ${resolved}` };
      }
      try {
        const content = readFileSync(resolved, "utf8");
        return { content };
      } catch (err) {
        return { error: `Failed to read ${resolved}: ${err.message}` };
      }
    },
  });

  const writeFile = defineTool("write_file", {
    description:
      "Write content to a file. The file will be created if it does not exist. Parent directories will be created automatically. Only writable paths are allowed.",
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
      core.info(`[tool] write_file: ${resolved}`);
      if (!isPathWritable(resolved, writablePaths) && !isPathWritable(path, writablePaths)) {
        return { error: `Path is not writable: ${path}. Writable paths: ${writablePaths.join(", ")}` };
      }
      try {
        const dir = dirname(resolved);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        writeFileSync(resolved, content, "utf8");
        return { success: true, path: resolved };
      } catch (err) {
        return { error: `Failed to write ${resolved}: ${err.message}` };
      }
    },
  });

  const listFiles = defineTool("list_files", {
    description: "List files and directories at the given path. Returns names with a trailing / for directories.",
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
      core.info(`[tool] list_files: ${resolved} (recursive=${!!recursive})`);
      if (!existsSync(resolved)) {
        return { error: `Directory not found: ${resolved}` };
      }
      try {
        const entries = readdirSync(resolved, { withFileTypes: true, recursive: !!recursive });
        const names = entries.map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
        return { files: names };
      } catch (err) {
        return { error: `Failed to list ${resolved}: ${err.message}` };
      }
    },
  });

  const runCommand = defineTool("run_command", {
    description:
      "Run a shell command and return its stdout and stderr. Use this to run tests, build, lint, or inspect the environment.",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "The shell command to execute" },
        cwd: { type: "string", description: "Working directory for the command (default: current directory)" },
      },
      required: ["command"],
    },
    handler: ({ command, cwd }) => {
      const workDir = cwd ? resolve(cwd) : process.cwd();
      core.info(`[tool] run_command: ${command} (cwd=${workDir})`);
      try {
        const stdout = execSync(command, {
          cwd: workDir,
          encoding: "utf8",
          timeout: 120000,
          maxBuffer: 1024 * 1024,
        });
        return { stdout, exitCode: 0 };
      } catch (err) {
        return {
          stdout: err.stdout || "",
          stderr: err.stderr || "",
          exitCode: err.status || 1,
          error: err.message,
        };
      }
    },
  });

  return [readFile, writeFile, listFiles, runCommand];
}
