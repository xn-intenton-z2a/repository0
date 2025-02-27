#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export async function main(args = []) {
  // Normalize input: ensure args is an array
  if (!Array.isArray(args)) {
    args = [];
  }

  if (args.includes("--help")) {
    console.log("Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [numbers...]");
    return;
  }

  if (args.includes("--version")) {
    try {
      // Dynamically import package.json to retrieve version
      const pkg = await import("../../package.json", { assert: { type: "json" } });
      const version = pkg.default ? pkg.default.version : pkg.version;
      console.log(`Version: ${version}`);
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
    // Consider all arguments after --sum that do not start with '--' as numbers, then filter out NaN values
    const numArgs = args.slice(sumIndex + 1)
      .filter(arg => !arg.startsWith("--"))
      .map(Number)
      .filter(num => !isNaN(num));
    const total = numArgs.reduce((acc, curr) => acc + curr, 0);
    console.log(`Sum: ${total}`);
    return;
  }

  // Extended functionality: multiplication calculation
  if (args.includes("--multiply")) {
    const multiplyIndex = args.indexOf("--multiply");
    // Consider all arguments after --multiply that do not start with '--' as numbers, then filter out NaN values
    const numArgs = args.slice(multiplyIndex + 1)
      .filter(arg => !arg.startsWith("--"))
      .map(Number)
      .filter(num => !isNaN(num));
    const product = numArgs.reduce((acc, curr) => acc * curr, 1);
    console.log(`Multiply: ${product}`);
    return;
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

// If executed directly, run main and exit
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).then(() => process.exit(0));
}
