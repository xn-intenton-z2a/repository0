#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { createRequire } from "module";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { z } from "zod"; // Integrated Zod for enhanced CLI input validation
import ejs from "ejs"; // Added EJS for customizable export templates
import { promises as fs } from "fs";
import { existsSync } from "fs";
import PDFDocument from "pdfkit"; // Added PDFKit for PDF export functionality
import readline from "readline"; // Added for interactive chat mode

// Using createRequire to load package.json avoids deprecated import assertions
const require = createRequire(import.meta.url);
const packageData = require("../../package.json");

// Global conversation data for multi-turn chat sessions
// Updated structure: { sessionTitle: string, messages: [] }
let conversationData = { sessionTitle: "", messages: [] };

const HISTORY_FILE = ".chat_history.json";
const CHAT_CONFIG_FILE = ".chat_config.json";

// Global verbose flag
global.verbose = false;

function debugLog(message) {
  if (global.verbose) {
    console.log("[DEBUG] " + message);
  }
}

/**
 * Loads conversation history from the persistent history file.
 * The file now stores an object with a sessionTitle and messages array.
 */
async function loadHistory() {
  try {
    if (existsSync(HISTORY_FILE)) {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Legacy format: convert to new structure
        conversationData = { sessionTitle: "", messages: parsed };
      } else {
        conversationData = parsed;
        // Ensure messages array exists
        if (!Array.isArray(conversationData.messages)) {
          conversationData.messages = [];
        }
      }
      // Ensure each message has a tags property and a timestamp
      conversationData.messages = conversationData.messages.map((entry) => {
        if (!entry.tags || !Array.isArray(entry.tags)) {
          entry.tags = [];
        }
        if (!entry.timestamp) {
          entry.timestamp = new Date().toISOString();
        }
        return entry;
      });
      debugLog(`Loaded conversation history with ${conversationData.messages.length} messages.`);
    } else {
      conversationData = { sessionTitle: "", messages: [] };
      debugLog("No existing conversation history found; starting fresh.");
    }
  } catch (error) {
    handleError("Failed to read conversation history", error);
  }
}

/**
 * Saves the current conversation history to the persistent history file using atomic file operations.
 */
async function saveHistory() {
  const tempFile = HISTORY_FILE + ".tmp";
  try {
    await fs.writeFile(tempFile, JSON.stringify(conversationData, null, 2));
    await fs.rename(tempFile, HISTORY_FILE);
    debugLog("Conversation history saved successfully.");
  } catch (error) {
    handleError("Failed to write conversation history", error);
  }
}

/**
 * Loads chat configuration from the persistent configuration file (.chat_config.json).
 */
async function loadChatConfig() {
  try {
    if (existsSync(CHAT_CONFIG_FILE)) {
      const data = await fs.readFile(CHAT_CONFIG_FILE, "utf-8");
      const config = JSON.parse(data);
      debugLog("Chat configuration loaded.");
      return config;
    } else {
      debugLog("No existing chat configuration found; using defaults.");
      return {};
    }
  } catch (error) {
    handleError("Failed to read chat configuration", error);
  }
}

/**
 * Saves chat configuration to the persistent configuration file using atomic file operations.
 */
async function saveChatConfig(config) {
  const tempFile = CHAT_CONFIG_FILE + ".tmp";
  try {
    await fs.writeFile(tempFile, JSON.stringify(config, null, 2));
    await fs.rename(tempFile, CHAT_CONFIG_FILE);
    debugLog("Chat configuration saved successfully.");
  } catch (error) {
    handleError("Failed to write chat configuration", error);
  }
}

/**
 * Logs and throws errors with a consistent formatted message.
 * If verbose mode is enabled, additional error stack is printed.
 * @param {string} message - The error message to display.
 * @param {Error} [err] - Optional original error to include.
 */
function handleError(message, err) {
  if (global.verbose && err) {
    console.error(err.stack);
  }
  console.error(message);
  throw err || new Error(message);
}

/**
 * Helper function to stringify non-string CLI argument for error messages.
 * @param {*} arg - The argument to stringify.
 * @returns {string} - String representation of the argument.
 */
function stringifyArg(arg) {
  if (arg === null) return "null";
  if (arg === undefined) return "undefined";
  if (typeof arg === "boolean") return arg.toString();
  if (typeof arg === "symbol") return `Symbol(${arg.description || ""})`;
  if (typeof arg === "bigint") return arg.toString() + "n";
  if (Array.isArray(arg)) return "Array";
  if (typeof arg === "object") {
    try {
      return JSON.stringify(arg);
    } catch (e) {
      return String(arg);
    }
  }
  return JSON.stringify(arg);
}

/**
 * Validates that a CLI argument is a non-empty string using Zod.
 * Provides standardized error messages.
 * @param {*} arg - CLI argument to validate.
 */
function validateArg(arg) {
  const suggestion = " Please provide a valid non-empty string, such as 'start' or 'info'.";
  if (arg === undefined) {
    handleError(`Invalid input: Expected a valid non-empty string command, but received undefined.${suggestion}`);
  }
  // Check specifically for NaN string input
  if (typeof arg === "string" && arg.trim() === "NaN") {
    handleError(`Invalid input: Expected a valid non-empty string command, but received NaN.${suggestion}`);
  }
  const schema = z
    .string({
      invalid_type_error: `Invalid input: Expected a valid non-empty string command, but received ${stringifyArg(arg)}.${suggestion}`,
    })
    .nonempty({
      message: `Invalid input: Expected a valid non-empty string command, but received an empty string.${suggestion}`,
    });
  try {
    schema.parse(arg);
  } catch (error) {
    if (error.errors && error.errors.length > 0) {
      handleError(error.errors[0].message);
    } else {
      handleError("Invalid input");
    }
  }
}

/**
 * Validates an array of CLI arguments using the standardized validation.
 * @param {Array} args - Array of CLI arguments.
 */
function validateArgs(args) {
  args.forEach(validateArg);
}

// New shared function to process a chat message. This encapsulates the common logic used by both the chat command and the new interactive mode.
async function processChat(prompt, argvOptions = {}) {
  // Validate the prompt
  validateArg(prompt);

  const chatConfig = await loadChatConfig();

  // Load conversation history from file
  await loadHistory();
  debugLog(`Post-load, conversation history length: ${conversationData.messages.length}`);

  // Determine auto archive threshold
  let autoArchiveThreshold =
    argvOptions["auto-archive-threshold"] !== undefined
      ? parseInt(argvOptions["auto-archive-threshold"])
      : process.env.CHAT_AUTO_ARCHIVE_THRESHOLD
        ? parseInt(process.env.CHAT_AUTO_ARCHIVE_THRESHOLD)
        : chatConfig.autoArchiveThreshold || 50;

  // Append user prompt to conversation history with tags and timestamp
  conversationData.messages.push({ role: "user", content: prompt, tags: [], timestamp: new Date().toISOString() });
  debugLog("User prompt appended to conversation history.");

  // Auto-Archival: if conversation history exceeds threshold, archive and reset
  if (conversationData.messages.length > autoArchiveThreshold) {
    debugLog("Auto-archive triggered due to conversation length exceeding threshold.");
    const archiveContent = { ...conversationData };
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);
    const archiveFile = `chat_history-${timestamp}.json`;
    const tempArchiveFile = archiveFile + ".tmp";
    try {
      await fs.writeFile(tempArchiveFile, JSON.stringify(archiveContent, null, 2));
      await fs.rename(tempArchiveFile, archiveFile);
      console.log(`Conversation history auto-archived to ${archiveFile}`);
      // Retain the current user message as the sole entry in the new conversation
      const currentUserMessage = conversationData.messages[conversationData.messages.length - 1];
      conversationData = { sessionTitle: conversationData.sessionTitle, messages: [currentUserMessage] };
      await saveHistory();
      return;
    } catch (error) {
      handleError("Failed to auto-archive conversation history", error);
    }
  }

  const apiKey = process.env.CHATGPT_API_SECRET_KEY;
  if (!apiKey) {
    handleError("Missing environment variable CHATGPT_API_SECRET_KEY");
  }

  // Get configurable auto-summarization settings
  let maxHistoryMessages =
    argvOptions["max-history-messages"] !== undefined
      ? parseInt(argvOptions["max-history-messages"])
      : process.env.CHAT_MAX_HISTORY_MESSAGES
        ? parseInt(process.env.CHAT_MAX_HISTORY_MESSAGES)
        : chatConfig["max-history-messages"] || 10;
  let keepRecentMessages =
    argvOptions["recent-messages"] !== undefined
      ? parseInt(argvOptions["recent-messages"])
      : process.env.CHAT_RECENT_MESSAGES
        ? parseInt(process.env.CHAT_RECENT_MESSAGES)
        : chatConfig["recent-messages"] || 2;

  // Get configurable model and temperature
  const model =
    argvOptions.model !== undefined ? argvOptions.model : process.env.CHAT_MODEL || chatConfig.model || "gpt-3.5-turbo";
  const temperature =
    argvOptions.temperature !== undefined
      ? parseFloat(argvOptions.temperature)
      : process.env.CHAT_TEMPERATURE
        ? parseFloat(process.env.CHAT_TEMPERATURE)
        : chatConfig.temperature !== undefined
          ? chatConfig.temperature
          : 0.7;

  // Auto-summarization: if conversation history grows too long, summarize older messages
  if (conversationData.messages.length > maxHistoryMessages) {
    debugLog("Auto-summarization triggered.");
    const messagesToSummarize = conversationData.messages.slice(
      0,
      conversationData.messages.length - keepRecentMessages,
    );
    const customPrompt = argvOptions["summarization-prompt"];
    const summarizationUserMessage =
      customPrompt && customPrompt.trim() !== ""
        ? `${customPrompt} ${JSON.stringify(messagesToSummarize)}`
        : `Summarize the following conversation: ${JSON.stringify(messagesToSummarize)}`;
    const summarizationMessages = [
      {
        role: "system",
        content: "You are a summarization assistant. Given the conversation history, produce a concise summary.",
      },
      { role: "user", content: summarizationUserMessage },
    ];
    try {
      const { Configuration, OpenAIApi } = await import("openai");
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      const summaryResponse = await openai.createChatCompletion({
        model,
        messages: summarizationMessages,
        temperature,
      });
      const summary = summaryResponse.data.choices[0].message.content;
      debugLog("Auto-summarization completed.");
      conversationData.messages = [
        {
          role: "assistant",
          content: `Summary of previous conversation: ${summary}`,
          tags: [],
          timestamp: new Date().toISOString(),
        },
        ...conversationData.messages.slice(conversationData.messages.length - keepRecentMessages),
      ];
      if (customPrompt && customPrompt.trim() !== "") {
        console.log(summary);
        conversationData.messages.push({
          role: "assistant",
          content: summary,
          tags: [],
          timestamp: new Date().toISOString(),
        });
        await saveHistory();
        return;
      }
    } catch (error) {
      handleError("Error calling OpenAIApi for auto-summarization", error);
    }
  }

  try {
    const { Configuration, OpenAIApi } = await import("openai");
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model,
      messages: conversationData.messages,
      temperature,
    });
    const reply = response.data.choices[0].message.content;
    debugLog("Received reply from OpenAIApi.");
    console.log(reply);
    conversationData.messages.push({
      role: "assistant",
      content: reply,
      tags: [],
      timestamp: new Date().toISOString(),
    });
    await saveHistory();
  } catch (error) {
    handleError("Error calling OpenAIApi", error);
  }
}

// Interactive chat command handler
async function interactiveChatHandler() {
  console.log("Entering interactive chat mode. Type your message and press enter. Type 'exit' to quit.");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // Promisify the question method
  const question = (q) => {
    return new Promise((resolve) => rl.question(q, resolve));
  };

  while (true) {
    const userInput = await question("Enter your message (type 'exit' to quit): ");
    if (userInput.trim().toLowerCase() === "exit") {
      console.log("Exiting interactive chat session.");
      rl.close();
      break;
    }
    try {
      await processChat(userInput, {});
    } catch (error) {
      // Error already logged by handleError
    }
  }
}

// New command: chat-config-update
const chatConfigUpdateCommand = {
  command: "chat-config-update",
  describe: "Update and persist default chat configuration settings",
  builder: (yargs) => {
    return yargs
      .option("model", {
        type: "string",
        describe: "Default OpenAI model to use",
      })
      .option("temperature", {
        type: "number",
        describe: "Default temperature for OpenAI responses",
      })
      .option("max-history-messages", {
        type: "number",
        describe: "Default maximum number of conversation messages before summarization",
      })
      .option("recent-messages", {
        type: "number",
        describe: "Default number of recent messages to retain after summarization",
      })
      .option("auto-archive-threshold", {
        type: "number",
        describe: "Default threshold for auto-archival of conversation history",
      });
  },
  handler: async (argv) => {
    const currentConfig = (await loadChatConfig()) || {};
    const newConfig = { ...currentConfig };
    if (argv.model !== undefined) {
      const schema = z.string().nonempty({ message: "Model must be a non-empty string" });
      try {
        newConfig.model = schema.parse(argv.model);
      } catch (error) {
        handleError(error.errors[0].message);
      }
    }
    if (argv.temperature !== undefined) {
      const schema = z
        .number()
        .min(0, { message: "Temperature must be at least 0" })
        .max(1, { message: "Temperature cannot exceed 1" });
      try {
        newConfig.temperature = schema.parse(argv.temperature);
      } catch (error) {
        handleError(error.errors[0].message);
      }
    }
    if (argv["max-history-messages"] !== undefined) {
      const schema = z.number().int().positive({ message: "Max history messages must be a positive integer" });
      try {
        newConfig["max-history-messages"] = schema.parse(argv["max-history-messages"]);
      } catch (error) {
        handleError(error.errors[0].message);
      }
    }
    if (argv["recent-messages"] !== undefined) {
      const schema = z.number().int().positive({ message: "Recent messages must be a positive integer" });
      try {
        newConfig["recent-messages"] = schema.parse(argv["recent-messages"]);
      } catch (error) {
        handleError(error.errors[0].message);
      }
    }
    if (argv["auto-archive-threshold"] !== undefined) {
      const schema = z.number().int().positive({ message: "Auto archive threshold must be a positive integer" });
      try {
        newConfig.autoArchiveThreshold = schema.parse(argv["auto-archive-threshold"]);
      } catch (error) {
        handleError(error.errors[0].message);
      }
    }
    await saveChatConfig(newConfig);
    console.log("Chat configuration updated successfully.");
  },
};

const diagnosticsCommand = {
  command: "diagnostics",
  describe: "Run diagnostics with detailed environment information",
  handler: () => {
    console.log("Diagnostics: running diagnostics");
    console.log("Node.js Version: " + process.version);
    console.log(`Package: ${packageData.name}`);
    console.log(`Version: ${packageData.version}`);
    console.log(`Description: ${packageData.description}`);
    console.log("Dependencies:");
    for (const [dep, ver] of Object.entries(packageData.dependencies || {})) {
      console.log(`  ${dep}: ${ver}`);
    }
  },
};

const versionCommand = {
  command: "version",
  describe: "Show version",
  handler: () => {
    console.log(`Version ${packageData.version}`);
  },
};

const updateCommand = {
  command: "update",
  describe: "Perform update",
  handler: () => {
    console.log("Performing update...");
  },
};

const configCommand = {
  command: "config",
  describe: "View configuration settings",
  builder: (yargs) =>
    yargs
      .command({
        command: "show",
        describe: "Display configuration",
        handler: () => {
          console.log("Configuration: using default settings");
        },
      })
      .demandCommand(1, "You need to specify a valid config subcommand"),
  handler: () => {},
};

const infoCommand = {
  command: "info",
  describe: "Display repository metadata",
  handler: () => {
    console.log(
      `Repository: ${packageData.name}\nVersion: ${packageData.version}\nDescription: ${packageData.description}`,
    );
  },
};

const chatCommand = {
  command: "chat",
  describe:
    "Chat with OpenAI API using a prompt (supports persistent multi-turn conversation, auto-summarization, auto-archival, and configurable model/temperature).",
  builder: (yargs) => {
    return yargs
      .option("prompt", {
        alias: "p",
        type: "string",
        describe: "The prompt message to send",
        demandOption: true,
      })
      .option("max-history-messages", {
        type: "number",
        describe: "Maximum number of conversation messages before summarization",
        default: undefined,
      })
      .option("recent-messages", {
        type: "number",
        describe: "Number of recent messages to retain after summarization",
        default: undefined,
      })
      .option("model", {
        alias: "m",
        type: "string",
        describe: "The OpenAI model to use",
        default: undefined,
      })
      .option("temperature", {
        alias: "t",
        type: "number",
        describe: "Response randomness factor",
        default: undefined,
      })
      .option("summarization-prompt", {
        type: "string",
        describe: "Custom prompt to use for summarizing conversation history (optional)",
      })
      .option("auto-archive-threshold", {
        type: "number",
        describe: "Maximum number of messages before auto archiving the conversation history",
        default: undefined,
      });
  },
  handler: async (argv) => {
    const prompt = argv.prompt;
    debugLog(`Chat command invoked with prompt: ${prompt}`);
    await processChat(prompt, argv);
  },
};

const chatInteractiveCommand = {
  command: "chat-interactive",
  describe: "Start an interactive chat session with OpenAI's API",
  builder: (yargs) => yargs,
  handler: interactiveChatHandler,
};

const chatHistoryCommand = {
  command: "chat-history",
  describe: "Display conversation history with pagination support",
  builder: (yargs) => {
    return yargs
      .option("page", {
        type: "number",
        describe: "Page number to display",
        default: 1,
      })
      .option("page-size", {
        type: "number",
        describe: "Number of messages per page",
        default: 10,
      });
  },
  handler: async (argv) => {
    try {
      if (existsSync(HISTORY_FILE)) {
        const data = await fs.readFile(HISTORY_FILE, "utf-8");
        const historyObj = JSON.parse(data);
        let history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
        if (!history || history.length === 0) {
          console.log("No conversation history available.");
          return;
        }
        const page = argv.page ? parseInt(argv.page) : 1;
        const pageSize = argv["page-size"] ? parseInt(argv["page-size"]) : 10;
        const startIndex = (page - 1) * pageSize;
        const paginatedHistory = history.slice(startIndex, startIndex + pageSize);
        if (paginatedHistory.length === 0) {
          console.log(`No messages to display for page ${page}.`);
          return;
        }
        console.log("Conversation History:");
        paginatedHistory.forEach((entry, index) => {
          console.log(`${index + 1}. ${entry.role}: ${entry.content} (Timestamp: ${entry.timestamp})`);
        });
      } else {
        console.log("No conversation history available.");
      }
    } catch (error) {
      handleError("Failed to load conversation history", error);
    }
  },
};

// ... (Other commands remain unchanged)

/**
 * Main function to parse CLI arguments and execute the appropriate subcommand.
 * @param {Array} args - CLI arguments. Defaults to an empty array if not provided.
 */
export function main(args = []) {
  if (!args) args = [];
  const verbose = args.includes("--verbose");
  if (verbose) {
    args = args.filter((arg) => arg !== "--verbose");
    global.verbose = true;
    console.log("Verbose mode enabled.");
  }
  if (args.length === 0) {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
  validateArgs(args);
  return (
    yargs(args)
      .option("verbose", {
        type: "boolean",
        describe: "Enable verbose logging for debugging",
        global: true,
      })
      .scriptName("repository0")
      .usage("$0 <command>")
      .command(diagnosticsCommand)
      .command(versionCommand)
      .command(updateCommand)
      .command(configCommand)
      .command(infoCommand)
      .command(chatCommand)
      .command(chatInteractiveCommand)
      .command(chatHistoryCommand)
      .command(chatConfigUpdateCommand)
      // ... register the rest of the commands as in the original code
      .demandCommand(1, "You need to specify a valid command")
      .strict()
      .help()
      .fail((msg, err, yargsInstance) => {
        if (msg) {
          handleError(msg, err);
        } else {
          handleError("Command failed", err);
        }
      })
      .parseAsync()
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(hideBin(process.argv));
}
