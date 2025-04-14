#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import fs from "fs";
import { z } from "zod";

const chatHistoryFile = ".chat_history.json";

export function main(args) {
  // Handle 'chat' command
  if (args[0] === "chat") {
    // New stats command
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
    
    // Check if export option is provided
    if (args[1] === "export") {
      const formatSchema = z.enum(["markdown", "html", "pdf", "csv"]);
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
              // Wrap fields in quotes in case of commas
              formattedOutput += `"${msg.timestamp}","${msg.message}"\n`;
            });
            break;
          case "pdf":
            // Simulate PDF export as a plain text representation
            formattedOutput = `PDF Export\nSession: ${history.sessionTitle}\n`;
            history.messages.forEach(msg => {
              formattedOutput += `Time: ${msg.timestamp}, Message: ${msg.message}\n`;
            });
            break;
          default:
            break;
        }
        console.log(`Exporting chat history in ${format} format:\n${formattedOutput}`);
      } catch (e) {
        console.error("Invalid export format. Please use one of: markdown, html, pdf, csv.");
      }
      return;
    } else {
      // Chat session handling
      const sessionTitle = args[1] || "Default Session";
      let historyData = { sessionTitle: sessionTitle, messages: [] };
      if (fs.existsSync(chatHistoryFile)) {
        try {
          historyData = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
          // Update session title if provided
          if (args[1] && args[1] !== "stats") {
            historyData.sessionTitle = sessionTitle;
          }
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
  }
  // Default behavior
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
