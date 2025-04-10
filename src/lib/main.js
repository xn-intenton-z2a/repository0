#!/usr/bin/env node
// src/lib/main.js

import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from "url";
import * as fs from "fs";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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
  let pkgData;
  try {
    pkgData = getPkgData();
  } catch (err) {
    if (args.includes("--json-output") || args.includes("--json-extended")) {
      console.log(JSON.stringify({ error: err.message }));
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }

  // Parse command-line arguments using yargs
  const argv = yargs(hideBin(args))
    .usage("Usage: node main.js [options]")
    .option("help", {
      alias: "h",
      type: "boolean",
      description: "Show help message",
    })
    .option("version", {
      type: "boolean",
      description: "Show package version",
    })
    .option("diagnostics", {
      type: "boolean",
      description: "Show diagnostic information (Node version, package version, dependencies)",
    })
    .option("json-output", {
      type: "boolean",
      description: "Output CLI response in JSON format with metadata",
    })
    .option("json-extended", {
      type: "boolean",
      description: "Output CLI response in JSON format with extended metadata (includes current working directory and process uptime)",
    })
    .option("warning-index-mode", {
      type: "number",
      description: "Set warning index mode (numeric value)",
    })
    .option("verbose", {
      alias: "v",
      type: "boolean",
      description: "Enable verbose logging for detailed debug information",
    })
    .help(false) // disable automatic help
    .version(false) // disable automatic version
    .parse();

  // Log environment configuration if CLI_MODE is set
  if (process.env.CLI_MODE) {
    console.log(`Environment CLI_MODE: ${process.env.CLI_MODE}`);
  }

  if (argv.help) {
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
        "Note: Any NaN directives are intentionally treated as no-ops per project guidelines."
    );
    return;
  }

  if (argv.version) {
    console.log(`Package version: ${pkgData.version}`);
    return;
  }

  if (argv.diagnostics) {
    console.log("Diagnostics Information:");
    console.log(`Node version: ${process.version}`);
    console.log(`Package version: ${pkgData.version}`);
    console.log("Dependencies:");
    for (const [dep, ver] of Object.entries(pkgData.dependencies)) {
      console.log(`  ${dep}: ${ver}`);
    }
    return;
  }

  if (argv['json-extended']) {
    const output = {
      arguments: args,
      metadata: {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        packageVersion: pkgData.version,
        cwd: process.cwd(),
        uptime: process.uptime(),
      },
    };
    console.log(JSON.stringify(output));
    return;
  }

  if (argv['json-output']) {
    const output = {
      arguments: args,
      metadata: {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        packageVersion: pkgData.version,
      },
    };
    console.log(JSON.stringify(output));
    return;
  }

  if (typeof argv['warning-index-mode'] === 'number') {
    console.log(`Warning index mode set to: ${argv['warning-index-mode']}`);
  }

  if (argv.verbose) {
    console.log("Verbose Mode Enabled:");
    console.log("Parsed Arguments:", argv);
    console.log("Internal State:", { warningIndex: argv['warning-index-mode'] || null });
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
