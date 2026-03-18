// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/copilot-session.js — Single-session Copilot SDK runner
//
// Replaces the old multi-session runIterationLoop with a single persistent
// Copilot SDK session that drives its own tool loop. Hooks provide
// observability and budget control.
//
// Phase 1b: Full tool set, writable-path safety, narrative extraction,
// rate-limit retry, config-driven context.

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";
import { defaultLogger } from "./logger.js";
import { getSDK } from "./sdk.js";
import { createAgentTools, isPathWritable } from "./tools.js";
import { readOptionalFile, extractNarrative, NARRATIVE_INSTRUCTION, isRateLimitError, retryDelayMs } from "./session.js";

/**
 * Format tool arguments for human-readable logging.
 */
function formatToolArgs(toolName, args) {
  if (!args) return "";
  switch (toolName) {
    case "view":
      return args.filePath ? ` → ${args.filePath}` : (args.path ? ` → ${args.path}` : "");
    case "bash":
      return args.command ? ` → ${args.command.substring(0, 120)}` : "";
    case "write_file":
    case "create_file":
    case "edit_file":
      return args.file_path ? ` → ${args.file_path}` : (args.path ? ` → ${args.path}` : "");
    case "read_file":
      return args.file_path ? ` → ${args.file_path}` : (args.path ? ` → ${args.path}` : "");
    case "run_tests":
      return "";
    case "run_command":
      return args.command ? ` → ${args.command.substring(0, 120)}` : "";
    case "list_files":
      return args.path ? ` → ${args.path}` : "";
    case "report_intent":
      return args.intent ? ` → "${args.intent.substring(0, 80)}"` : "";
    default: {
      // Generic: show first string-valued arg
      const firstVal = Object.values(args).find((v) => typeof v === "string");
      return firstVal ? ` → ${firstVal.substring(0, 100)}` : "";
    }
  }
}

/**
 * Run a hybrid iteration: single Copilot SDK session drives mission to completion.
 *
 * @param {Object} options
 * @param {string} options.workspacePath - Path to the workspace
 * @param {string} [options.model="gpt-5-mini"] - Copilot SDK model
 * @param {string} [options.githubToken] - COPILOT_GITHUB_TOKEN
 * @param {Object} [options.tuning] - Tuning config (reasoningEffort, infiniteSessions)
 * @param {number} [options.timeoutMs=600000] - Session timeout
 * @param {string} [options.agentPrompt] - Agent system prompt (loaded from agent .md file)
 * @param {string} [options.userPrompt] - Override user prompt (instead of default mission prompt)
 * @param {string[]} [options.writablePaths] - Writable paths for tool safety (default: workspace)
 * @param {number} [options.maxRetries=2] - Max retries on rate-limit errors
 * @param {number} [options.maxToolCalls] - Max tool calls before graceful stop (undefined = unlimited)
 * @param {Function} [options.createTools] - (defineTool, writablePaths, logger) => Tool[] — custom tool factory
 * @param {string[]} [options.excludedTools] - Tool names to exclude from the session
 * @param {Array} [options.attachments] - File/directory attachments for sendAndWait
 * @param {Object} [options.logger]
 * @returns {Promise<HybridResult>}
 */
export async function runCopilotSession({
  workspacePath,
  model = "gpt-5-mini",
  githubToken,
  tuning = {},
  timeoutMs,
  agentPrompt,
  userPrompt,
  writablePaths,
  maxRetries = 2,
  maxToolCalls,
  createTools,
  excludedTools,
  attachments,
  logger = defaultLogger,
}) {
  const { CopilotClient, approveAll, defineTool } = await getSDK();

  const copilotToken = githubToken || process.env.COPILOT_GITHUB_TOKEN;
  if (!copilotToken) {
    throw new Error("COPILOT_GITHUB_TOKEN is required. Set it in your environment.");
  }

  const wsPath = resolve(workspacePath);

  // W11: Session timeout — defaults to 480s (8 min), leaving 2 min headroom
  // below the 10-min workflow step timeout for graceful shutdown.
  // Callers can override via timeoutMs parameter or tuning.sessionTimeoutMs.
  const effectiveTimeoutMs = timeoutMs || tuning.sessionTimeoutMs || 480000;

  // ── Writable paths ──────────────────────────────────────────────────
  // Default: entire workspace is writable (local CLI mode)
  const effectiveWritablePaths = writablePaths || [wsPath + "/"];

  // ── Read mission context (only if no userPrompt override) ─────────
  let missionText;
  let initialTestOutput;
  if (!userPrompt) {
    const missionPath = resolve(wsPath, "MISSION.md");
    missionText = existsSync(missionPath) ? readFileSync(missionPath, "utf8") : "No MISSION.md found";

    try {
      initialTestOutput = execSync("npm test 2>&1", { cwd: wsPath, encoding: "utf8", timeout: 120000 });
    } catch (err) {
      initialTestOutput = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
    }
  }

  // ── Metrics ─────────────────────────────────────────────────────────
  const metrics = {
    toolCalls: [],
    testRuns: 0,
    filesWritten: new Set(),
    errors: [],
    startTime: Date.now(),
  };

  // ── Define run_tests tool ───────────────────────────────────────────
  const runTestsTool = defineTool("run_tests", {
    description: "Run the test suite (npm test) and return pass/fail with output. Call this after making changes to verify correctness.",
    parameters: { type: "object", properties: {}, required: [] },
    handler: async () => {
      metrics.testRuns++;
      try {
        const stdout = execSync("npm test 2>&1", { cwd: wsPath, encoding: "utf8", timeout: 120000 });
        return { textResultForLlm: `TESTS PASSED:\n${stdout}`, resultType: "success" };
      } catch (err) {
        const output = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
        return { textResultForLlm: `TESTS FAILED:\n${output}`, resultType: "success" };
      }
    },
  });

  // ── Build full tool set ─────────────────────────────────────────────
  // 4 standard tools (read_file, write_file, list_files, run_command) + run_tests + custom
  const agentTools = createAgentTools(effectiveWritablePaths, logger, defineTool);
  const customTools = createTools ? createTools(defineTool, effectiveWritablePaths, logger) : [];
  const allTools = [...agentTools, runTestsTool, ...customTools];

  // ── Build system prompt with narrative instruction ─────────────────
  const basePrompt = agentPrompt || [
    "You are an autonomous code transformation agent.",
    "Your workspace is the current working directory.",
    "Implement the MISSION described in the user prompt.",
    "Read existing code, write implementations and tests, then run run_tests to verify.",
    "Keep going until all tests pass or you've exhausted your options.",
  ].join("\n");
  const systemPrompt = basePrompt + NARRATIVE_INSTRUCTION;

  // ── Session config ─────────────────────────────────────────────────
  logger.info(`[agentic-lib] Creating session (model=${model}, workspace=${wsPath}, timeout=${Math.round(effectiveTimeoutMs / 1000)}s)`);

  const client = new CopilotClient({
    env: { ...process.env, GITHUB_TOKEN: copilotToken, GH_TOKEN: copilotToken },
  });

  const sessionConfig = {
    model,
    systemMessage: { mode: "append", content: systemPrompt },
    tools: allTools,
    onPermissionRequest: approveAll,
    workingDirectory: wsPath,
    ...(excludedTools && excludedTools.length > 0 ? { excludedTools } : {}),
    hooks: {
      onPreToolUse: (input) => {
        // Enforce tool-call budget
        if (maxToolCalls && metrics.toolCalls.length >= maxToolCalls) {
          logger.warning(`  [tool] Budget reached (${maxToolCalls} calls) — denying ${input.toolName}`);
          return { permissionDecision: "deny", permissionDecisionReason: `Tool call budget exhausted (${maxToolCalls} max). Wrap up your work.` };
        }
        const n = metrics.toolCalls.length + 1;
        const elapsed = ((Date.now() - metrics.startTime) / 1000).toFixed(0);
        metrics.toolCalls.push({ tool: input.toolName, time: Date.now(), args: input.toolArgs });
        const detail = formatToolArgs(input.toolName, input.toolArgs);
        logger.info(`  [tool #${n} +${elapsed}s] ${input.toolName}${detail}`);
      },
      onPostToolUse: (input) => {
        const hookOutput = {};

        if (/write|edit|create/i.test(input.toolName)) {
          const path = input.toolArgs?.file_path || input.toolArgs?.path || "unknown";
          metrics.filesWritten.add(path);
          logger.info(`    → wrote ${path}`);
        }

        // Truncate large read_file results to prevent context overflow
        if (input.toolName === "read_file" || input.toolName === "view") {
          const resultText = input.toolResult?.textResultForLlm || "";
          const MAX_READ_CHARS = tuning.maxReadChars || 20000;
          if (resultText.length > MAX_READ_CHARS) {
            hookOutput.modifiedResult = {
              ...input.toolResult,
              textResultForLlm: resultText.substring(0, MAX_READ_CHARS) + `\n... (truncated from ${resultText.length} chars)`,
            };
            logger.info(`    → truncated read_file output: ${resultText.length} → ${MAX_READ_CHARS} chars`);
          }
        }

        if (input.toolName === "run_tests" || input.toolName === "run_command" || input.toolName === "bash") {
          const result = input.toolResult?.textResultForLlm || input.toolResult || "";
          const resultStr = typeof result === "string" ? result : JSON.stringify(result);
          const passed = /TESTS PASSED|passed|✓|0 fail/i.test(resultStr);
          const failed = /TESTS FAILED|failed|✗|FAIL/i.test(resultStr);
          if (passed && !failed) {
            logger.info(`    → tests PASSED`);
          } else if (failed) {
            const failMatch = resultStr.match(/(\d+)\s*(failed|fail)/i);
            logger.info(`    → tests FAILED${failMatch ? ` (${failMatch[1]} failures)` : ""}`);
            // Inject guidance when tests fail
            hookOutput.additionalContext = "Focus on the failing tests. Read the test file to understand expectations before changing source code.";
          }
        }

        return Object.keys(hookOutput).length > 0 ? hookOutput : undefined;
      },
      onErrorOccurred: (input) => {
        metrics.errors.push({ error: input.error, context: input.errorContext, time: Date.now() });
        logger.error(`  [error] ${input.errorContext}: ${input.error}`);
        if (input.recoverable) return { errorHandling: "retry", retryCount: 2 };
        return { errorHandling: "abort" };
      },
    },
  };

  // Infinite sessions for context management
  if (tuning.infiniteSessions !== false) {
    sessionConfig.infiniteSessions = { enabled: true };
  }

  // Reasoning effort
  if (tuning.reasoningEffort && tuning.reasoningEffort !== "none") {
    const SUPPORTED = new Set(["gpt-5-mini", "o4-mini"]);
    if (SUPPORTED.has(model)) {
      sessionConfig.reasoningEffort = tuning.reasoningEffort;
    }
  }

  // ── Create session with rate-limit retry ───────────────────────────
  let session;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      session = await client.createSession(sessionConfig);
      logger.info(`[agentic-lib] Session: ${session.sessionId}`);
      break;
    } catch (err) {
      if (isRateLimitError(err) && attempt < maxRetries) {
        const delayMs = retryDelayMs(err, attempt);
        logger.warning(`[agentic-lib] Rate limit on session creation — waiting ${Math.round(delayMs / 1000)}s (retry ${attempt + 1}/${maxRetries})`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        logger.error(`[agentic-lib] Failed to create session: ${err.message}`);
        await client.stop();
        throw err;
      }
    }
  }

  // ── Token tracking ──────────────────────────────────────────────────
  let tokensIn = 0;
  let tokensOut = 0;

  session.on("assistant.usage", (event) => {
    const inTok = event.data?.inputTokens || 0;
    const outTok = event.data?.outputTokens || 0;
    tokensIn += inTok;
    tokensOut += outTok;
    if (inTok || outTok) {
      logger.info(`  [tokens] +${inTok} in / +${outTok} out (cumulative: ${tokensIn} in / ${tokensOut} out)`);
    }
  });
  session.on("assistant.message", (event) => {
    const content = (event.data?.content || "").trim();
    if (content) {
      const firstLine = content.split("\n")[0];
      const preview = firstLine.length > 200 ? firstLine.substring(0, 200) + "..." : firstLine;
      logger.info(`  [assistant] ${preview}`);
    }
  });

  // ── Try autopilot mode ──────────────────────────────────────────────
  try {
    await session.rpc.mode.set({ mode: "autopilot" });
    logger.info("[agentic-lib] Autopilot mode: active");
  } catch {
    logger.info("[agentic-lib] Autopilot mode not available — using default mode");
  }

  // ── Send mission prompt ─────────────────────────────────────────────
  logger.info("[agentic-lib] Sending mission...\n");

  const prompt = userPrompt || [
    `# Mission\n\n${missionText}`,
    `# Current test state\n\n\`\`\`\n${initialTestOutput.substring(0, tuning.maxTestOutput || 4000)}\n\`\`\``,
    "",
    "Implement this mission. Read the existing source code and tests,",
    "make the required changes, run run_tests to verify, and iterate until all tests pass.",
    "",
    "Start by reading the existing files, then implement the solution.",
  ].join("\n\n");

  const t0 = Date.now();
  let response;
  let endReason = "complete";

  // Send with rate-limit retry
  const sendOptions = { prompt };
  if (attachments && attachments.length > 0) {
    sendOptions.attachments = attachments;
  }
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      response = await session.sendAndWait(sendOptions, effectiveTimeoutMs);
      break;
    } catch (err) {
      if (isRateLimitError(err) && attempt < maxRetries) {
        const delayMs = retryDelayMs(err, attempt);
        logger.warning(`[agentic-lib] Rate limit on sendAndWait — waiting ${Math.round(delayMs / 1000)}s (retry ${attempt + 1}/${maxRetries})`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        logger.error(`[agentic-lib] Session error: ${err.message}`);
        response = null;
        endReason = "error";
        break;
      }
    }
  }
  const sessionTime = (Date.now() - t0) / 1000;

  // ── Extract narrative from response ────────────────────────────────
  const agentContent = response?.data?.content || "";
  const narrative = extractNarrative(agentContent, null);

  // ── Final test run ──────────────────────────────────────────────────
  let finalTestsPassed = false;
  try {
    execSync("npm test 2>&1", { cwd: wsPath, encoding: "utf8", timeout: 120000 });
    finalTestsPassed = true;
  } catch {
    // Tests still failing
  }

  // ── Cleanup ─────────────────────────────────────────────────────────
  await client.stop();

  const totalTime = (Date.now() - metrics.startTime) / 1000;

  return {
    success: finalTestsPassed,
    testsPassed: finalTestsPassed,
    sessionTime: Math.round(sessionTime),
    totalTime: Math.round(totalTime),
    toolCalls: metrics.toolCalls.length,
    testRuns: metrics.testRuns,
    filesWritten: metrics.filesWritten.size,
    tokensIn,
    tokensOut,
    errors: metrics.errors,
    endReason,
    model,
    narrative,
    agentMessage: agentContent.substring(0, 500) || null,
  };
}
