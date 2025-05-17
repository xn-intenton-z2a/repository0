#!/usr/bin/env node
import minimist from "minimist";
import { main as echoMain } from "../../src/lib/main.js";
import pkg from "../../package.json" assert { type: "json" };

// Parse CLI arguments
const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs, {
  alias: { h: "help", v: "version" },
  boolean: ["help", "version"],
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
`);
}

/**
 * Display version from package.json
 */
function showVersion() {
  console.log(pkg.version);
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

// Fallback: echo remaining arguments
const positional = args._ || [];
echoMain(positional);
