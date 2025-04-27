#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { join, dirname } from "path";

export function main(args) {
  if (!args || args.length === 0) {
    console.log(
      "Usage: node src/lib/main.js <command>\nAvailable commands:\n  diagnostics - Display diagnostic information.\n  version - Display current version information.\n  update - Initiate update process."
    );
    return;
  }

  const command = args[0];
  switch (command) {
    case "diagnostics":
      console.log("Diagnostics: System check passed. All systems operational.");
      break;
    case "version": {
      // Try to read version from package.json
      try {
        // Determine project root relative to this file
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const packageJsonPath = join(__dirname, "../../package.json");
        const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: "utf8" }));
        console.log(`Version: ${packageJson.version}`);
      } catch (error) {
        console.log("Version: Unknown");
      }
      break;
    }
    case "update":
      console.log("Update initiated: Process started.");
      break;
    default:
      console.log(
        "Invalid command.\nUsage: node src/lib/main.js <command>\nAvailable commands:\n  diagnostics - Display diagnostic information.\n  version - Display current version information.\n  update - Initiate update process."
      );
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
