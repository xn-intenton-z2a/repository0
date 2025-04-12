#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { createRequire } from "module";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { z } from "zod"; // Integrated Zod for enhanced CLI input validation
import { promises as fs } from "fs";
import { existsSync } from "fs";

// Using createRequire to load package.json avoids deprecated import assertions
const require = createRequire(import.meta.url);
const packageData = require("../../package.json");

// Global conversation history for multi-turn chat sessions (in-memory copy, loaded from persistent storage)
let conversationHistory = [];

const HISTORY_FILE = ".chat_history.json";

/**
 * Loads conversation history from the persistent history file.
 */
async function loadHistory() {
  try {
    if (existsSync(HISTORY_FILE)) {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      conversationHistory = JSON.parse(data);
    } else {
      conversationHistory = [];
    }
  } catch (error) {
    handleError("Failed to read conversation history", error);
  }
}

/**
 * Saves the current conversation history to the persistent history file using atomic file operations.
 * Writes to a temporary file and then renames it to ensure data integrity during concurrent operations.
 */
async function saveHistory() {
  const tempFile = HISTORY_FILE + ".tmp";
  try {
    await fs.writeFile(tempFile, JSON.stringify(conversationHistory, null, 2));
    await fs.rename(tempFile, HISTORY_FILE);
  } catch (error) {
    handleError("Failed to write conversation history", error);
  }
}

/**
 * Logs and throws errors with a consistent formatted message.
 * @param {string} message - The error message to display.
 * @param {Error} [err] - Optional original error to include.
 */
function handleError(message, err) {
  // Log only the message for clearer output in tests
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
  if (typeof arg === "symbol") return `Symbol(${arg.description || ''})`;
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
 * Provides standardized error messages for various invalid inputs such as booleans, null, undefined, objects, arrays, symbols, and bigints.
 * The error message always follows the pattern: 
 * "Invalid input: Expected a valid non-empty string command, but received <value>. Please provide a valid non-empty string, such as 'start' or 'info'."
 *
 * @param {*} arg - CLI argument to validate.
 */
function validateArg(arg) {
  const suggestion = " Please provide a valid non-empty string, such as 'start' or 'info'.";
  // Explicitly check for undefined to provide a custom error message
  if (arg === undefined) {
    handleError(`Invalid input: Expected a valid non-empty string command, but received undefined.${suggestion}`);
  }
  const schema = z.string({
    invalid_type_error: `Invalid input: Expected a valid non-empty string command, but received ${stringifyArg(arg)}.${suggestion}`
  }).nonempty({
    message: `Invalid input: Expected a valid non-empty string command, but received an empty string.${suggestion}`
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

// Modular command definitions

/**
 * Diagnostics command: Runs diagnostics with detailed environment information.
 */
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
  }
};

/**
 * Version command: Displays the current version.
 */
const versionCommand = {
  command: "version",
  describe: "Show version",
  handler: () => {
    console.log(`Version ${packageData.version}`);
  }
};

/**
 * Update command: Initiates an update.
 */
const updateCommand = {
  command: "update",
  describe: "Perform update",
  handler: () => {
    console.log("Performing update...");
  }
};

/**
 * Config command: Displays configuration settings. Uses the 'show' subcommand.
 */
const configCommand = {
  command: "config",
  describe: "View configuration settings",
  builder: (yargs) => {
    return yargs.command({
      command: "show",
      describe: "Display configuration",
      handler: () => {
        console.log("Configuration: using default settings");
      }
    }).demandCommand(1, "You need to specify a valid config subcommand");
  },
  handler: () => {}
};

/**
 * Info command: Displays repository metadata.
 */
const infoCommand = {
  command: "info",
  describe: "Display repository metadata",
  handler: () => {
    console.log(`Repository: ${packageData.name}\nVersion: ${packageData.version}\nDescription: ${packageData.description}`);
  }
};

/**
 * Chat command: Interact with OpenAI API using a prompt. Supports persistent multi-turn conversations.
 */
const chatCommand = {
  command: "chat",
  describe: "Chat with OpenAI API using a prompt (supports persistent multi-turn conversation and auto-summarizes long histories). Conversation history is saved using atomic file operations.",
  builder: (yargs) => {
    return yargs
      .option("prompt", {
        alias: "p",
        type: "string",
        describe: "The prompt message to send",
        demandOption: true
      })
      .option("max-history-messages", {
        type: "number",
        describe: "Maximum number of conversation messages before summarization",
        default: 10
      })
      .option("recent-messages", {
        type: "number",
        describe: "Number of recent messages to retain after summarization",
        default: 2
      });
  },
  handler: async (argv) => {
    const prompt = argv.prompt;
    // Validate the prompt
    validateArg(prompt);
    
    // Load conversation history from file
    await loadHistory();

    const apiKey = process.env.CHATGPT_API_SECRET_KEY;
    if (!apiKey) {
      handleError("Missing environment variable CHATGPT_API_SECRET_KEY");
    }

    // Append user prompt to conversation history
    conversationHistory.push({ role: "user", content: prompt });

    // Dynamically import the OpenAI module
    const { Configuration, OpenAIApi } = await import("openai");
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    // Get configurable auto-summarization settings from CLI options or environment variables
    let maxHistoryMessages = parseInt(argv["max-history-messages"]);
    if (isNaN(maxHistoryMessages)) {
      maxHistoryMessages = process.env.CHAT_MAX_HISTORY_MESSAGES ? parseInt(process.env.CHAT_MAX_HISTORY_MESSAGES) : 10;
    }
    let keepRecentMessages = parseInt(argv["recent-messages"]);
    if (isNaN(keepRecentMessages)) {
      keepRecentMessages = process.env.CHAT_RECENT_MESSAGES ? parseInt(process.env.CHAT_RECENT_MESSAGES) : 2;
    }

    // Auto-summarization: if conversation history grows too long, summarize older messages
    if (conversationHistory.length > maxHistoryMessages) {
      const messagesToSummarize = conversationHistory.slice(0, conversationHistory.length - keepRecentMessages);
      const summarizationMessages = [
        { role: "system", content: "You are a summarization assistant. Given the conversation history, produce a concise summary." },
        { role: "user", content: `Summarize the following conversation: ${JSON.stringify(messagesToSummarize)}` }
      ];
      try {
        const summaryResponse = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: summarizationMessages
        });
        const summary = summaryResponse.data.choices[0].message.content;
        conversationHistory = [
          { role: "assistant", content: `Summary of previous conversation: ${summary}` },
          ...conversationHistory.slice(conversationHistory.length - keepRecentMessages)
        ];
      } catch (error) {
        handleError("Error calling OpenAI API for auto-summarization", error);
      }
    }

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationHistory
      });
      const reply = response.data.choices[0].message.content;
      console.log(reply);
      // Append assistant's reply to the conversation history
      conversationHistory.push({ role: "assistant", content: reply });
      // Save updated conversation history to persistent file with atomic operation
      await saveHistory();
    } catch (error) {
      handleError("Error calling OpenAI API", error);
    }
  }
};

/**
 * Chat History command: Displays the conversation history in a formatted manner.
 */
const chatHistoryCommand = {
  command: "chat-history",
  describe: "Display conversation history",
  handler: async () => {
    try {
      if (existsSync(HISTORY_FILE)) {
        const data = await fs.readFile(HISTORY_FILE, "utf-8");
        const history = JSON.parse(data);
        if (!history || history.length === 0) {
          console.log("No conversation history available.");
        } else {
          console.log("Conversation History:");
          history.forEach((entry, index) => {
            console.log(`${index + 1}. ${entry.role}: ${entry.content}`);
          });
        }
      } else {
        console.log("No conversation history available.");
      }
    } catch (error) {
      handleError("Failed to load conversation history", error);
    }
  }
};

/**
 * Chat Summarize command: Summarizes the conversation history using OpenAI API or built-in logic.
 */
const chatSummarizeCommand = {
  command: "chat-summarize",
  describe: "Summarize the conversation history",
  handler: async () => {
    try {
      if (!existsSync(HISTORY_FILE)) {
        console.log("No conversation history to summarize.");
        return;
      }
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const history = JSON.parse(data);
      if (!history || history.length === 0) {
        console.log("No conversation history to summarize.");
        return;
      }

      const apiKey = process.env.CHATGPT_API_SECRET_KEY;
      if (!apiKey) {
        handleError("Missing environment variable CHATGPT_API_SECRET_KEY");
      }

      // Prepare a summarization prompt
      const summarizationMessages = [
        { role: "system", content: "You are a summarization assistant. Given the conversation history, produce a concise summary." },
        { role: "user", content: `Summarize the following conversation: ${JSON.stringify(history)}` }
      ];

      const { Configuration, OpenAIApi } = await import("openai");
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);

      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: summarizationMessages
        });
        const summary = response.data.choices[0].message.content;
        console.log(summary);
      } catch (error) {
        handleError("Error calling OpenAI API for summarization", error);
      }
    } catch (error) {
      handleError("Failed to summarize conversation history", error);
    }
  }
};

/**
 * Chat Search command: Searches the conversation history for a given query keyword.
 */
const chatSearchCommand = {
  command: "chat-search",
  describe: "Search conversation history for a query keyword",
  builder: (yargs) => {
    return yargs.option("query", {
      alias: "q",
      type: "string",
      describe: "The query keyword to search in conversation history",
      demandOption: true
    });
  },
  handler: async (argv) => {
    const query = argv.query;
    validateArg(query);
    if (!existsSync(HISTORY_FILE)) {
      console.log("No conversation history available.");
      return;
    }
    let history;
    try {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      history = JSON.parse(data);
    } catch (e) {
      console.log("No conversation history available.");
      return;
    }
    if (!history || history.length === 0) {
      console.log("No conversation history available.");
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = history.filter(entry =>
      (entry.role && String(entry.role).toLowerCase().includes(lowerQuery)) ||
      (entry.content && String(entry.content).toLowerCase().includes(lowerQuery))
    );
    if (results.length === 0) {
      console.log(`No results found for query: "${query}"`);
    } else {
      console.log("Search Results:");
      results.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.role}: ${entry.content}`);
      });
    }
  }
};

/**
 * Chat Export command: Exports the conversation history to a markdown file.
 */
const chatExportCommand = {
  command: "chat-export",
  describe: "Export conversation history to a markdown file",
  handler: async () => {
    try {
      if (!existsSync(HISTORY_FILE)) {
        console.log("No conversation history available to export.");
        return;
      }
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const history = JSON.parse(data);
      if (!history || history.length === 0) {
        console.log("No conversation history available to export.");
        return;
      }
      let mdContent = "# Conversation History\n\n";
      history.forEach((entry, index) => {
        mdContent += `**${index + 1}. ${entry.role}**: ${entry.content}\n\n`;
      });
      await fs.writeFile("chat_history.md", mdContent);
      console.log("Conversation history exported to chat_history.md");
    } catch (error) {
      handleError("Failed to export conversation history", error);
    }
  }
};

/**
 * Main function to parse CLI arguments and execute the appropriate subcommand.
 * Logs provided arguments (or default empty array) and validates inputs for robustness.
 * @param {Array} args - CLI arguments. Defaults to an empty array if not provided.
 */
export function main(args = []) {
  if (!args) args = [];
  if (args.length === 0) {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
  validateArgs(args);
  return yargs(args)
    .scriptName("repository0")
    .usage("$0 <command>")
    .command(diagnosticsCommand)
    .command(versionCommand)
    .command(updateCommand)
    .command(configCommand)
    .command(infoCommand)
    .command(chatCommand)
    .command(chatHistoryCommand)
    .command(chatSummarizeCommand)
    .command(chatSearchCommand)
    .command(chatExportCommand)
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
    .parseAsync();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(hideBin(process.argv));
}
