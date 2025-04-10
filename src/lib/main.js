#!/usr/bin/env node
// src/lib/main.js

import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from "url";
import * as fs from "fs";

// New wrapper function for fs.readFileSync to allow easier testing.
export function readFileSyncWrapper(file, encoding) {
  return fs.readFileSync(file, encoding);
}

// Helper function to load and parse package.json
function getPkgData() {
  try {
    const pkgPath = new URL("../../package.json", import.meta.url);
    const content = readFileSyncWrapper(pkgPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error("Failed to load package.json: " + error.message);
  }
}

export function main(args = []) {
  // Log environment configuration if CLI_MODE is set
  if (process.env.CLI_MODE) {
    console.log(`Environment CLI_MODE: ${process.env.CLI_MODE}`);
  }

  const verbose = args.includes("--verbose");

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
        "  --verbose                    Enable verbose logging for detailed debug information\n\n" +
        "Note: Any NaN directives are intentionally treated as no-ops per project guidelines."
    );
    return;
  }

  if (args.includes("--version")) {
    try {
      const pkgData = getPkgData();
      console.log(`Package version: ${pkgData.version}`);
      return;
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  if (args.includes("--diagnostics")) {
    try {
      const pkgData = getPkgData();
      console.log("Diagnostics Information:");
      console.log(`Node version: ${process.version}`);
      console.log(`Package version: ${pkgData.version}`);
      console.log("Dependencies:");
      for (const [dep, ver] of Object.entries(pkgData.dependencies)) {
        console.log(`  ${dep}: ${ver}`);
      }
      return;
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  if (args.includes("--json-extended")) {
    try {
      const pkgData = getPkgData();
      const output = {
        arguments: args,
        metadata: {
          timestamp: new Date().toISOString(),
          nodeVersion: process.version,
          packageVersion: pkgData.version,
          cwd: process.cwd(),
          uptime: process.uptime()
        }
      };
      console.log(JSON.stringify(output));
      return;
    } catch (err) {
      console.log(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
  }

  if (args.includes("--json-output")) {
    try {
      const pkgData = getPkgData();
      const output = {
        arguments: args,
        metadata: {
          timestamp: new Date().toISOString(),
          nodeVersion: process.version,
          packageVersion: pkgData.version
        }
      };
      console.log(JSON.stringify(output));
      return;
    } catch (err) {
      console.log(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
  }

  let warningIndex = null;
  const warningIndexFlag = "--warning-index-mode";
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

  // Additional verbose logging
  if (verbose) {
    console.log("Verbose Mode Enabled:");
    console.log("Parsed Arguments:", args);
    console.log("Internal State:", { warningIndex });
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
