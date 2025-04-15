#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import fs from "fs";
import { z } from "zod";

const chatHistoryFile = ".chat_history.json";

function backupHistory(history) {
  // Initialize undo and redo stacks if they don't exist
  if (!history._undoStack) {
    history._undoStack = [];
  }
  if (!history._redoStack) {
    history._redoStack = [];
  }
  // Clear redo stack on new modification
  history._redoStack = [];
  // Create a deep copy of the current state for backup (only sessionTitle and messages)
  const backup = {
    sessionTitle: history.sessionTitle,
    messages: history.messages.map((msg) => ({ ...msg }))
  };
  history._undoStack.push(backup);
}

function handleStats() {
  if (!fs.existsSync(chatHistoryFile)) {
    console.log("No chat history available.");
    return;
  }
  try {
    const history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    console.log(`Session '${history.sessionTitle}' contains ${history.messages.length} messages.`);
  } catch {
    console.error("No chat history available.");
  }
}

function handleList() {
  if (!fs.existsSync(chatHistoryFile)) {
    console.log("No chat history available for listing.");
    return;
  }
  let history;
  try {
    history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
  } catch {
    console.error("Error reading chat history file.");
    return;
  }
  history.messages.forEach((msg, index) => {
    console.log(`[${index}] ${msg.timestamp}: ${msg.message}`);
  });
}

function handleExport(args) {
  const formatArg = args[2];
  const formatSchema = z.enum(["markdown", "html", "pdf", "csv", "json", "xml"]);
  let format;
  try {
    format = formatSchema.parse(formatArg);
  } catch {
    console.error("Invalid export format. Please use one of: markdown, html, pdf, csv, json, xml.");
    return;
  }

  let history = { sessionTitle: "Default Session", messages: [] };
  if (fs.existsSync(chatHistoryFile)) {
    try {
      history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    } catch {
      // Use default history if parsing fails
    }
  }

  let formattedOutput = "";
  switch (format) {
    case "markdown": {
      formattedOutput = `# Chat History: ${history.sessionTitle}\n`;
      history.messages.forEach((msg) => {
        formattedOutput += `- ${msg.timestamp}: ${msg.message}\n`;
      });
      break;
    }
    case "html": {
      formattedOutput = `<h1>${history.sessionTitle}</h1>\n`;
      history.messages.forEach((msg) => {
        formattedOutput += `<p>${msg.timestamp}: ${msg.message}</p>\n`;
      });
      break;
    }
    case "csv": {
      formattedOutput = "timestamp,message\n";
      history.messages.forEach((msg) => {
        formattedOutput += `"${msg.timestamp}","${msg.message}"\n`;
      });
      break;
    }
    case "pdf": {
      formattedOutput = `PDF Export\nSession: ${history.sessionTitle}\n`;
      history.messages.forEach((msg) => {
        formattedOutput += `Time: ${msg.timestamp}, Message: ${msg.message}\n`;
      });
      break;
    }
    case "json": {
      formattedOutput = JSON.stringify(history, null, 2);
      break;
    }
    case "xml": {
      formattedOutput = `<chatHistory>\n  <sessionTitle>${history.sessionTitle}</sessionTitle>\n  <messages>\n`;
      history.messages.forEach((msg) => {
        formattedOutput += `    <message>\n      <timestamp>${msg.timestamp}</timestamp>\n      <content>${msg.message}</content>\n    </message>\n`;
      });
      formattedOutput += "  </messages>\n</chatHistory>";
      break;
    }
    default:
      break;
  }
  console.log(`Exporting chat history in ${format} format:\n${formattedOutput}`);
}

function handleSearch(args) {
  if (!fs.existsSync(chatHistoryFile)) {
    console.error("No chat history available for search.");
    return;
  }
  let history;
  try {
    history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
  } catch {
    console.error("Error reading chat history file.");
    return;
  }
  const keyword = args.slice(2).join(" ");
  if (!keyword) {
    console.error("No search keyword provided.");
    return;
  }
  const keywordLower = keyword.toLowerCase();
  const results = history.messages.filter((msg) => msg.message.toLowerCase().includes(keywordLower));
  if (results.length > 0) {
    results.forEach((msg) => {
      console.log(`${msg.timestamp}: ${msg.message}`);
    });
  } else {
    console.log("No matching messages found.");
  }
}

function handleEdit(args) {
  if (!fs.existsSync(chatHistoryFile)) {
    console.error("No chat history available for editing.");
    return;
  }
  let history;
  try {
    history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
  } catch {
    console.error("Error reading chat history file.");
    return;
  }
  const index = parseInt(args[2], 10);
  if (isNaN(index) || index < 0 || index >= history.messages.length) {
    console.error("Invalid message index.");
    return;
  }
  const newMessage = args.slice(3).join(" ");
  if (!newMessage) {
    console.error("No new message provided.");
    return;
  }
  backupHistory(history);
  history.messages[index].message = newMessage;
  history.messages[index].timestamp = new Date().toISOString();
  try {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
    console.log(`Message at index ${index} updated.`);
  } catch {
    console.error("Error writing chat history file.");
  }
}

function handleEditLast(args) {
  if (!fs.existsSync(chatHistoryFile)) {
    console.error("No chat history available for editing.");
    return;
  }
  let history;
  try {
    history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
  } catch {
    console.error("Error reading chat history file.");
    return;
  }
  if (!history.messages || history.messages.length === 0) {
    console.error("No chat history available for editing.");
    return;
  }
  const newMessage = args.slice(2).join(" ");
  if (!newMessage) {
    console.error("No new message provided.");
    return;
  }
  backupHistory(history);
  const lastIndex = history.messages.length - 1;
  history.messages[lastIndex].message = newMessage;
  history.messages[lastIndex].timestamp = new Date().toISOString();
  try {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
    console.log("Last message updated.");
  } catch {
    console.error("Error writing chat history file.");
  }
}

function handleDelete(args) {
  if (!fs.existsSync(chatHistoryFile)) {
    console.error("No chat history available for deletion.");
    return;
  }
  let history;
  try {
    history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
  } catch {
    console.error("Error reading chat history file.");
    return;
  }
  const index = parseInt(args[2], 10);
  if (isNaN(index) || index < 0 || index >= history.messages.length) {
    console.error("Invalid message index.");
    return;
  }
  backupHistory(history);
  history.messages.splice(index, 1);
  try {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
    console.log(`Message at index ${index} deleted.`);
  } catch {
    console.error("Error writing chat history file.");
  }
}

function handleClear() {
  if (fs.existsSync(chatHistoryFile)) {
    let history;
    try {
      history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      backupHistory(history);
    } catch (e) {
      // If parsing fails, we proceed with clearing
    }
    try {
      fs.unlinkSync(chatHistoryFile);
      console.log("Chat history cleared.");
    } catch {
      console.error("Error clearing chat history.");
    }
  } else {
    console.log("No chat history to clear.");
  }
}

function handleUndo() {
  if (!fs.existsSync(chatHistoryFile)) {
    console.error("No chat history available for undo.");
    return;
  }
  let history;
  try {
    history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
  } catch {
    console.error("Error reading chat history file.");
    return;
  }
  if (!history._undoStack || history._undoStack.length === 0) {
    console.error("No more actions to undo.");
    return;
  }
  // Push the current state onto redo stack before undo
  if (!history._redoStack) {
    history._redoStack = [];
  }
  const currentState = {
    sessionTitle: history.sessionTitle,
    messages: history.messages.map((msg) => ({ ...msg }))
  };
  history._redoStack.push(currentState);

  const previousState = history._undoStack.pop();
  history.sessionTitle = previousState.sessionTitle;
  history.messages = previousState.messages;
  try {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
    console.log("Undo successful.");
  } catch {
    console.error("Error writing chat history file.");
  }
}

function handleRedo() {
  if (!fs.existsSync(chatHistoryFile)) {
    console.error("No chat history available for redo.");
    return;
  }
  let history;
  try {
    history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
  } catch {
    console.error("Error reading chat history file.");
    return;
  }
  if (!history._redoStack || history._redoStack.length === 0) {
    console.error("No actions to redo.");
    return;
  }
  // Backup current state into undo stack before redoing
  if (!history._undoStack) {
    history._undoStack = [];
  }
  const currentState = {
    sessionTitle: history.sessionTitle,
    messages: history.messages.map((msg) => ({ ...msg }))
  };
  history._undoStack.push(currentState);

  const redoState = history._redoStack.pop();
  history.sessionTitle = redoState.sessionTitle;
  history.messages = redoState.messages;
  try {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
    console.log("Redo successful.");
  } catch {
    console.error("Error writing chat history file.");
  }
}

function handleChatSession(args) {
  const sessionTitle = args[1] || "Default Session";
  let historyData = { sessionTitle: sessionTitle, messages: [] };
  if (fs.existsSync(chatHistoryFile)) {
    try {
      historyData = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      if (args[1] && args[1] !== "stats") {
        historyData.sessionTitle = sessionTitle;
      }
      backupHistory(historyData);
    } catch {
      console.error("Error reading chat history file. Starting a new chat session.");
      historyData = { sessionTitle: sessionTitle, messages: [] };
    }
  }
  historyData.messages.push({
    timestamp: new Date().toISOString(),
    message: "Simulated chat message received."
  });
  try {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(historyData, null, 2));
    console.log(`Chat message received, session "${historyData.sessionTitle}" updated.`);
  } catch {
    console.error("Error writing chat history file.");
  }
}

// New function to handle renaming the chat session title
function handleRename(args) {
  if (!fs.existsSync(chatHistoryFile)) {
    console.error("No chat history available for renaming.");
    return;
  }
  let history;
  try {
    history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
  } catch {
    console.error("Error reading chat history file.");
    return;
  }
  const newTitle = args.slice(2).join(" ");
  if (!newTitle) {
    console.error("No new session title provided.");
    return;
  }
  backupHistory(history);
  history.sessionTitle = newTitle;
  try {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
    console.log(`Session title renamed to "${newTitle}".`);
  } catch {
    console.error("Error writing chat history file.");
  }
}

// New function to handle importing chat history from an external JSON file
function handleImport(args) {
  const importFilePath = args[2];
  if (!importFilePath) {
    console.error("No import file path provided.");
    return;
  }
  if (!fs.existsSync(importFilePath)) {
    console.error(`Import file not found: ${importFilePath}`);
    return;
  }
  let importedData;
  try {
    const fileContent = fs.readFileSync(importFilePath, "utf-8");
    importedData = JSON.parse(fileContent);
  } catch (e) {
    console.error("Failed to parse import file.");
    return;
  }
  // Validate structure: must have sessionTitle string and messages array with objects having timestamp and message.
  const importSchema = z.object({
    sessionTitle: z.string(),
    messages: z.array(z.object({
      timestamp: z.string(),
      message: z.string()
    }))
  });
  try {
    importSchema.parse(importedData);
  } catch (e) {
    console.error("Invalid import file structure.");
    return;
  }
  // Backup current history if exists
  if (fs.existsSync(chatHistoryFile)) {
    try {
      const currentHistory = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      backupHistory(currentHistory);
    } catch (e) {
      // ignore backup if parsing fails
    }
  }
  try {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(importedData, null, 2));
    console.log("Chat history imported successfully.");
  } catch (e) {
    console.error("Error writing chat history file.");
  }
}

// New function to handle editing a chat message by its timestamp
function handleEditByTimestamp(args) {
  if (!fs.existsSync(chatHistoryFile)) {
    console.error("No chat history available for editing by timestamp.");
    return;
  }
  let history;
  try {
    history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
  } catch {
    console.error("Error reading chat history file.");
    return;
  }
  const targetTimestamp = args[2];
  if (!targetTimestamp) {
    console.error("No timestamp provided.");
    return;
  }
  const newMessage = args.slice(3).join(" ");
  if (!newMessage) {
    console.error("No new message provided.");
    return;
  }
  const index = history.messages.findIndex(msg => msg.timestamp === targetTimestamp);
  if (index === -1) {
    console.error("No message found with the provided timestamp.");
    return;
  }
  backupHistory(history);
  history.messages[index].message = newMessage;
  history.messages[index].timestamp = new Date().toISOString();
  try {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
    console.log(`Message with timestamp ${targetTimestamp} updated.`);
  } catch {
    console.error("Error writing chat history file.");
  }
}

export function main(args) {
  if (args[0] !== "chat") {
    console.log("Run with: " + JSON.stringify(args));
    return;
  }
  const subCommand = args[1];
  switch (subCommand) {
    case "stats":
      handleStats();
      break;
    case "list":
      handleList();
      break;
    case "export":
      handleExport(args);
      break;
    case "search":
      handleSearch(args);
      break;
    case "edit":
      handleEdit(args);
      break;
    case "edit-last":
      handleEditLast(args);
      break;
    case "delete":
      handleDelete(args);
      break;
    case "clear":
      handleClear();
      break;
    case "undo":
      handleUndo();
      break;
    case "redo":
      handleRedo();
      break;
    case "import":
      handleImport(args);
      break;
    case "rename":
      handleRename(args);
      break;
    case "edit-ts":
      handleEditByTimestamp(args);
      break;
    default:
      handleChatSession(args);
      break;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
