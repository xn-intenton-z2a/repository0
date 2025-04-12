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
    .parse();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Execute CLI with arguments from process.argv
  main(hideBin(process.argv));
}
