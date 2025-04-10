#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { readFileSync } from "fs";

export function main(args) {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      "Usage: node main.js [options]\n" +
      "Options:\n" +
      "  --help, -h                   Show help message\n" +
      "  --warning-index-mode <value> Set warning index mode (numeric value)\n" +
      "  --diagnostics                Show diagnostic information (Node version, package version, dependencies)\n\n" +
      "Note: Any NaN directives are intentionally treated as no-ops per project guidelines."
    );
    return;
  }

  if (args.includes("--diagnostics")) {
    // Determine the package.json location relative to this file
    const pkgPath = new URL("../../package.json", import.meta.url);
    const pkgData = JSON.parse(readFileSync(pkgPath, "utf-8"));

    console.log("Diagnostics Information:");
    console.log(`Node version: ${process.version}`);
    console.log(`Package version: ${pkgData.version}`);
    console.log("Dependencies:");
    for (const [dep, ver] of Object.entries(pkgData.dependencies)) {
      console.log(`  ${dep}: ${ver}`);
    }
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
