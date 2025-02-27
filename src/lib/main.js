#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export async function main(args = []) {
  // Ensure args is an array
  if (!Array.isArray(args)) {
    args = [];
  }

  if (args.includes("--help")) {
    console.log("Usage: node src/lib/main.js [--diagnostics] [--help] [--version]");
    return;
  }

  if (args.includes("--version")) {
    // Dynamically import package.json to retrieve version
    try {
      const pkg = await import("../../package.json", { assert: { type: "json" } });
      console.log(`Version: ${pkg.default.version}`);
    } catch (err) {
      console.error("Could not retrieve version:", err);
    }
    return;
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
  
  // Future enhancement: Add more comprehensive command-line options and help documentation.
}

// If called directly via command-line, execute main and ensure termination without waiting for user input.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).then(() => process.exit(0));
}
