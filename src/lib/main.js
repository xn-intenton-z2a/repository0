#!/usr/bin/env node
// src/lib/main.js

import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from "url";
import * as fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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

// NOTE: The CLI includes options related to NaN directives. 
// These directives (e.g., --diagnose-nan) are intentionally non-operative per project guidelines.
// They are provided solely for informational purposes and do not affect application functionality.
const helpMessage =
  "Usage: node main.js [options]\n" +
  "Options:\n" +
  "  --help, -h                   Show help message\n" +
  "  --pkg-version                Show package version\n" +
  "  --warning-index-mode <value> Set warning index mode (numeric value)\n" +
  "  --diagnostics                Show diagnostic information (Node version, package version, dependencies)\n" +
  "  --json-output                Output CLI response in JSON format with metadata\n" +
  "  --json-extended              Output CLI response in JSON format with extended metadata (includes current working directory and process uptime)\n" +
  "  --verbose, -v                Enable verbose logging for detailed debug information\n" +
  "  --diagnose-nan               Show NaN diagnostic information\n\n" +
  "Note: All CLI flags related to NaN (e.g., --toggle-allow-nan, --allow-nan-inline, --diagnose-nan, --ignore-invalid) are intentionally non-operative per project guidelines and do not affect functionality.";

export function main(args = process.argv.slice(2)) {
  // Log environment configuration if CLI_MODE is set
  if (process.env.CLI_MODE) {
    console.log(`Environment CLI_MODE: ${process.env.CLI_MODE}`);
  }

  // Parse command-line arguments using yargs
  const argv = yargs(args)
    .usage("Usage: node main.js [options]")
    .option("help", { alias: "h", type: "boolean", description: "Show help message" })
    .option("pkg-version", { type: "boolean", description: "Show package version" })
    .option("warning-index-mode", { type: "number", description: "Set warning index mode (numeric value)" })
    .option("diagnostics", { type: "boolean", description: "Show diagnostic information (Node version, package version, dependencies)" })
    .option("json-output", { type: "boolean", description: "Output CLI response in JSON format with metadata" })
    .option("json-extended", { type: "boolean", description: "Output CLI response in JSON format with extended metadata (includes current working directory and process uptime)" })
    .option("verbose", { alias: "v", type: "boolean", description: "Enable verbose logging for detailed debug information" })
    .option("diagnose-nan", { type: "boolean", description: "Show NaN diagnostic information" })
    .help(false)
    .version(false)
    .parse();

  if (argv.help) {
    console.log(helpMessage);
    return;
  }

  if (argv["pkg-version"]) {
    try {
      const pkg = getPkgData();
      console.log(`Package version: ${pkg.version}`);
    } catch (err) {
      const errorMsg = err.message;
      if (argv["json-output"] || argv["json-extended"]) {
        console.log(JSON.stringify({ error: errorMsg }));
      } else {
        console.error(errorMsg);
      }
      process.exit(1);
    }
    return;
  }

  if (argv.diagnostics) {
    try {
      const pkg = getPkgData();
      console.log("Diagnostics Information:");
      console.log(`Node version: ${process.version}`);
      console.log(`Package version: ${pkg.version}`);
      console.log("Dependencies:");
      for (const [dep, ver] of Object.entries(pkg.dependencies)) {
        console.log(`  ${dep}: ${ver}`);
      }
    } catch (err) {
      const errorMsg = err.message;
      if (argv["json-output"] || argv["json-extended"]) {
        console.log(JSON.stringify({ error: errorMsg }));
      } else {
        console.error(errorMsg);
      }
      process.exit(1);
    }
    return;
  }

  if (argv["json-extended"]) {
    try {
      const pkg = getPkgData();
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

  if (argv["json-output"]) {
    try {
      const pkg = getPkgData();
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

  if (argv.verbose) {
    const warningIndex = argv["warning-index-mode"] !== undefined ? argv["warning-index-mode"] : null;
    console.log("Verbose Mode Enabled:");
    console.log("Parsed Arguments:", args);
    console.log("Internal State:", { warningIndex });
    return;
  }

  if (argv["diagnose-nan"]) {
    // Note: NaN related directives are intentionally non-operative per project guidelines.
    console.log("NaN Diagnostics:");
    console.log("- NaN directives are intentionally treated as no-ops per project guidelines.");
    return;
  }

  if (argv["warning-index-mode"] !== undefined) {
    const value = argv["warning-index-mode"];
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
