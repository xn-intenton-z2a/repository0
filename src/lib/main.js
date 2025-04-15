#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import fs from "fs";
import { z } from "zod";

const chatHistoryFile = ".chat_history.json";

// Helper function to backup chat history before a modifying operation
function backupHistory(history) {
  // Create a shallow copy of sessionTitle and messages as backup
  history._backup = {
    sessionTitle: history.sessionTitle,
    messages: history.messages.slice()
  };
}

export function main(args) {
  // Handle 'chat' command
  if (args[0] === "chat") {
    // Stats command
    if (args[1] === "stats") {
      try {
        if (!fs.existsSync(chatHistoryFile)) {
          console.log("No chat history available.");
        } else {
          const history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
          console.log(`Session '${history.sessionTitle}' contains ${history.messages.length} messages.`);
        }
      } catch (e) {
        console.error("No chat history available.");
      }
      return;
    }

    // Export command
    if (args[1] === "export") {
      const formatSchema = z.enum(["markdown", "html", "pdf", "csv", "json"]);
      try {
        const format = formatSchema.parse(args[2]);
        // Load existing chat history if available
        let history = { sessionTitle: "Default Session", messages: [] };
        if (fs.existsSync(chatHistoryFile)) {
          history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
        }

        let formattedOutput = "";
        switch (format) {
          case "markdown":
            formattedOutput = `# Chat History: ${history.sessionTitle}\n`;
            history.messages.forEach(msg => {
              formattedOutput += `- ${msg.timestamp}: ${msg.message}\n`;
            });
            break;
          case "html":
            formattedOutput = `<h1>${history.sessionTitle}</h1>\n`;
            history.messages.forEach(msg => {
              formattedOutput += `<p>${msg.timestamp}: ${msg.message}</p>\n`;
            });
            break;
          case "csv":
            formattedOutput = "timestamp,message\n";
            history.messages.forEach(msg => {
              formattedOutput += `"${msg.timestamp}","${msg.message}"\n`;
            });
            break;
          case "pdf":
            // Simulated PDF export
            formattedOutput = `PDF Export\nSession: ${history.sessionTitle}\n`;
            history.messages.forEach(msg => {
              formattedOutput += `Time: ${msg.timestamp}, Message: ${msg.message}\n`;
            });
            break;
          case "json":
            formattedOutput = JSON.stringify(history, null, 2);
            break;
          default:
            break;
        }
        console.log(`Exporting chat history in ${format} format:\n${formattedOutput}`);
      } catch (e) {
        console.error("Invalid export format. Please use one of: markdown, html, pdf, csv, json.");
      }
      return;
    }

    // Edit command for updating a chat message
    if (args[1] === "edit") {
      if (!fs.existsSync(chatHistoryFile)) {
        console.error("No chat history available for editing.");
        return;
      }
      let history;
      try {
        history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      } catch (e) {
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
      // Backup before modifying
      backupHistory(history);
      history.messages[index].message = newMessage;
      history.messages[index].timestamp = new Date().toISOString();
      try {
        fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
        console.log(`Message at index ${index} updated.`);
      } catch (e) {
        console.error("Error writing chat history file.");
      }
      return;
    }

    // Edit-last command for updating the most recent message
    if (args[1] === "edit-last") {
      if (!fs.existsSync(chatHistoryFile)) {
        console.error("No chat history available for editing.");
        return;
      }
      let history;
      try {
        history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      } catch (e) {
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
      // Backup before modifying
      backupHistory(history);
      const lastIndex = history.messages.length - 1;
      history.messages[lastIndex].message = newMessage;
      history.messages[lastIndex].timestamp = new Date().toISOString();
      try {
        fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
        console.log("Last message updated.");
      } catch (e) {
        console.error("Error writing chat history file.");
      }
      return;
    }

    // Delete command for removing a chat message
    if (args[1] === "delete") {
      if (!fs.existsSync(chatHistoryFile)) {
        console.error("No chat history available for deletion.");
        return;
      }
      let history;
      try {
        history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      } catch (e) {
        console.error("Error reading chat history file.");
        return;
      }
      const index = parseInt(args[2], 10);
      if (isNaN(index) || index < 0 || index >= history.messages.length) {
        console.error("Invalid message index.");
        return;
      }
      // Backup before modifying
      backupHistory(history);
      history.messages.splice(index, 1);
      try {
        fs.writeFileSync(chatHistoryFile, JSON.stringify(history, null, 2));
        console.log(`Message at index ${index} deleted.`);
      } catch (e) {
        console.error("Error writing chat history file.");
      }
      return;
    }

    // Undo command to revert last change
    if (args[1] === "undo") {
      if (!fs.existsSync(chatHistoryFile)) {
        console.error("No chat history available for undo.");
        return;
      }
      let history;
      try {
        history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      } catch (e) {
        console.error("Error reading chat history file.");
        return;
      }
      if (!history._backup) {
        console.error("No backup available for undo.");
        return;
      }
      const backupData = history._backup;
      try {
        fs.writeFileSync(chatHistoryFile, JSON.stringify(backupData, null, 2));
        console.log("Undo successful.");
      } catch (e) {
        console.error("Error writing chat history file.");
      }
      return;
    }

    // Chat session handling (adding new messages)
    const sessionTitle = args[1] || "Default Session";
    let historyData = { sessionTitle: sessionTitle, messages: [] };
    if (fs.existsSync(chatHistoryFile)) {
      try {
        historyData = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
        // Update session title if provided (and not a subcommand)
        if (args[1] && args[1] !== "stats") {
          historyData.sessionTitle = sessionTitle;
        }
        // Backup current state before appending new message
        backupHistory(historyData);
      } catch (err) {
        console.error("Error reading chat history file. Starting a new chat session.");
        historyData = { sessionTitle: sessionTitle, messages: [] };
      }
    }
    // Append a simulated chat message
    historyData.messages.push({
      timestamp: new Date().toISOString(),
      message: "Simulated chat message received."
    });
    try {
      fs.writeFileSync(chatHistoryFile, JSON.stringify(historyData, null, 2));
      console.log(`Chat message received, session "${historyData.sessionTitle}" updated.`);
    } catch (e) {
      console.error("Error writing chat history file.");
    }
    return;
  }
  // Default behavior
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
