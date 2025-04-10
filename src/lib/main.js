#!/usr/bin/env node
// src/lib/main.js

import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from "url";
import * as fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import https from "https";

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

// New helper function to generate JSON output
function generateJsonOutput(args, extended = false) {
  const pkg = getPkgData();
  let metadata = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    packageVersion: pkg.version,
  };
  if (extended) {
    metadata.cwd = process.cwd();
    metadata.uptime = process.uptime();
  }
  return JSON.stringify({
    arguments: args,
    metadata: metadata,
  });
}

// Refactored helper function to check for CLI update using async/await
async function checkForUpdate(args, argv) {
  const pkg = getPkgData();
  const currentVersion = pkg.version;
  const url = "https://registry.npmjs.org/@xn-intenton-z2a/repository0";
  try {
    const data = await new Promise((resolve, reject) => {
      const req = https.get(url, (res) => {
        let data = "";
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => { resolve(data); });
      });
      req.on('error', (err) => { reject(err); });
    });
    const jsonData = JSON.parse(data);
    const latestVersion = jsonData["dist-tags"] && jsonData["dist-tags"].latest;
    if (!latestVersion) {
      throw new Error("Latest version information not found.");
    }
    let messageText = '';
    if (latestVersion === currentVersion) {
      messageText = `You are using the latest version: ${currentVersion}`;
    } else {
      messageText = `An update is available: current version ${currentVersion}, latest version ${latestVersion}`;
    }
    if (argv["json-output"] || argv["json-extended"]) {
      console.log(JSON.stringify({ message: messageText }));
    } else {
      console.log(messageText);
    }
  } catch (err) {
    const errorMsg = "Network error: " + err.message;
    if (argv["json-output"] || argv["json-extended"]) {
      console.log(JSON.stringify({ error: errorMsg }));
    } else {
      console.error(errorMsg);
    }
    process.exit(1);
  }
}

// Consolidated help message with unified NaN flag documentation
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
  "  --check-update               Check if a new version is available from the npm registry\n\n" +
  "NaN Flags:\n" +
  "  --diagnose-nan               Display informational message about NaN handling.\n" +
  "\nNote: All NaN-related flags are non-operative per project guidelines; they provide diagnostic or informational output only.\n" +
  "(Archived Decision: The handling of NaN directives remains as a no-operation as documented in MISSION.md and CONTRIBUTING.md.)";

// Updated main to be asynchronous to support async update check
export async function main(args = process.argv.slice(2)) {
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
    .option("diagnose-nan", { type: "boolean", description: "Display informational message about NaN handling" })
    .option("check-update", { type: "boolean", description: "Check if a new version is available from the npm registry" })
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

  if (argv["check-update"]) {
    await checkForUpdate(args, argv);
    return;
  }

  if (argv["json-extended"]) {
    try {
      console.log(generateJsonOutput(args, true));
    } catch (err) {
      console.log(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
    return;
  }

  if (argv["json-output"]) {
    try {
      console.log(generateJsonOutput(args, false));
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
    // Archived decision: NaN flags are informational only and do not affect CLI functionality.
    console.log("NaN Informational Output:");
    console.log("All NaN-related flags are informational only and do not affect CLI functionality.");
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
