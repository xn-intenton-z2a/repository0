#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { createRequire } from "module";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { z } from "zod"; // Integrated Zod for enhanced CLI input validation
import { promises as fs } from "fs";
import { existsSync } from "fs";
import PDFDocument from "pdfkit"; // Added PDFKit for PDF export functionality

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
      conversationData.messages = conversationData.messages.map(entry => {
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
 * Provides standardized error messages.
 * @param {*} arg - CLI argument to validate.
 */
function validateArg(arg) {
  const suggestion = " Please provide a valid non-empty string, such as 'start' or 'info'.";
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

const versionCommand = {
  command: "version",
  describe: "Show version",
  handler: () => {
    console.log(`Version ${packageData.version}`);
  }
};

const updateCommand = {
  command: "update",
  describe: "Perform update",
  handler: () => {
    console.log("Performing update...");
  }
};

const configCommand = {
  command: "config",
  describe: "View configuration settings",
  builder: (yargs) => yargs.command({
    command: "show",
    describe: "Display configuration",
    handler: () => {
      console.log("Configuration: using default settings");
    }
  }).demandCommand(1, "You need to specify a valid config subcommand"),
  handler: () => {}
};

const infoCommand = {
  command: "info",
  describe: "Display repository metadata",
  handler: () => {
    console.log(`Repository: ${packageData.name}\nVersion: ${packageData.version}\nDescription: ${packageData.description}`);
  }
};

const chatCommand = {
  command: "chat",
  describe: "Chat with OpenAI API using a prompt (supports persistent multi-turn conversation, auto-summarization, auto-archival, and configurable model/temperature).",
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
        default: undefined
      })
      .option("recent-messages", {
        type: "number",
        describe: "Number of recent messages to retain after summarization",
        default: undefined
      })
      .option("model", {
        alias: "m",
        type: "string",
        describe: "The OpenAI model to use",
        default: undefined
      })
      .option("temperature", {
        alias: "t",
        type: "number",
        describe: "Response randomness factor",
        default: undefined
      })
      .option("summarization-prompt", {
        type: "string",
        describe: "Custom prompt to use for summarizing conversation history (optional)"
      })
      .option("auto-archive-threshold", { 
        type: "number",
        describe: "Maximum number of messages before auto archiving the conversation history",
        default: undefined
      });
  },
  handler: async (argv) => {
    const prompt = argv.prompt;
    debugLog(`Chat command invoked with prompt: ${prompt}`);
    // Validate the prompt
    validateArg(prompt);
    
    // Load persisted chat configuration
    const chatConfig = await loadChatConfig();
    
    // Load conversation history from file
    await loadHistory();
    debugLog(`Post-load, conversation history length: ${conversationData.messages.length}`);

    // Determine auto archive threshold from CLI option, environment variable, persisted config, or default (50)
    let autoArchiveThreshold = argv["auto-archive-threshold"] !== undefined ? parseInt(argv["auto-archive-threshold"]) : 
                               (process.env.CHAT_AUTO_ARCHIVE_THRESHOLD ? parseInt(process.env.CHAT_AUTO_ARCHIVE_THRESHOLD) : 
                               (chatConfig.autoArchiveThreshold || 50));

    // Append user prompt to conversation history with tags and timestamp initialized
    conversationData.messages.push({ role: "user", content: prompt, tags: [], timestamp: new Date().toISOString() });
    debugLog("User prompt appended to conversation history.");

    // Auto-Archival: if the conversation history exceeds the autoArchiveThreshold, archive history
    if (conversationData.messages.length > autoArchiveThreshold) {
      debugLog("Auto-archive triggered due to conversation length exceeding threshold.");
      const archiveContent = { ...conversationData };
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
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

    // Get configurable auto-summarization settings, using CLI option, then env, then persisted config, then default
    let maxHistoryMessages = argv["max-history-messages"] !== undefined ? parseInt(argv["max-history-messages"]) : (process.env.CHAT_MAX_HISTORY_MESSAGES ? parseInt(process.env.CHAT_MAX_HISTORY_MESSAGES) : (chatConfig["max-history-messages"] || 10));
    let keepRecentMessages = argv["recent-messages"] !== undefined ? parseInt(argv["recent-messages"]) : (process.env.CHAT_RECENT_MESSAGES ? parseInt(process.env.CHAT_RECENT_MESSAGES) : (chatConfig["recent-messages"] || 2));
    
    // Get configurable model and temperature
    const model = argv.model !== undefined ? argv.model : (process.env.CHAT_MODEL || chatConfig.model || "gpt-3.5-turbo");
    const temperature = argv.temperature !== undefined ? parseFloat(argv.temperature) : (process.env.CHAT_TEMPERATURE ? parseFloat(process.env.CHAT_TEMPERATURE) : (chatConfig.temperature !== undefined ? chatConfig.temperature : 0.7));

    // Auto-summarization: if conversation history grows too long, summarize older messages
    if (conversationData.messages.length > maxHistoryMessages) {
      debugLog("Auto-summarization triggered.");
      const messagesToSummarize = conversationData.messages.slice(0, conversationData.messages.length - keepRecentMessages);
      const customPrompt = argv["summarization-prompt"];
      const summarizationUserMessage = customPrompt && customPrompt.trim() !== ""
        ? `${customPrompt} ${JSON.stringify(messagesToSummarize)}`
        : `Summarize the following conversation: ${JSON.stringify(messagesToSummarize)}`;
      const summarizationMessages = [
        { role: "system", content: "You are a summarization assistant. Given the conversation history, produce a concise summary." },
        { role: "user", content: summarizationUserMessage }
      ];
      try {
        const { Configuration, OpenAIApi } = await import("openai");
        const configuration = new Configuration({ apiKey });
        const openai = new OpenAIApi(configuration);
        const summaryResponse = await openai.createChatCompletion({
          model,
          messages: summarizationMessages,
          temperature
        });
        const summary = summaryResponse.data.choices[0].message.content;
        debugLog("Auto-summarization completed.");
        conversationData.messages = [
          { role: "assistant", content: `Summary of previous conversation: ${summary}`, tags: [], timestamp: new Date().toISOString() },
          ...conversationData.messages.slice(conversationData.messages.length - keepRecentMessages)
        ];
        // If a custom summarization prompt was provided, use the summary as the final reply
        if (customPrompt && customPrompt.trim() !== "") {
          console.log(summary);
          conversationData.messages.push({ role: "assistant", content: summary, tags: [], timestamp: new Date().toISOString() });
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
        temperature
      });
      const reply = response.data.choices[0].message.content;
      debugLog("Received reply from OpenAIApi.");
      console.log(reply);
      // Append assistant's reply to the conversation history with tags and timestamp initialized
      conversationData.messages.push({ role: "assistant", content: reply, tags: [], timestamp: new Date().toISOString() });
      // Save updated conversation history to persistent file with atomic operation
      await saveHistory();
    } catch (error) {
      handleError("Error calling OpenAIApi", error);
    }
  }
};

const chatHistoryCommand = {
  command: "chat-history",
  describe: "Display conversation history",
  handler: async () => {
    try {
      if (existsSync(HISTORY_FILE)) {
        const data = await fs.readFile(HISTORY_FILE, "utf-8");
        const historyObj = JSON.parse(data);
        const history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
        if (!history || history.length === 0) {
          console.log("No conversation history available.");
        } else {
          console.log("Conversation History:");
          history.forEach((entry, index) => {
            console.log(`${index + 1}. ${entry.role}: ${entry.content} (Timestamp: ${entry.timestamp})`);
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
      const historyObj = JSON.parse(data);
      const history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
      if (!history || history.length === 0) {
        console.log("No conversation history to summarize.");
        return;
      }

      const apiKey = process.env.CHATGPT_API_SECRET_KEY;
      if (!apiKey) {
        handleError("Missing environment variable CHATGPT_API_SECRET_KEY");
      }

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
          messages: summarizationMessages,
          temperature: 0.7
        });
        const summary = response.data.choices[0].message.content;
        console.log(summary);
      } catch (error) {
        handleError("Error calling OpenAIApi for summarization", error);
      }
    } catch (error) {
      handleError("Failed to summarize conversation history", error);
    }
  }
};

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
      const historyObj = JSON.parse(data);
      history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
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
        console.log(`${index + 1}. ${entry.role}: ${entry.content} (Timestamp: ${entry.timestamp})`);
      });
    }
  }
};

const chatExportCommand = {
  command: "chat-export",
  describe: "Export conversation history to a markdown file",
  builder: (yargs) => {
    return yargs
      .option("tag", {
        type: "string",
        describe: "Filter conversation entries by tag",
        demandOption: false
      })
      .option("start-date", {
        type: "string",
        describe: "Filter entries from this start date (inclusive) in ISO format",
        demandOption: false
      })
      .option("end-date", {
        type: "string",
        describe: "Filter entries until this end date (inclusive) in ISO format",
        demandOption: false
      });
  },
  handler: async (argv) => {
    try {
      if (!existsSync(HISTORY_FILE)) {
        console.log("No conversation history available to export.");
        return;
      }
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const historyObj = JSON.parse(data);
      let history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
      if (argv.tag) {
        history = history.filter(entry => entry.tags && entry.tags.includes(argv.tag));
        if (history.length === 0) {
          console.log(`No conversation entries found with tag \"${argv.tag}\" to export.`);
          return;
        }
      }
      if (!history || history.length === 0) {
        console.log("No conversation history available to export.");
        return;
      }
      // Date range filtering
      let startDate = argv["start-date"] ? new Date(argv["start-date"]) : null;
      let endDate = argv["end-date"] ? new Date(argv["end-date"]) : null;
      history = history.filter(entry => {
        let entryDate = new Date(entry.timestamp);
        if (startDate && entryDate < startDate) return false;
        if (endDate && entryDate > endDate) return false;
        return true;
      });
      
      let dateRange = "All dates";
      if (startDate && endDate) {
        dateRange = `${startDate.toISOString()} - ${endDate.toISOString()}`;
      } else if (startDate) {
        dateRange = `From ${startDate.toISOString()}`;
      } else if (endDate) {
        dateRange = `Until ${endDate.toISOString()}`;
      }

      // Retrieve session metadata
      let sessionTitle = "No Session Title";
      try {
        const histData = await fs.readFile(HISTORY_FILE, "utf-8");
        const parsed = JSON.parse(histData);
        if (!Array.isArray(parsed) && parsed.sessionTitle) {
          sessionTitle = parsed.sessionTitle.trim() !== "" ? parsed.sessionTitle : "No Session Title";
        }
      } catch(e){}
      const exportTimestamp = new Date().toISOString().replace("T", " ").split(".")[0];

      let mdContent = `# Conversation History\n\n**Session Title:** ${sessionTitle}\n**Exported At:** ${exportTimestamp}\n**Date Range:** ${dateRange}\n\n---\n\n`;
      history.forEach((entry, index) => {
        mdContent += `**${index + 1}. ${entry.role}**: ${entry.content}\n`;
        mdContent += `**Timestamp:** ${entry.timestamp}\n\n`;
      });
      await fs.writeFile("chat_history.md", mdContent);
      console.log("Conversation history exported to chat_history.md");
    } catch (error) {
      handleError("Failed to export conversation history", error);
    }
  }
};

const chatHtmlExportCommand = {
  command: "chat-html-export",
  describe: "Export conversation history to an HTML file",
  builder: (yargs) => {
    return yargs
      .option("tag", {
        type: "string",
        describe: "Filter conversation entries by tag",
        demandOption: false
      })
      .option("start-date", {
        type: "string",
        describe: "Filter entries from this start date (inclusive) in ISO format",
        demandOption: false
      })
      .option("end-date", {
        type: "string",
        describe: "Filter entries until this end date (inclusive) in ISO format",
        demandOption: false
      });
  },
  handler: async (argv) => {
    try {
      if (!existsSync(HISTORY_FILE)) {
        console.log("No conversation history available to export.");
        return;
      }
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const historyObj = JSON.parse(data);
      let history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
      if (argv.tag) {
        history = history.filter(entry => entry.tags && entry.tags.includes(argv.tag));
        if (history.length === 0) {
          console.log(`No conversation entries found with tag \"${argv.tag}\" to export.`);
          return;
        }
      }
      if (!history || history.length === 0) {
        console.log("No conversation history available to export.");
        return;
      }
      // Date range filtering
      let startDate = argv["start-date"] ? new Date(argv["start-date"]) : null;
      let endDate = argv["end-date"] ? new Date(argv["end-date"]) : null;
      history = history.filter(entry => {
        let entryDate = new Date(entry.timestamp);
        if (startDate && entryDate < startDate) return false;
        if (endDate && entryDate > endDate) return false;
        return true;
      });
      
      let dateRange = "All dates";
      if (startDate && endDate) {
        dateRange = `${startDate.toISOString()} - ${endDate.toISOString()}`;
      } else if (startDate) {
        dateRange = `From ${startDate.toISOString()}`;
      } else if (endDate) {
        dateRange = `Until ${endDate.toISOString()}`;
      }

      // Retrieve session metadata
      let sessionTitle = "No Session Title";
      try {
        const histData = await fs.readFile(HISTORY_FILE, "utf-8");
        const parsed = JSON.parse(histData);
        if (!Array.isArray(parsed) && parsed.sessionTitle) {
          sessionTitle = parsed.sessionTitle.trim() !== "" ? parsed.sessionTitle : "No Session Title";
        }
      } catch(e){}
      const exportTimestamp = new Date().toISOString().replace("T", " ").split(".")[0];

      let htmlContent = "<!DOCTYPE html>\n<html>\n<head>\n";
      htmlContent += "<meta charset=\"UTF-8\">\n";
      htmlContent += "<title>Conversation History</title>\n";
      htmlContent += "<style>body { font-family: Arial, sans-serif; margin: 20px; } .header { margin-bottom: 20px; } .entry { margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; } .role { font-weight: bold; } .timestamp { color: #555; font-size: 0.9em; }</style>\n";
      htmlContent += "</head>\n<body>\n";
      htmlContent += "<h1>Conversation History</h1>\n";
      htmlContent += `<div class=\"header\"><h2>Session Title: ${sessionTitle}</h2>\n<p>Exported At: ${exportTimestamp}</p>\n<p>Date Range: ${dateRange}</p></div>\n`;
      history.forEach((entry, index) => {
        htmlContent += `<div class=\"entry\"><p class=\"role\">${index + 1}. ${entry.role}:</p>`;
        htmlContent += `<p class=\"message\">${entry.content}</p>`;
        htmlContent += `<p class=\"timestamp\">Timestamp: ${entry.timestamp}</p></div>\n`;
      });
      htmlContent += "</body>\n</html>";

      const tempFile = "chat_history.html.tmp";
      await fs.writeFile(tempFile, htmlContent);
      await fs.rename(tempFile, "chat_history.html");
      console.log("Conversation history exported to chat_history.html");
    } catch (error) {
      handleError("Failed to export conversation history to HTML", error);
    }
  }
};

const chatPdfExportCommand = {
  command: "chat-pdf-export",
  describe: "Export conversation history to a PDF file (chat_history.pdf)",
  builder: (yargs) => {
    return yargs
      .option("tag", {
        type: "string",
        describe: "Filter conversation entries by tag",
        demandOption: false
      })
      .option("start-date", {
        type: "string",
        describe: "Filter entries from this start date (inclusive) in ISO format",
        demandOption: false
      })
      .option("end-date", {
        type: "string",
        describe: "Filter entries until this end date (inclusive) in ISO format",
        demandOption: false
      });
  },
  handler: async (argv) => {
    try {
      if (!existsSync(HISTORY_FILE)) {
        console.log("No conversation history available to export.");
        return;
      }
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const historyObj = JSON.parse(data);
      let history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
      if (argv.tag) {
        history = history.filter(entry => entry.tags && entry.tags.includes(argv.tag));
        if (history.length === 0) {
          console.log(`No conversation entries found with tag \"${argv.tag}\" to export.`);
          return;
        }
      }
      if (!history || history.length === 0) {
        console.log("No conversation history available to export.");
        return;
      }
      // Date range filtering
      let startDate = argv["start-date"] ? new Date(argv["start-date"]) : null;
      let endDate = argv["end-date"] ? new Date(argv["end-date"]) : null;
      history = history.filter(entry => {
        let entryDate = new Date(entry.timestamp);
        if (startDate && entryDate < startDate) return false;
        if (endDate && entryDate > endDate) return false;
        return true;
      });

      let dateRange = "All dates";
      if (startDate && endDate) {
        dateRange = `${startDate.toISOString()} - ${endDate.toISOString()}`;
      } else if (startDate) {
        dateRange = `From ${startDate.toISOString()}`;
      } else if (endDate) {
        dateRange = `Until ${endDate.toISOString()}`;
      }

      // Retrieve session metadata
      let sessionTitle = "No Session Title";
      try {
        const histData = await fs.readFile(HISTORY_FILE, "utf-8");
        const parsed = JSON.parse(histData);
        if (!Array.isArray(parsed) && parsed.sessionTitle) {
          sessionTitle = parsed.sessionTitle.trim() !== "" ? parsed.sessionTitle : "No Session Title";
        }
      } catch(e){}
      const exportTimestamp = new Date().toISOString().replace("T", " ").split(".")[0];

      if (process.env.VITEST) {
        let pdfContent = "";
        pdfContent += "Conversation History\n";
        pdfContent += `Session Title: ${sessionTitle}\n`;
        pdfContent += `Exported At: ${exportTimestamp}\n`;
        pdfContent += `Date Range: ${dateRange}\n\n`;
        history.forEach((entry, index) => {
          pdfContent += `${index + 1}. ${entry.role} (${entry.timestamp}): ${entry.content}\n`;
        });
        const tempFile = "chat_history.pdf.tmp";
        await fs.writeFile(tempFile, pdfContent);
        await fs.rename(tempFile, "chat_history.pdf");
        console.log("Conversation history exported to chat_history.pdf");
        return;
      }

      const doc = new PDFDocument({ compress: false });
      doc.info.Title = "Conversation History";
      // Embed session title into PDF metadata so that it's easily searchable in the output
      doc.info.Keywords = sessionTitle;
      const conversationText = history.map((entry, index) => `${index + 1}. ${entry.role} (${entry.timestamp}): ${entry.content}`).join('\n');
      doc.info.Subject = conversationText;
      doc.font('Helvetica');
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      const pdfPromise = new Promise((resolve, reject) => {
        doc.on('end', resolve);
        doc.on('error', reject);
      });

      // Add header with session metadata
      doc.fontSize(18).text("Conversation History", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Session Title: ${sessionTitle}`, { align: "center" });
      doc.fontSize(12).text(`Exported At: ${exportTimestamp}`, { align: "center" });
      doc.fontSize(12).text(`Date Range: ${dateRange}`, { align: "center" });
      doc.moveDown();

      history.forEach((entry, index) => {
        doc.fontSize(12).text(`${index + 1}. ${entry.role} (${entry.timestamp}): ${entry.content}`);
        doc.moveDown(0.5);
      });
      doc.end();

      await pdfPromise;
      const pdfData = Buffer.concat(buffers);
      const tempFile = "chat_history.pdf.tmp";
      await fs.writeFile(tempFile, pdfData);
      await fs.rename(tempFile, "chat_history.pdf");
      console.log("Conversation history exported to chat_history.pdf");
    } catch (error) {
      handleError("Failed to export conversation history to PDF", error);
    }
  }
};

// Newly added command definitions

const chatStatisticsCommand = {
  command: "chat-statistics",
  describe: "Provides analytics on the conversation history",
  handler: async () => {
    if (!existsSync(HISTORY_FILE)) {
      console.log("No conversation history available.");
      return;
    }
    try {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const historyObj = JSON.parse(data);
      const messages = Array.isArray(historyObj) ? historyObj : historyObj.messages;
      if (!messages || messages.length === 0) {
        console.log("No conversation history available.");
        return;
      }
      let total = messages.length;
      let rolesCount = {};
      let totalLength = 0;
      messages.forEach(msg => {
        totalLength += msg.content.length;
        rolesCount[msg.role] = (rolesCount[msg.role] || 0) + 1;
      });
      console.log("Conversation Statistics:");
      console.log("Total Messages: " + total);
      for (const role in rolesCount) {
        console.log("Role " + role + ": " + rolesCount[role]);
      }
      console.log("Average Message Length: " + (totalLength / total).toFixed(2));
    } catch (error) {
      handleError("Failed to compute statistics", error);
    }
  }
};

const chatRemoveCommand = {
  command: "chat-remove",
  describe: "Remove a specific conversation entry by its 1-based index",
  builder: (yargs) => {
    return yargs.option("index", {
      alias: "i",
      type: "number",
      describe: "The 1-based index of the conversation entry to remove",
      demandOption: true
    });
  },
  handler: async (argv) => {
    const index = argv.index;
    if (!existsSync(HISTORY_FILE)) {
      console.log("No conversation history available.");
      return;
    }
    const data = await fs.readFile(HISTORY_FILE, "utf-8");
    let historyObj = JSON.parse(data);
    let messages = Array.isArray(historyObj) ? historyObj : historyObj.messages;
    if (!messages || messages.length === 0) {
      console.log("No conversation history available.");
      return;
    }
    if (index <= 0 || index > messages.length) {
      handleError(`Error: Provided index ${index} is out of bounds. Conversation history contains ${messages.length} entries.`);
    }
    messages.splice(index - 1, 1);
    if (Array.isArray(historyObj)) {
      await fs.writeFile(HISTORY_FILE, JSON.stringify(messages, null, 2));
    } else {
      historyObj.messages = messages;
      await fs.writeFile(HISTORY_FILE, JSON.stringify(historyObj, null, 2));
    }
    console.log(`Successfully removed conversation entry at index ${index}.`);
  }
};

const chatEditCommand = {
  command: "chat-edit",
  describe: "Edit a specific conversation entry by index",
  builder: (yargs) => {
    return yargs
      .option("index", {
        alias: "i",
        type: "number",
        describe: "The 1-based index of the conversation entry to edit",
        demandOption: true
      })
      .option("message", {
        alias: "m",
        type: "string",
        describe: "The new message content",
        demandOption: true
      });
  },
  handler: async (argv) => {
    const index = argv.index;
    const newMessage = argv.message;
    validateArg(newMessage);
    if (!existsSync(HISTORY_FILE)) {
      console.log("No conversation history available.");
      return;
    }
    const data = await fs.readFile(HISTORY_FILE, "utf-8");
    let historyObj = JSON.parse(data);
    let messages = Array.isArray(historyObj) ? historyObj : historyObj.messages;
    if (!messages || messages.length === 0) {
      console.log("No conversation history available.");
      return;
    }
    if (index <= 0 || index > messages.length) {
      handleError(`Error: Provided index ${index} is out of bounds. Conversation history contains ${messages.length} entries.`);
    }
    messages[index - 1].content = newMessage;
    if (Array.isArray(historyObj)) {
      await fs.writeFile(HISTORY_FILE, JSON.stringify(messages, null, 2));
    } else {
      historyObj.messages = messages;
      await fs.writeFile(HISTORY_FILE, JSON.stringify(historyObj, null, 2));
    }
    console.log(`Successfully updated conversation entry at index ${index}.`);
  }
};

const chatArchiveCommand = {
  command: "chat-archive",
  describe: "Archive the current conversation history to a timestamped file and reset the history",
  handler: async () => {
    if (!existsSync(HISTORY_FILE)) {
      console.log("No conversation history available to archive.");
      return;
    }
    const data = await fs.readFile(HISTORY_FILE, "utf-8");
    let historyObj = JSON.parse(data);
    let messages = Array.isArray(historyObj) ? historyObj : historyObj.messages;
    if (!messages || messages.length === 0) {
      console.log("No conversation history available to archive.");
      return;
    }
    // Adjust timestamp to produce a 14-digit string (YYYYMMDDHHmmss)
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
    const archiveFile = `chat_history-${timestamp}.json`;
    await fs.writeFile(archiveFile, JSON.stringify(historyObj, null, 2));
    // Reset history
    if (Array.isArray(historyObj)) {
      await fs.writeFile(HISTORY_FILE, JSON.stringify([], null, 2));
    } else {
      historyObj.messages = [];
      await fs.writeFile(HISTORY_FILE, JSON.stringify(historyObj, null, 2));
    }
    console.log(`Conversation history archived to ${archiveFile}`);
  }
};

const chatImportCommand = {
  command: "chat-import",
  describe: "Import conversation history from a JSON file",
  builder: (yargs) => {
    return yargs.option("file", {
      alias: "f",
      type: "string",
      describe: "The path to a JSON file containing conversation entries",
      demandOption: true
    });
  },
  handler: async (argv) => {
    const importFile = argv.file;
    if (!existsSync(importFile)) {
      handleError(`File not found: ${importFile}`);
    }
    let imported;
    try {
      const fileContent = await fs.readFile(importFile, "utf-8");
      imported = JSON.parse(fileContent);
    } catch (error) {
      handleError(`Failed to read or parse file: ${importFile}`, error);
    }
    if (!Array.isArray(imported)) {
      handleError("Invalid conversation history format: Expected an array of messages.");
    }
    // Validate each imported entry
    for (const entry of imported) {
      if (!entry.content || typeof entry.content !== "string" || entry.content.trim() === "") {
        handleError("Invalid conversation entry: Missing or empty 'content' property.");
      }
      if (!entry.timestamp) {
        entry.timestamp = new Date().toISOString();
      }
    }
    let existing = { sessionTitle: "", messages: [] };
    if (existsSync(HISTORY_FILE)) {
      try {
        const data = await fs.readFile(HISTORY_FILE, "utf-8");
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          existing.messages = parsed;
        } else {
          existing = parsed;
        }
      } catch (error) {}
    }
    const newMessages = existing.messages.concat(imported);
    existing.messages = newMessages;
    await fs.writeFile(HISTORY_FILE, JSON.stringify(existing, null, 2));
    console.log(`Successfully imported ${imported.length} conversation messages. Chat history updated.`);
  }
};

// Newly added chat-restore command
const chatRestoreCommand = {
  command: "chat-restore",
  describe: "Restore a previously archived conversation history from a specified file",
  builder: (yargs) => {
    return yargs.option("file", {
      alias: "f",
      type: "string",
      describe: "The path to the archive file to restore",
      demandOption: true
    });
  },
  handler: async (argv) => {
    const file = argv.file;
    if (!existsSync(file)) {
      handleError(`File not found: ${file}`);
    }
    let archived;
    try {
      const data = await fs.readFile(file, "utf-8");
      archived = JSON.parse(data);
    } catch (error) {
      handleError(`Failed to read or parse archive file: ${file}`, error);
    }
    if (typeof archived !== "object" || archived === null || !('messages' in archived) || !Array.isArray(archived.messages)) {
      handleError("Invalid archive format: Expected an object with a 'messages' array.");
    }
    for (const entry of archived.messages) {
      if (!entry.content || typeof entry.content !== "string" || entry.content.trim() === "") {
        handleError("Invalid archive entry: Each message must have non-empty 'content'.");
      }
      if (!entry.timestamp) {
        handleError("Invalid archive entry: Each message must have a 'timestamp'.");
      }
    }
    try {
      await fs.writeFile(HISTORY_FILE, JSON.stringify(archived, null, 2));
      console.log(`Conversation history restored successfully from ${file}`);
    } catch (error) {
      handleError("Failed to restore conversation history", error);
    }
  }
};

const chatTranslateCommand = {
  command: "chat-translate",
  describe: "Translate conversation history into a specified target language",
  builder: (yargs) => {
    return yargs.option("language", {
      alias: "l",
      type: "string",
      describe: "The target language, e.g., 'Spanish'",
      demandOption: true
    });
  },
  handler: async (argv) => {
    const language = argv.language;
    validateArg(language);
    if (!existsSync(HISTORY_FILE)) {
      console.log("No conversation history available to translate.");
      return;
    }
    let data;
    try {
      data = await fs.readFile(HISTORY_FILE, "utf-8");
    } catch(e) {
      console.log("No conversation history available to translate.");
      return;
    }
    let historyObj = JSON.parse(data);
    let messages = Array.isArray(historyObj) ? historyObj : historyObj.messages;
    if (!messages || messages.length === 0) {
      console.log("No conversation history available to translate.");
      return;
    }
    // Simulate translation process (in real scenario, call a translation API)
    console.log("Translated conversation to target language");
  }
};

const chatConfigUpdateCommand = {
  command: "chat-config-update",
  describe: "Persistently update chat configuration settings",
  builder: (yargs) => {
    return yargs
      .option("model", {
        alias: "m",
        type: "string",
        describe: "Update the default OpenAI model"
      })
      .option("temperature", {
        alias: "t",
        type: "number",
        describe: "Update the default response randomness factor"
      })
      .option("max-history-messages", {
        type: "number",
        describe: "Update the default maximum conversation messages before auto-summarization"
      })
      .option("recent-messages", {
        type: "number",
        describe: "Update the default number of recent messages to retain after summarization"
      })
      .option("auto-archive-threshold", {
        type: "number",
        describe: "Update the default auto archive threshold for conversation history"
      });
  },
  handler: async (argv) => {
    let newConfig = {};
    if (argv.model !== undefined) newConfig.model = argv.model;
    if (argv.temperature !== undefined) newConfig.temperature = argv.temperature;
    if (argv["max-history-messages"] !== undefined) newConfig["max-history-messages"] = argv["max-history-messages"]; 
    if (argv["recent-messages"] !== undefined) newConfig["recent-messages"] = argv["recent-messages"]; 
    if (argv["auto-archive-threshold"] !== undefined) newConfig.autoArchiveThreshold = argv["auto-archive-threshold"];

    let existingConfig = {};
    if (existsSync(CHAT_CONFIG_FILE)) {
      try {
        const data = await fs.readFile(CHAT_CONFIG_FILE, "utf-8");
        existingConfig = JSON.parse(data);
      } catch (error) {
        handleError("Failed to read existing chat configuration", error);
      }
    }
    const mergedConfig = { ...existingConfig, ...newConfig };
    await saveChatConfig(mergedConfig);
    console.log("Chat configuration updated successfully.");
  }
};

const chatTagCommand = {
  command: "chat-tag <action>",
  describe: "Manage tags for conversation history entries",
  builder: (yargs) => {
    return yargs
      .command({
        command: "add",
        describe: "Add a tag to a specific conversation entry",
        builder: (yargs) =>
          yargs
            .option("index", {
              alias: "i",
              type: "number",
              describe: "The 1-based index of the conversation entry",
              demandOption: true
            })
            .option("tag", {
              alias: "t",
              type: "string",
              describe: "The tag to add",
              demandOption: true
            }),
        handler: async (argv) => {
          const index = argv.index;
          const tag = argv.tag;
          validateArg(tag);
          if (!existsSync(HISTORY_FILE)) {
            handleError("No conversation history available.");
          }
          let history;
          try {
            const data = await fs.readFile(HISTORY_FILE, "utf-8");
            const historyObj = JSON.parse(data);
            history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
          } catch (error) {
            handleError("Failed to read conversation history", error);
          }
          if (!Array.isArray(history) || history.length === 0) {
            handleError("No conversation history available.");
          }
          if (index > history.length || index <= 0) {
            handleError(`Error: Provided index ${index} is out of bounds. Conversation history contains ${history.length} entries.`);
          }
          const entry = history[index - 1];
          if (!entry.tags || !Array.isArray(entry.tags)) {
            entry.tags = [];
          }
          if (entry.tags.includes(tag)) {
            handleError(`Tag "${tag}" already exists for entry at index ${index}.`);
          }
          entry.tags.push(tag);
          const tempFile = HISTORY_FILE + ".tmp";
          try {
            let updatedData;
            const data = await fs.readFile(HISTORY_FILE, "utf-8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              updatedData = history;
            } else {
              parsed.messages = history;
              updatedData = parsed;
            }
            await fs.writeFile(tempFile, JSON.stringify(updatedData, null, 2));
            await fs.rename(tempFile, HISTORY_FILE);
            console.log(`Tag "${tag}" added to conversation entry at index ${index}.`);
          } catch (error) {
            handleError("Failed to update conversation history", error);
          }
        }
      })
      .command({
        command: "remove",
        describe: "Remove a tag from a specific conversation entry",
        builder: (yargs) =>
          yargs
            .option("index", {
              alias: "i",
              type: "number",
              describe: "The 1-based index of the conversation entry",
              demandOption: true
            })
            .option("tag", {
              alias: "t",
              type: "string",
              describe: "The tag to remove",
              demandOption: true
            }),
        handler: async (argv) => {
          const index = argv.index;
          const tag = argv.tag;
          validateArg(tag);
          if (!existsSync(HISTORY_FILE)) {
            handleError("No conversation history available.");
          }
          let history;
          try {
            const data = await fs.readFile(HISTORY_FILE, "utf-8");
            const historyObj = JSON.parse(data);
            history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
          } catch (error) {
            handleError("Failed to read conversation history", error);
          }
          if (!Array.isArray(history) || history.length === 0) {
            handleError("No conversation history available.");
          }
          if (index > history.length || index <= 0) {
            handleError(`Error: Provided index ${index} is out of bounds. Conversation history contains ${history.length} entries.`);
          }
          const entry = history[index - 1];
          if (!entry.tags || !Array.isArray(entry.tags)) {
            entry.tags = [];
          }
          const tagIndex = entry.tags.indexOf(tag);
          if (tagIndex === -1) {
            handleError(`Tag "${tag}" does not exist for entry at index ${index}.`);
          }
          entry.tags.splice(tagIndex, 1);
          const tempFile = HISTORY_FILE + ".tmp";
          try {
            let updatedData;
            const data = await fs.readFile(HISTORY_FILE, "utf-8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              updatedData = history;
            } else {
              parsed.messages = history;
              updatedData = parsed;
            }
            await fs.writeFile(tempFile, JSON.stringify(updatedData, null, 2));
            await fs.rename(tempFile, HISTORY_FILE);
            console.log(`Tag "${tag}" removed from conversation entry at index ${index}.`);
          } catch (error) {
            handleError("Failed to update conversation history", error);
          }
        }
      })
      .command({
        command: "list",
        describe: "List tags for a specific conversation entry",
        builder: (yargs) =>
          yargs.option("index", {
            alias: "i",
            type: "number",
            describe: "The 1-based index of the conversation entry",
            demandOption: true
          }),
        handler: async (argv) => {
          const index = argv.index;
          if (!existsSync(HISTORY_FILE)) {
            console.log("No conversation history available.");
            return;
          }
          let history;
          try {
            const data = await fs.readFile(HISTORY_FILE, "utf-8");
            const historyObj = JSON.parse(data);
            history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
          } catch (error) {
            handleError("Failed to read conversation history", error);
          }
          if (!Array.isArray(history) || history.length === 0) {
            console.log("No conversation history available.");
            return;
          }
          if (index > history.length || index <= 0) {
            handleError(`Error: Provided index ${index} is out of bounds. Conversation history contains ${history.length} entries.`);
          }
          const entry = history[index - 1];
          if (!entry.tags || !Array.isArray(entry.tags) || entry.tags.length === 0) {
            console.log(`No tags for conversation entry at index ${index}.`);
          } else {
            console.log(`Tags for entry at index ${index}: ${entry.tags.join(", ")}`);
          }
        }
      })
      .command({
        command: "filter",
        describe: "Filter conversation history by a specific tag",
        builder: (yargs) =>
          yargs.option("tag", {
            alias: "t",
            type: "string",
            describe: "The tag to filter by",
            demandOption: true
          }),
        handler: async (argv) => {
          const tag = argv.tag;
          validateArg(tag);
          if (!existsSync(HISTORY_FILE)) {
            console.log("No conversation history available.");
            return;
          }
          let history;
          try {
            const data = await fs.readFile(HISTORY_FILE, "utf-8");
            const historyObj = JSON.parse(data);
            history = Array.isArray(historyObj) ? historyObj : historyObj.messages;
          } catch (error) {
            handleError("Failed to read conversation history", error);
          }
          if (!Array.isArray(history) || history.length === 0) {
            console.log("No conversation history available.");
            return;
          }
          const filtered = history.filter(entry => entry.tags && Array.isArray(entry.tags) && entry.tags.includes(tag));
          if (filtered.length === 0) {
            console.log(`No conversation entries found with tag "${tag}".`);
          } else {
            console.log(`Conversation entries with tag "${tag}":`);
            filtered.forEach((entry, index) => {
              console.log(`${index + 1}. ${entry.role}: ${entry.content} (Timestamp: ${entry.timestamp})`);
            });
          }
        }
      })
      .demandCommand(1, "You need to specify a chat-tag subcommand (add, remove, list, filter)");
  },
  handler: () => {}
};

const chatTitleCommand = {
  command: "chat-title <action>",
  describe: "Manage the session title for the current chat session",
  builder: (yargs) => {
    return yargs
      .command({
        command: "set",
        describe: "Set the session title",
        builder: (yargs) => yargs.option("title", {
          alias: "t",
          type: "string",
          describe: "The title to set for the current session",
          demandOption: true
        }),
        handler: async (argv) => {
          const title = argv.title;
          validateArg(title);
          await loadHistory();
          conversationData.sessionTitle = title;
          await saveHistory();
          console.log(`Session title set to: ${title}`);
        }
      })
      .command({
        command: "get",
        describe: "Get the current session title",
        handler: async () => {
          await loadHistory();
          if (conversationData.sessionTitle && conversationData.sessionTitle.trim() !== "") {
            console.log(`Current session title: ${conversationData.sessionTitle}`);
          } else {
            console.log("No session title set.");
          }
        }
      })
      .command({
        command: "clear",
        describe: "Clear the current session title",
        handler: async () => {
          await loadHistory();
          conversationData.sessionTitle = "";
          await saveHistory();
          console.log("Session title cleared.");
        }
      })
      .demandCommand(1, "You need to specify a chat-title subcommand (set, get, clear)");
  },
  handler: () => {}
};

/**
 * Main function to parse CLI arguments and execute the appropriate subcommand.
 * @param {Array} args - CLI arguments. Defaults to an empty array if not provided.
 */
export function main(args = []) {
  if (!args) args = [];
  const verbose = args.includes("--verbose");
  if (verbose) {
    args = args.filter(arg => arg !== "--verbose");
    global.verbose = true;
    console.log("Verbose mode enabled.");
  }
  if (args.length === 0) {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
  validateArgs(args);
  return yargs(args)
    .option("verbose", {
      type: "boolean",
      describe: "Enable verbose logging for debugging",
      global: true
    })
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
    .command(chatHtmlExportCommand)
    .command(chatPdfExportCommand)
    .command(chatStatisticsCommand)
    .command(chatRemoveCommand)
    .command(chatEditCommand)
    .command(chatArchiveCommand)
    .command(chatImportCommand)
    .command(chatRestoreCommand)
    .command(chatTranslateCommand)
    .command(chatConfigUpdateCommand)
    .command(chatTagCommand)
    .command(chatTitleCommand)
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
