#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import process from "process";

const VERSION = "2.1.0-0";

const helpMessage = `Available commands:
  version      - Prints the version number.
  diagnostics  - Prints diagnostics information.
  help         - Displays this help message.

Usage: node src/lib/main.js [command]`;

export function main(args) {
  if (args.length > 0) {
    const command = args[0];
    if (command === "version") {
      console.log(VERSION);
      return;
    } else if (command === "diagnostics") {
      const diagnostics = {
        nodeVersion: process.version,
        message: "Diagnostics info: all systems operational",
      };
      console.log(JSON.stringify(diagnostics));
      return;
    } else {
      // For 'help' or any unrecognized command, display the help message
      console.log(helpMessage);
      return;
    }
  }
  // If no arguments provided, display help message
  console.log(helpMessage);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
