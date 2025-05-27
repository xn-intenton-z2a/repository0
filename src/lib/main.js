#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

/**
 * Main entry point for the CLI.
 * @param {string[]} args - Array of command-line arguments.
 */
export function main(args = process.argv.slice(2)) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

// When invoked directly from the command line, call main with default args
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}