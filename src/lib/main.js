#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import pkg from "../../package.json" assert { type: "json" };

// Helper function to print usage message
function printUsage(withDemo) {
  const usageMsg = `Usage: node src/lib/main.js [options]
Options:
  --help     Show help
  --version  Show version`;
  console.log(usageMsg);
  if (withDemo) {
    console.log("Demo Output: Run with: []");
  }
}

export function main(args) {
  // If no arguments or help flag, show usage. If no args, include demo output.
  if (!args || args.length === 0) {
    printUsage(true);
    if (process.env.NODE_ENV !== "test") process.exit(0);
    return;
  }
  if (args.includes("--help")) {
    printUsage(false);
    if (process.env.NODE_ENV !== "test") process.exit(0);
    return;
  }
  if (args.includes("--version")) {
    console.log(`Version: ${pkg.version}`);
    if (process.env.NODE_ENV !== "test") process.exit(0);
    return;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
