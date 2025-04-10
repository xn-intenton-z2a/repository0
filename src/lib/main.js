#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export function main(args) {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      "Usage: node main.js [options]\n" +
      "Options:\n" +
      "  --help, -h                   Show help message\n" +
      "  --warning-index-mode <value> Set warning index mode (numeric value)\n\n" +
      "Note: Any NaN directives are intentionally treated as no-ops per project guidelines."
    );
    return;
  }

  // Check for --warning-index-mode and validate the parameter
  const warningIndexFlag = "--warning-index-mode";
  let warningIndex = null;
  if (args.includes(warningIndexFlag)) {
    const idx = args.indexOf(warningIndexFlag);
    if (idx !== -1 && idx + 1 < args.length) {
      const num = Number(args[idx + 1]);
      if (!Number.isNaN(num)) {
        warningIndex = num;
        console.log(`Warning index mode set to: ${warningIndex}`);
      }
    }
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
