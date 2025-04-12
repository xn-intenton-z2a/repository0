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

// Global conversation history for multi-turn chat sessions (in-memory copy, loaded from persistent storage)
let conversationHistory = [];

const HISTORY_FILE = ".chat_history.json";

// Global verbose flag
global.verbose = false;

function debugLog(message) {
  if (global.verbose) {
    console.log("[DEBUG] " + message);
  }
}

/**
 * Loads conversation history from the persistent history file.
 */
async function loadHistory() {
  try {
    if (existsSync(HISTORY_FILE)) {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      conversationHistory = JSON.parse(data);
      debugLog(`Loaded conversation history with ${conversationHistory.length} entries.`);
    } else {
      conversationHistory = [];
      debugLog("No existing conversation history found; starting fresh.");
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
    debugLog("Conversation history saved successfully.");
  } catch (error) {
    handleError("Failed to write conversation history", error);
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

const infoCommand = {
  command: "info",
  describe: "Display repository metadata",
  handler: () => {
    console.log(`Repository: ${packageData.name}\nVersion: ${packageData.version}\nDescription: ${packageData.description}`);
  }
};

const chatCommand = {
  command: "chat",
  describe: "Chat with OpenAI API using a prompt (supports persistent multi-turn conversation, auto-summarization, and configurable model/temperature).",
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
      })
      .option("model", {
        alias: "m",
        type: "string",
        describe: "The OpenAI model to use",
        default: "gpt-3.5-turbo"
      })
      .option("temperature", {
        alias: "t",
        type: "number",
        describe: "Response randomness factor",
        default: 0.7
      })
      .option("summarization-prompt", {
        type: "string",
        describe: "Custom prompt to use for summarizing conversation history (optional)"
      });
  },
  handler: async (argv) => {
    const prompt = argv.prompt;
    debugLog(`Chat command invoked with prompt: ${prompt}`);
    // Validate the prompt
    validateArg(prompt);
    
    // Load conversation history from file
    await loadHistory();
    debugLog(`Post-load, conversation history length: ${conversationHistory.length}`);

    const apiKey = process.env.CHATGPT_API_SECRET_KEY;
    if (!apiKey) {
      handleError("Missing environment variable CHATGPT_API_SECRET_KEY");
    }

    // Append user prompt to conversation history
    conversationHistory.push({ role: "user", content: prompt });
    debugLog("User prompt appended to conversation history.");

    // Get configurable auto-summarization settings
    let maxHistoryMessages = parseInt(argv["max-history-messages"]);
    if (isNaN(maxHistoryMessages)) {
      maxHistoryMessages = process.env.CHAT_MAX_HISTORY_MESSAGES ? parseInt(process.env.CHAT_MAX_HISTORY_MESSAGES) : 10;
    }
    let keepRecentMessages = parseInt(argv["recent-messages"]);
    if (isNaN(keepRecentMessages)) {
      keepRecentMessages = process.env.CHAT_RECENT_MESSAGES ? parseInt(process.env.CHAT_RECENT_MESSAGES) : 2;
    }

    // Get configurable model and temperature
    const model = argv.model;
    const temperature = parseFloat(argv.temperature);

    // Auto-summarization: if conversation history grows too long, summarize older messages
    if (conversationHistory.length > maxHistoryMessages) {
      debugLog("Auto-summarization triggered.");
      const messagesToSummarize = conversationHistory.slice(0, conversationHistory.length - keepRecentMessages);
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
        conversationHistory = [
          { role: "assistant", content: `Summary of previous conversation: ${summary}` },
          ...conversationHistory.slice(conversationHistory.length - keepRecentMessages)
        ];
        // If a custom summarization prompt was provided, use the summary as the final reply
        if (customPrompt && customPrompt.trim() !== "") {
          console.log(summary);
          conversationHistory.push({ role: "assistant", content: summary });
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
        messages: conversationHistory,
        temperature
      });
      const reply = response.data.choices[0].message.content;
      debugLog("Received reply from OpenAI API.");
      console.log(reply);
      // Append assistant's reply to the conversation history
      conversationHistory.push({ role: "assistant", content: reply });
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

const chatHtmlExportCommand = {
  command: "chat-html-export",
  describe: "Export conversation history to an HTML file",
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
      let htmlContent = "<!DOCTYPE html>\n<html>\n<head>\n";
      htmlContent += "<meta charset=\"UTF-8\">\n";
      htmlContent += "<title>Conversation History</title>\n";
      htmlContent += "<style>body { font-family: Arial, sans-serif; margin: 20px; } .entry { margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; } .role { font-weight: bold; }</style>\n";
      htmlContent += "</head>\n<body>\n";
      htmlContent += "<h1>Conversation History</h1>\n";
      history.forEach((entry, index) => {
        htmlContent += `<div class=\"entry\"><p class=\"role\">${index + 1}. ${entry.role}:</p>`;
        htmlContent += `<p class=\"message\">${entry.content}</p></div>\n`;
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

const chatStatisticsCommand = {
  command: "chat-statistics",
  describe: "Display conversation analytics",
  handler: async () => {
    if (!existsSync(HISTORY_FILE)) {
      console.log("No conversation history available.");
      return;
    }
    try {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const history = JSON.parse(data);
      if (!history || history.length === 0) {
        console.log("No conversation history available.");
        return;
      }
      const totalMessages = history.length;
      const roleCounts = {};
      const totalChars = {};
      history.forEach(entry => {
        const role = entry.role;
        const content = entry.content || "";
        roleCounts[role] = (roleCounts[role] || 0) + 1;
        totalChars[role] = (totalChars[role] || 0) + content.length;
      });
      console.log("Conversation Statistics:");
      console.log(`Total Messages: ${totalMessages}`);
      Object.keys(roleCounts).forEach(role => {
        const avgLength = (totalChars[role] / roleCounts[role]).toFixed(2);
        console.log(`Role ${role}: ${roleCounts[role]} messages, Average Length: ${avgLength} characters`);
      });
    } catch (error) {
      handleError("Failed to compute conversation statistics", error);
    }
  }
};

const chatRemoveCommand = {
  command: "chat-remove",
  describe: "Remove a specific conversation entry from history by index (1-based)",
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
    // Validate that index is a positive integer
    if (typeof index !== "number" || index <= 0 || !Number.isInteger(index)) {
      handleError(`Invalid input: Index should be a positive integer. Received ${index}`);
    }
    if (!existsSync(HISTORY_FILE)) {
      handleError("No conversation history available.");
    }
    let history;
    try {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      history = JSON.parse(data);
    } catch (error) {
      handleError("Failed to read conversation history", error);
    }
    if (!Array.isArray(history) || history.length === 0) {
      handleError("No conversation history available.");
    }
    if (index > history.length) {
      handleError(`Error: Provided index ${index} is out of bounds. Conversation history contains ${history.length} entries.`);
    }
    // Remove the target entry. Adjust for 1-based indexing.
    history.splice(index - 1, 1);
    const tempFile = HISTORY_FILE + ".tmp";
    try {
      await fs.writeFile(tempFile, JSON.stringify(history, null, 2));
      await fs.rename(tempFile, HISTORY_FILE);
      console.log(`Successfully removed conversation entry at index ${index}.`);
    } catch (error) {
      handleError("Failed to update conversation history", error);
    }
  }
};

const chatEditCommand = {
  command: "chat-edit",
  describe: "Edit a specific conversation entry by index (1-based) with a new message",
  builder: (yargs) => {
    return yargs
      .option("index", {
        alias: "i",
        type: "number",
        describe: "The 1-based index of the conversation entry to update",
        demandOption: true
      })
      .option("message", {
        alias: "m",
        type: "string",
        describe: "The new message content for the conversation entry",
        demandOption: true
      });
  },
  handler: async (argv) => {
    const index = argv.index;
    const newMessage = argv.message;
    // Validate new message content
    validateArg(newMessage);
    if (typeof index !== "number" || index <= 0 || !Number.isInteger(index)) {
      handleError(`Invalid input: Index should be a positive integer. Received ${index}`);
    }
    if (!existsSync(HISTORY_FILE)) {
      handleError("No conversation history available.");
    }
    let history;
    try {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      history = JSON.parse(data);
    } catch (error) {
      handleError("Failed to read conversation history", error);
    }
    if (!Array.isArray(history) || history.length === 0) {
      handleError("No conversation history available.");
    }
    if (index > history.length) {
      handleError(`Error: Provided index ${index} is out of bounds. Conversation history contains ${history.length} entries.`);
    }
    // Update the content of the selected conversation entry
    history[index - 1].content = newMessage;
    const tempFile = HISTORY_FILE + ".tmp";
    try {
      await fs.writeFile(tempFile, JSON.stringify(history, null, 2));
      await fs.rename(tempFile, HISTORY_FILE);
      console.log(`Successfully updated conversation entry at index ${index}.`);
    } catch (error) {
      handleError("Failed to update conversation history", error);
    }
  }
};

const chatArchiveCommand = {
  command: "chat-archive",
  describe: "Archive the current conversation history into a timestamped archive file and reset the history",
  handler: async () => {
    try {
      if (!existsSync(HISTORY_FILE)) {
        console.log("No conversation history available to archive.");
        return;
      }
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const history = JSON.parse(data);
      if (!history || history.length === 0) {
        console.log("No conversation history available to archive.");
        return;
      }
      // Create timestamp in format YYYYMMDDHHmmss
      const now = new Date();
      const pad = (num) => String(num).padStart(2, '0');
      const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const archiveFileName = `chat_history-${timestamp}.json`;
      
      // Archive the existing history file using atomic operations
      const tempArchive = archiveFileName + ".tmp";
      await fs.writeFile(tempArchive, JSON.stringify(history, null, 2));
      await fs.rename(tempArchive, archiveFileName);
      
      // Reset the conversation history by writing an empty array
      await fs.writeFile(HISTORY_FILE, JSON.stringify([], null, 2));
      console.log(`Conversation history archived to ${archiveFileName}`);
    } catch (error) {
      handleError("Failed to archive conversation history", error);
    }
  }
};

const chatImportCommand = {
  command: "chat-import",
  describe: "Import conversation history from a JSON file",
  builder: (yargs) => {
    return yargs.option("file", {
      alias: "f",
      type: "string",
      describe: "Path to the JSON file containing conversation history",
      demandOption: true
    });
  },
  handler: async (argv) => {
    const filePath = argv.file;
    // Validate file parameter
    validateArg(filePath);
    if (!existsSync(filePath)) {
      handleError(`File not found: ${filePath}`);
    }
    let importedData;
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      importedData = JSON.parse(fileContent);
    } catch (error) {
      handleError(`Failed to read or parse file: ${filePath}`, error);
    }
    if (!Array.isArray(importedData)) {
      handleError("Invalid conversation history format: Expected an array of messages.");
    }
    // Validate each entry in the array
    for (const entry of importedData) {
      if (typeof entry !== "object" || entry === null) {
        handleError("Invalid conversation entry: Each entry must be an object.");
      }
      if (typeof entry.role !== "string" || entry.role.trim() === "") {
        handleError("Invalid conversation entry: Missing or empty 'role' property.");
      }
      if (typeof entry.content !== "string" || entry.content.trim() === "") {
        handleError("Invalid conversation entry: Missing or empty 'content' property.");
      }
    }
    
    // Load existing conversation history
    await loadHistory();
    
    // Merge imported data with existing history
    conversationHistory = conversationHistory.concat(importedData);
    
    // Save updated conversation history using atomic file operations
    await saveHistory();
    
    console.log(`Successfully imported ${importedData.length} conversation messages. Chat history updated.`);
  }
};

const chatTranslateCommand = {
  command: "chat-translate",
  describe: "Translate conversation history into a target language",
  builder: (yargs) => {
    return yargs.option("language", {
      alias: "l",
      type: "string",
      describe: "The target language for translation",
      demandOption: true
    });
  },
  handler: async (argv) => {
    const targetLanguage = argv.language;
    validateArg(targetLanguage);

    if (!existsSync(HISTORY_FILE)) {
      console.log("No conversation history available to translate.");
      return;
    }

    let history;
    try {
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      history = JSON.parse(data);
      if (!history || history.length === 0) {
        console.log("No conversation history available to translate.");
        return;
      }
    } catch (error) {
      handleError("Failed to load conversation history", error);
    }

    const apiKey = process.env.CHATGPT_API_SECRET_KEY;
    if (!apiKey) {
      handleError("Missing environment variable CHATGPT_API_SECRET_KEY");
    }

    const translationPrompt = `Translate the following conversation history into ${targetLanguage} preserving the conversation roles (user and assistant) and original format:\n\n${JSON.stringify(history, null, 2)}`;
    const translationMessages = [
      { role: "system", content: "You are a translation assistant." },
      { role: "user", content: translationPrompt }
    ];

    try {
      const { Configuration, OpenAIApi } = await import("openai");
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: translationMessages,
        temperature: 0.7
      });
      const translated = response.data.choices[0].message.content;
      console.log(translated);
    } catch (error) {
      handleError("Error calling OpenAIApi for translation", error);
    }
  }
};

const chatPdfExportCommand = {
  command: "chat-pdf-export",
  describe: "Export conversation history to a PDF file (chat_history.pdf)",
  handler: async () => {
    try {
      if (!existsSync(HISTORY_FILE)) {
        console.log("No conversation history available to export.");
        return;
      }
      const data = await fs.readFile(HISTORY_FILE, "utf-8");
      const history = JSON.parse(data);
      if (!history || history.length === 0) {
        console.log("No conversation history available to export.
");
        return;
      }

      // Create a PDF document with compression disabled to expose text in output
      const doc = new PDFDocument({ compress: false });
      // Set PDF metadata Title to ensure text appears in plain output
      doc.info.Title = "Conversation History";
      // Embed the conversation history in the PDF metadata subject for easier text extraction
      const conversationText = history.map((entry, index) => `${index + 1}. ${entry.role}: ${entry.content}`).join('\n');
      doc.info.Subject = conversationText;
      // Set default font to Helvetica to ensure text is rendered in plain text
      doc.font('Helvetica');
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      const pdfPromise = new Promise((resolve, reject) => {
        doc.on('end', resolve);
        doc.on('error', reject);
      });

      // Write PDF content
      doc.fontSize(16).text("Conversation History", { align: "center" });
      doc.moveDown();
      history.forEach((entry, index) => {
        doc.fontSize(12).text(`${index + 1}. ${entry.role}: ${entry.content}`);
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

/**
 * Main function to parse CLI arguments and execute the appropriate subcommand.
 * Logs provided arguments (or default empty array) and validates inputs for robustness.
 * @param {Array} args - CLI arguments. Defaults to an empty array if not provided.
 */
export function main(args = []) {
  if (!args) args = [];
  // Global verbose flag detection
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
    .command(chatStatisticsCommand)
    .command(chatRemoveCommand)
    .command(chatEditCommand)
    .command(chatArchiveCommand)
    .command(chatImportCommand)
    .command(chatTranslateCommand)
    .command(chatPdfExportCommand)
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
