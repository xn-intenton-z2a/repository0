#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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
 * Main function to parse CLI arguments and execute subcommands.
 * @param {Array} args - Array of command line arguments. Defaults to [] if not provided.
 */
export function main(args = []) {
  // Log provided arguments (or default empty array) for debugging.
  if (args.length === 0) {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }

  // Validate that all arguments are strings.
  for (const arg of args) {
    if (typeof arg !== "string") {
      if (typeof arg === "number" && Number.isNaN(arg)) {
        handleError("Invalid input: Expected a valid command, but received NaN");
      } else {
        handleError(`Invalid input: Expected a valid command, but received ${arg}`);
      }
    }
  }

  return yargs(args)
    .scriptName("repository0")
    .usage("$0 <command>")
    .command(
      "diagnostics",
      "Run diagnostics",
      () => {},
      () => {
        console.log("Diagnostics: running diagnostics");
      }
    )
    .command(
      "version",
      "Show version",
      () => {},
      () => {
        console.log("Version 1.4.1-13");
      }
    )
    .command(
      "update",
      "Perform update",
      () => {},
      () => {
        console.log("Performing update...");
      }
    )
    .command(
      "config",
      "View configuration settings",
      (yargs) => {
        return yargs
          .command(
            "show",
            "Display configuration",
            () => {},
            () => {
              console.log("Configuration: using default settings");
            }
          )
          .demandCommand(1, "You need to specify a valid config subcommand");
      },
      () => {}
    )
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
