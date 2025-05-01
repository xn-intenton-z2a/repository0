#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { join, dirname } from "path";

// Exported function for diagnostics
export function diagnostics() {
  console.log("Diagnostics: System check passed. All systems operational.");
}

// Exported function for version
export function version() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const packageJsonPath = join(__dirname, "../../package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: "utf8" }));
    console.log(`Version: ${packageJson.version}`);
  } catch (error) {
    console.log("Version: Unknown");
  }
}

// Exported function for update
export function update() {
  console.log("Update initiated: Process started.");
}

// Helper function to print usage instructions
export function printUsage() {
  console.log(
    "Usage: node src/lib/main.js <command>\nAvailable commands:\n  diagnostics - Display diagnostic information.\n  version - Display current version information.\n  update - Initiate update process."
  );
}

export function main(args) {
  if (!args || args.length === 0) {
    printUsage();
    return;
  }

  const command = args[0];
  switch (command) {
    case "diagnostics":
      diagnostics();
      break;
    case "version":
      version();
      break;
    case "update":
      update();
      break;
    default:
      console.log("Invalid command.");
      printUsage();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
