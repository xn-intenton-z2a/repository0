#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export function main(args) {
  if (args && args.includes("--help")) {
    console.log("Usage: node src/lib/main.js [options]\nOptions:\n  --help     Show help");
    return;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
