#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

/**
 * Main function to parse CLI arguments and execute subcommands.
 * @param {Array} args - Array of command line arguments.
 */
export function main(args) {
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
    .demandCommand(1, "You need to specify a valid command")
    .strict()
    .help()
    .fail((msg, err, yargsInstance) => {
      // If the error message is related to missing command, output the expected message.
      if (msg && msg.includes("You need to specify a valid command")) {
        console.log("You need to specify a valid command");
      } else if (msg) {
        console.error(msg);
      }
      // Throw an error to halt execution; test cases can catch this.
      throw err || new Error(msg || "Command failed");
    })
    .parse();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Execute CLI with arguments from process.argv
  main(hideBin(process.argv));
}
