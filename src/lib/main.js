#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { createRequire } from "module";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Using createRequire to load package.json avoids deprecated import assertions
const require = createRequire(import.meta.url);
const packageData = require("../../package.json");

/**
 * Logs and throws errors with a consistent formatted message.
 * @param {string} message - The error message to display.
 * @param {Error} [err] - Optional original error to include.
 */
function handleError(message, err) {
  const formatted = `Error: ${message}`;
  console.error(formatted);
  throw err || new Error(formatted);
}

/**
 * Validates that a CLI argument is a non-empty string.
 * If the argument is not a string or is empty, a standardized error is thrown.
 * @param {*} arg - CLI argument to validate.
 */
function validateArg(arg) {
  if (typeof arg !== "string") {
    const received = (typeof arg === "number" && Number.isNaN(arg)) ? "NaN" : JSON.stringify(arg);
    handleError(`Invalid input: Expected a valid string command, but received ${received}`);
  }
  if (arg.trim() === "") {
    handleError("Invalid input: Expected a non-empty string command, but received an empty string");
  }
}

/**
 * Validates an array of CLI arguments using the standardized validation.
 * @param {Array} args - Array of CLI arguments.
 */
function validateArgs(args) {
  args.forEach(validateArg);
}

// Modular command definitions

/**
 * Diagnostics command: Runs diagnostics.
 */
const diagnosticsCommand = {
  command: "diagnostics",
  describe: "Run diagnostics",
  handler: () => {
    console.log("Diagnostics: running diagnostics");
  }
};

/**
 * Version command: Displays the current version.
 */
const versionCommand = {
  command: "version",
  describe: "Show version",
  handler: () => {
    console.log(`Version ${packageData.version}`);
  }
};

/**
 * Update command: Initiates an update.
 */
const updateCommand = {
  command: "update",
  describe: "Perform update",
  handler: () => {
    console.log("Performing update...");
  }
};

/**
 * Config command: Displays configuration settings. Uses the 'show' subcommand.
 */
const configCommand = {
  command: "config",
  describe: "View configuration settings",
  builder: (yargs) => {
    return yargs.command({
      command: "show",
      describe: "Display configuration",
      handler: () => {
        console.log("Configuration: using default settings");
      }
    }).demandCommand(1, "You need to specify a valid config subcommand");
  },
  handler: () => {}
};

/**
 * Info command: Displays repository metadata.
 */
const infoCommand = {
  command: "info",
  describe: "Display repository metadata",
  handler: () => {
    console.log(`Repository: ${packageData.name}\nVersion: ${packageData.version}\nDescription: ${packageData.description}`);
  }
};

/**
 * Main function to parse CLI arguments and execute the appropriate subcommand.
 * Logs provided arguments (or default empty array) and validates inputs for robustness.
 * @param {Array} args - CLI arguments. Defaults to an empty array if not provided.
 */
export function main(args = []) {
  if (args.length === 0) {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
  validateArgs(args);
  return yargs(args)
    .scriptName("repository0")
    .usage("$0 <command>")
    .command(diagnosticsCommand)
    .command(versionCommand)
    .command(updateCommand)
    .command(configCommand)
    .command(infoCommand)
    .demandCommand(1, "You need to specify a valid command")
    .strict()
    .help()
    .fail((msg, err, yargsInstance) => {
      if (msg) {
        handleError(msg, err);
      } else {
        handleError("Command failed", err);
      }
    })
    .parse();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Execute CLI with arguments from process.argv
  main(hideBin(process.argv));
}
