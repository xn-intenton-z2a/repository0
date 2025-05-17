#!/usr/bin/env node
import minimist from "minimist";
import path from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { main as echoMain } from "../../src/lib/main.js";

// Load package.json without import assertions to avoid deprecation warnings
const pkgPath = fileURLToPath(new URL("../../package.json", import.meta.url));
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

// Parse CLI arguments
const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs, {
  alias: { h: "help", v: "version" },
  boolean: ["help", "version", "mission", "env"],
  stopEarly: true,
});

/**
 * Display usage information
 */
function showHelp() {
  console.log(`Usage: npm run start -- [options] [arguments]

A demo CLI tool for repository0.

Options:
  --help, -h     Show help.
  --version, -v  Show version.
  --mission      Show mission statement.
  --env          Load and display environment variables from a .env file.
`);
}

/**
 * Display version from package.json
 */
function showVersion() {
  console.log(pkg.version);
}

/**
 * Display mission statement from MISSION.md
 */
function showMission() {
  const missionPath = fileURLToPath(
    new URL("../../MISSION.md", import.meta.url)
  );
  const content = readFileSync(missionPath, "utf-8");
  console.log(content);
}

// Handle flags
if (args.help) {
  showHelp();
  process.exit(0);
}

if (args.version) {
  showVersion();
  process.exit(0);
}

if (args.mission) {
  showMission();
  process.exit(0);
}

if (args.env) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    const raw = readFileSync(envPath, "utf-8");
    const lines = raw.split(/\r?\n/);
    const parsed = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) {
        console.error(`Failed to load .env: Invalid syntax at line "${line}"`);
        process.exit(1);
      }
      parsed[match[1]] = match[2];
    }
    const keys = Object.keys(parsed).sort();
    keys.forEach(key => console.log(`${key}=${parsed[key]}`));
    process.exit(0);
  } catch (err) {
    console.error(`Failed to load .env: ${err.message}`);
    process.exit(1);
  }
}

// Fallback: echo remaining arguments
const positional = args._ || [];
echoMain(positional);
