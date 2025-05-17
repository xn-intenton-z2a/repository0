#!/usr/bin/env node
import minimist from "minimist";
import { main as echoMain } from "../../src/lib/main.js";
import pkg from "../../package.json" assert { type: "json" };
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

// Parse CLI arguments
const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs, {
  alias: { h: "help", v: "version" },
  boolean: ["help", "version", "mission"],
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

// Fallback: echo remaining arguments
const positional = args._ || [];
echoMain(positional);
