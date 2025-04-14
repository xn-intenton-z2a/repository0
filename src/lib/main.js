#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import fs from "fs";
import { z } from "zod";

const chatHistoryFile = ".chat_history.json";

export function main(args) {
  // Handle 'chat' command
  if (args[0] === "chat") {
    // Check if export option is provided
    if (args[1] === "export") {
      const formatSchema = z.enum(["markdown", "html", "pdf", "csv"]);
      try {
        const format = formatSchema.parse(args[2]);
        // Load existing chat history if available
        let history = [];
        if (fs.existsSync(chatHistoryFile)) {
          history = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
        }
        console.log(`Exporting chat history in ${format} format. History: ${JSON.stringify(history)}`);
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
          if (args[1]) {
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
