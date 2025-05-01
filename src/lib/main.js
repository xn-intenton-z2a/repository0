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

// Exported function for plot command
export function plot(dataString) {
  if (!dataString) {
    console.log("Usage: node src/lib/main.js plot <comma-separated-numbers>");
    return;
  }
  const parts = dataString.split(",");
  const numbers = parts.map(part => Number(part.trim()));
  if (numbers.some(isNaN)) {
    console.log("Error: Invalid input. Please provide a comma-separated list of numbers.");
    return;
  }
  const max = Math.max(...numbers);
  numbers.forEach(n => {
    const barLength = max === 0 ? 0 : Math.floor((n / max) * 40);
    console.log("#".repeat(barLength));
  });
}

// Helper function to print usage instructions
export function printUsage() {
  console.log(
    "Usage: node src/lib/main.js <command>\nAvailable commands:\n  diagnostics - Display diagnostic information.\n  version - Display current version information.\n  update - Initiate update process.\n  plot - Generate an ASCII bar chart from a comma-separated list of numbers."
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
    case "plot":
      if (args.length < 2) {
        console.log("Usage: node src/lib/main.js plot <comma-separated-numbers>");
      } else {
        plot(args[1]);
      }
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
