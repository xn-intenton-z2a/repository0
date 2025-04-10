#!/usr/bin/env node
// src/lib/main.js

import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from "url";
import * as fs from "fs";

// Utility object for file operations to allow easier testing.
export const utils = {
  readFileSyncWrapper: (file, encoding) => fs.readFileSync(file, encoding),
};

// Exported function that uses utils for consistency.
export function readFileSyncWrapper(file, encoding) {
  return utils.readFileSyncWrapper(file, encoding);
}

// Helper function to load and parse package.json
function getPkgData() {
  try {
    const pkgPath = new URL("../../package.json", import.meta.url);
    const content = utils.readFileSyncWrapper(pkgPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error("Failed to load package.json: " + error.message);
  }
}

export function main(args = process.argv.slice(2)) {
  // Log environment configuration if CLI_MODE is set
  if (process.env.CLI_MODE) {
    console.log(`Environment CLI_MODE: ${process.env.CLI_MODE}`);
  }

  let pkgData;
  const loadPkgData = () => {
    if (!pkgData) {
      pkgData = getPkgData();
    }
    return pkgData;
  };

  // Manually check for flags since tests pass pre-sliced arguments
  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      "Usage: node main.js [options]\n" +
      "Options:\n" +
      "  --help, -h                   Show help message\n" +
      "  --version                    Show package version\n" +
      "  --warning-index-mode <value> Set warning index mode (numeric value)\n" +
      "  --diagnostics                Show diagnostic information (Node version, package version, dependencies)\n" +
      "  --json-output                Output CLI response in JSON format with metadata\n" +
      "  --json-extended              Output CLI response in JSON format with extended metadata (includes current working directory and process uptime)\n" +
      "  --verbose, -v                Enable verbose logging for detailed debug information\n\n" +
      "Note: All NaN-related directives (e.g., --toggle-allow-nan, --allow-nan-inline, --diagnose-nan, --ignore-invalid) are intentionally non-operative as per project guidelines."
    );
    return;
  }

  if (args.includes("--version")) {
    try {
      const pkg = loadPkgData();
      console.log(`Package version: ${pkg.version}`);
    } catch (err) {
      if (args.includes("--json-output") || args.includes("--json-extended")) {
        console.log(JSON.stringify({ error: err.message }));
      } else {
        console.error(err.message);
      }
      process.exit(1);
    }
    return;
  }

  if (args.includes("--diagnostics")) {
    try {
      const pkg = loadPkgData();
      console.log("Diagnostics Information:");
      console.log(`Node version: ${process.version}`);
      console.log(`Package version: ${pkg.version}`);
      console.log("Dependencies:");
      for (const [dep, ver] of Object.entries(pkg.dependencies)) {
        console.log(`  ${dep}: ${ver}`);
      }
    } catch (err) {
      if (args.includes("--json-output") || args.includes("--json-extended")) {
        console.log(JSON.stringify({ error: err.message }));
      } else {
        console.error(err.message);
      }
      process.exit(1);
    }
    return;
  }

  if (args.includes("--json-extended")) {
    try {
      const pkg = loadPkgData();
      const output = {
        arguments: args,
        metadata: {
          timestamp: new Date().toISOString(),
          nodeVersion: process.version,
          packageVersion: pkg.version,
          cwd: process.cwd(),
          uptime: process.uptime(),
        },
      };
      console.log(JSON.stringify(output));
    } catch (err) {
      console.log(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
    return;
  }

  if (args.includes("--json-output")) {
    try {
      const pkg = loadPkgData();
      const output = {
        arguments: args,
        metadata: {
          timestamp: new Date().toISOString(),
          nodeVersion: process.version,
          packageVersion: pkg.version,
        },
      };
      console.log(JSON.stringify(output));
    } catch (err) {
      console.log(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
    return;
  }

  // Check for verbose flag before processing warning index mode
  if (args.includes("--verbose") || args.includes("-v")) {
    let warningIndex = null;
    const idx = args.indexOf("--warning-index-mode");
    if (idx !== -1 && args[idx + 1] !== undefined) {
      warningIndex = Number(args[idx + 1]);
    }
    console.log("Verbose Mode Enabled:");
    console.log("Parsed Arguments:", args);
    console.log("Internal State:", { warningIndex });
    return;
  }

  // Check for warning index mode flag
  const wiIdx = args.indexOf("--warning-index-mode");
  if (wiIdx !== -1 && args[wiIdx + 1] !== undefined) {
    const value = Number(args[wiIdx + 1]);
    if (!isNaN(value)) {
      console.log(`Warning index mode set to: ${value}`);
      return;
    }
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
