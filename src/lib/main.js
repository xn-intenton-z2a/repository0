#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { createRequire } from "module";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { z } from "zod"; // Integrated Zod for enhanced CLI input validation

// Using createRequire to load package.json avoids deprecated import assertions
const require = createRequire(import.meta.url);
const packageData = require("../../package.json");

// Global conversation history for multi-turn chat sessions
let conversationHistory = [];

/**
 * Logs and throws errors with a consistent formatted message.
 * @param {string} message - The error message to display.
 * @param {Error} [err] - Optional original error to include.
 */
function handleError(message, err) {
  const fullMessage = "CLI Error: " + message;
  console.error(fullMessage);
  throw err || new Error(fullMessage);
}

/**
 * Helper function to stringify non-string CLI argument for error messages.
 * @param {*} arg - The argument to stringify.
 * @returns {string} - String representation of the argument.
 */
function stringifyArg(arg) {
  if (arg === null) return "null";
  if (arg === undefined) return "undefined";
  if (typeof arg === "boolean") return arg.toString();
  if (Array.isArray(arg)) return "Array";
  if (typeof arg === "object") {
    try {
      return JSON.stringify(arg);
    } catch (e) {
      return String(arg);
    }
  }
  if (typeof arg === "number" && Number.isNaN(arg)) return "NaN";
  return JSON.stringify(arg);
}

/**
 * Validates that a CLI argument is a non-empty string using Zod.
 * Provides standardized error messages for various invalid inputs such as NaN, booleans, null, undefined, objects, and arrays.
 * The error message always follows the pattern: "Invalid input: Expected a valid non-empty string command, but received <value>. Please provide a valid non-empty string, such as 'start' or 'info'."
 * @param {*} arg - CLI argument to validate.
 */
function validateArg(arg) {
  const suggestion = " Please provide a valid non-empty string, such as 'start' or 'info'.";
  // Explicitly check for undefined to provide a custom error message
  if (arg === undefined) {
    handleError(`Invalid input: Expected a valid non-empty string command, but received undefined.${suggestion}`);
  }
  // Explicit check for NaN to ensure consistent error message
  if (typeof arg === "number" && Number.isNaN(arg)) {
    handleError(`Invalid input: Expected a valid non-empty string command, but received NaN.${suggestion}`);
  }
  const schema = z.string({
    invalid_type_error: `Invalid input: Expected a valid non-empty string command, but received ${stringifyArg(arg)}.${suggestion}`
  }).nonempty({
    message: `Invalid input: Expected a valid non-empty string command, but received an empty string.${suggestion}`
  });
  try {
    schema.parse(arg);
  } catch (error) {
    if (error.errors && error.errors.length > 0) {
      handleError(error.errors[0].message);
    } else {
      handleError("Invalid input");
    }
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
 * Diagnostics command: Runs diagnostics with detailed environment information.
 */
const diagnosticsCommand = {
  command: "diagnostics",
  describe: "Run diagnostics with detailed environment information",
  handler: () => {
    console.log("Diagnostics: running diagnostics");
    console.log("Node.js Version: " + process.version);
    console.log(`Package: ${packageData.name}`);
    console.log(`Version: ${packageData.version}`);
    console.log(`Description: ${packageData.description}`);
    console.log("Dependencies:");
    for (const [dep, ver] of Object.entries(packageData.dependencies || {})) {
      console.log(`  ${dep}: ${ver}`);
    }
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
 * Chat command: Interact with OpenAI API using a prompt. Supports multi-turn conversations by maintaining conversation context in the session.
 */
const chatCommand = {
  command: "chat",
  describe: "Chat with OpenAI API using a prompt (supports multi-turn conversation)",
  builder: (yargs) => {
    return yargs.option("prompt", {
      alias: "p",
      type: "string",
      describe: "The prompt message to send",
      demandOption: true
    });
  },
  handler: async (argv) => {
    const prompt = argv.prompt;
    // Validate the prompt
    validateArg(prompt);
    
    const apiKey = process.env.CHATGPT_API_SECRET_KEY;
    if (!apiKey) {
      handleError("Missing environment variable CHATGPT_API_SECRET_KEY");
    }

    // Append user prompt to conversation history
    conversationHistory.push({ role: "user", content: prompt });

    // Dynamically import the OpenAI module
    const { Configuration, OpenAIApi } = await import("openai");
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);
    
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
      });
      const reply = response.data.choices[0].message.content;
      console.log(reply);
      // Append assistant's reply to the conversation history
      conversationHistory.push({ role: "assistant", content: reply });
    } catch (error) {
      handleError("Error calling OpenAI API", error);
    }
  }
};

/**
 * Main function to parse CLI arguments and execute the appropriate subcommand.
 * Logs provided arguments (or default empty array) and validates inputs for robustness.
 * @param {Array} args - CLI arguments. Defaults to an empty array if not provided.
 */
export function main(args = []) {
  if (!args) args = [];
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
    .command(chatCommand)
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
    .parseAsync();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(hideBin(process.argv));
}
