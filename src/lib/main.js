#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

/**
 * Main entrypoint for CLI.
 * @param {string[]} [args] - Arguments to process (defaults to process.argv.slice(2)).
 */
export function main(args = process.argv.slice(2)) {
  if (args.includes("--help")) {
    console.log("Usage: node src/lib/main.js [--help] [--version]");
    console.log("--help     Show this help message and exit");
    console.log("--version  Print version number and exit");
    process.exit(0);
  }

  if (args.includes("--version")) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const pkgPath = join(__dirname, "..", "..", "package.json");
    const pkgJson = JSON.parse(readFileSync(pkgPath, "utf8"));
    console.log(pkgJson.version);
    process.exit(0);
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
