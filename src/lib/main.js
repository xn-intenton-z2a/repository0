#!/usr/bin/env node
// src/lib/main.js
// This CLI utility prints a dynamic help message when run with no args or with '--help' flag.
// Usage example: node src/lib/main.js --help

import { fileURLToPath } from "url";

function printHelp() {
  const commands = {
    "--agentic": "Processes command(s) as JSON payload.",
    "--dry-run": "Executes without action.",
    "--version": "Outputs version info and timestamp.",
    "--verbose": "Enables detailed logging.",
    "--diagnostics": "Provides diagnostic report including configuration and Node.js version.",
    "--status": "Outputs runtime health summary.",
    "--digest": "Initiates SQS event simulation and processing via digestLambdaHandler.",
    "--simulate-error": "Triggers error simulation with immediate exit.",
    "--simulate-delay <ms>": "Delays command execution.",
    "--simulate-load <ms>": "Simulates CPU load.",
    "--apply-fix": "Applies fix and logs success, stops execution.",
    "--cli-utils": "Lists all CLI commands with descriptions."
  };

  console.log("Available CLI Commands:");
  for (const [command, description] of Object.entries(commands)) {
    console.log(`${command}: ${description}`);
  }
}

export function main(args) {
  // If no args or help flag is provided, display dynamic help message
  if (!args.length || args.includes("--help")) {
    printHelp();
    return;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
