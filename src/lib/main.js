#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export function main(args) {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      "Usage: node main.js [options]\n" +
      "Options:\n" +
      "  --help, -h       Show help message\n\n" +
      "Note: Any NaN directives are intentionally treated as no-ops per project guidelines."
    );
    return;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
