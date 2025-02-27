#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export async function main(args = []) {
  // Normalize input: ensure args is an array
  if (!Array.isArray(args)) {
    args = [];
  }

  if (args.includes("--help")) {
    console.log("Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [numbers...]");
    return;
  }

  if (args.includes("--version")) {
    try {
      // Dynamically import package.json to retrieve version
      const pkg = await import("../../package.json", { assert: { type: "json" } });
      console.log(`Version: ${pkg.default.version}`);
    } catch (err) {
      console.error("Could not retrieve version:", err);
    }
    return;
  }

  if (args.includes("--diagnostics")) {
    console.log("Diagnostics: All systems operational.");
    return;
  }

  // Extended functionality: greeting message
  if (args.includes("--greet")) {
    console.log("Hello, welcome to repository0!");
    return;
  }

  // Extended functionality: sum calculation
  if (args.includes("--sum")) {
    const sumIndex = args.indexOf("--sum");
    // Consider all arguments after --sum that do not start with '--' as numbers
    const numArgs = args.slice(sumIndex + 1).filter(arg => !arg.startsWith("--")).map(Number);
    const total = numArgs.reduce((acc, curr) => acc + curr, 0);
    console.log(`Sum: ${total}`);
    return;
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

// If executed directly, run main and exit
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).then(() => process.exit(0));
}
