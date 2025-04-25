#!/usr/bin/env node
// src/lib/main.js
// This CLI utility prints a dynamic help message when run with no args or with '--help' flag.
// Usage example: node src/lib/main.js --help

import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { readFile } from "fs/promises";

// Define the commands object to be used in various outputs
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
  "--cli-utils": "Lists all CLI commands with descriptions in JSON format.",
  "--interactive": "Launches an interactive prompt to select a command."
};

function printHelp() {
  console.log("Available CLI Commands:");
  for (const [command, description] of Object.entries(commands)) {
    console.log(`${command}: ${description}`);
  }
}

function printCliUtils() {
  // Output the commands object as a formatted JSON string
  console.log(JSON.stringify(commands, null, 2));
}

async function getVersionDetails() {
  // Read version from package.json (located two levels up from src/lib)
  const packageUrl = new URL("../../package.json", import.meta.url);
  const pkgContent = await readFile(packageUrl, "utf8");
  const pkg = JSON.parse(pkgContent);
  const version = pkg.version || "unknown";
  const timestamp = new Date().toISOString();
  return { version, timestamp };
}

export async function main(args) {
  // If no args or help flag is provided, display dynamic help message
  if (!args.length || args.includes("--help")) {
    printHelp();
    return;
  }

  // Version flag: outputs version and timestamp in one line
  if (args.includes("--version")) {
    const { version, timestamp } = await getVersionDetails();
    console.log(`Version: ${version}, Timestamp: ${timestamp}`);
    return;
  }

  // Diagnostics flag: outputs detailed runtime information
  if (args.includes("--diagnostics")) {
    const { version, timestamp } = await getVersionDetails();
    console.log(`Version: ${version}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Node.js Version: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    const memory = process.memoryUsage();
    console.log(`Memory Usage: ${JSON.stringify(memory)}`);
    return;
  }

  // Interactive mode
  if (args.includes("--interactive")) {
    const choices = Object.keys(commands);
    const answer = await inquirer.prompt([
      {
        name: 'selectedCommand',
        message: 'Select a command:',
        type: 'list',
        choices
      }
    ]);
    console.log(`You selected: ${answer.selectedCommand}`);
    return;
  }

  // CLI utils: output JSON formatted commands
  if (args.includes("--cli-utils")) {
    printCliUtils();
    return;
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
