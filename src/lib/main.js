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
 * Handles errors in a consistent format and throws an error for the caller.
 * @param {string} message - The error message to display.
 * @param {Error} [err] - Optional original error to throw.
 */
function handleError(message, err) {
  const formatted = `Error: ${message}`;
  console.error(formatted);
  throw err || new Error(formatted);
}

/**
 * Validates a single CLI argument ensuring it is a non-empty string.
 * Consolidates error handling for all invalid inputs including non-string and empty strings.
 * @param {*} arg - CLI argument to validate.
 */
function validateArg(arg) {
  if (typeof arg !== "string") {
    if (typeof arg === "number" && Number.isNaN(arg)) {
      handleError("Invalid input: Expected a valid string command, but received NaN");
    } else {
      // Use JSON.stringify for better readability of non-string arguments
      handleError(`Invalid input: Expected a valid string command, but received ${JSON.stringify(arg)}`);
    }
  }
  if (arg.trim() === "") {
    handleError("Invalid input: Expected a non-empty string command, but received an empty string");
  }
}

/**
 * Validates all CLI arguments using the consolidated error handling logic.
 * @param {Array} args - An array of CLI arguments.
 */
function validateArgs(args) {
  for (const arg of args) {
    validateArg(arg);
  }
}

// Modular command definitions

/**
 * Registers the diagnostics command.
 * @returns {object} Yargs command module for diagnostics
 */
const diagnosticsCommand = {
  command: "diagnostics",
  describe: "Run diagnostics",
  handler: () => {
    console.log("Diagnostics: running diagnostics");
  }
};

/**
 * Registers the version command.
 * @returns {object} Yargs command module for version
 */
const versionCommand = {
  command: "version",
  describe: "Show version",
  handler: () => {
    console.log(`Version ${packageData.version}`);
  }
};

/**
 * Registers the update command.
 * @returns {object} Yargs command module for update
 */
const updateCommand = {
  command: "update",
  describe: "Perform update",
  handler: () => {
    console.log("Performing update...");
  }
};

/**
 * Registers the config command with its subcommand(s).
 * @returns {object} Yargs command module for config
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
 * Registers the info command which displays repository metadata.
 * @returns {object} Yargs command module for info
 */
const infoCommand = {
  command: "info",
  describe: "Display repository metadata",
  handler: () => {
    console.log(`Repository: ${packageData.name}\nVersion: ${packageData.version}\nDescription: ${packageData.description}`);
  }
};

/**
 * Main function to parse CLI arguments and execute subcommands.
 * Logs provided arguments for debugging, validates inputs, and executes commands.
 * If an argument fails validation, a detailed error message is shown.
 *
 * @param {Array} args - Array of command line arguments. Defaults to [] if not provided.
 */
export function main(args = []) {
  // Log provided arguments (or default empty array) for debugging.
  if (args.length === 0) {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }

  // Validate that all arguments are non-empty strings with standardized error messaging.
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
