#!/usr/bin/env node
import minimist from 'minimist';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

/**
 * Parse CLI arguments into options object.
 * Unknown flags cause an error and exit code 1.
 * @param {string[]} args
 * @returns {{help:boolean,version:boolean,diagnostics:boolean}}
 */
export function parseArgs(args = []) {
  const parsed = minimist(args, {
    boolean: ['help', 'version', 'diagnostics'],
    unknown: (opt) => { console.error(`Unknown option: ${opt}`); printUsage(); process.exit(1); }
  });
  return {
    help: Boolean(parsed.help),
    version: Boolean(parsed.version),
    diagnostics: Boolean(parsed.diagnostics)
  };
}

/**
 * Print usage information.
 */
export function printUsage() {
  console.log('Usage: node src/lib/main.js [options]');
  console.log('Options:');
  console.log('  --help         Show usage information and exit');
  console.log('  --version      Print tool version and exit');
  console.log('  --diagnostics  Print system diagnostics and exit');
}

/**
 * Print the version from package.json.
 */
export function printVersion() {
  const require = createRequire(import.meta.url);
  const pkg = require('../../package.json');
  console.log(pkg.version);
}

/**
 * Print system diagnostics as JSON.
 */
export function printDiagnostics() {
  const diag = {
    nodeVersion: process.versions.node,
    platform: process.platform,
    cwd: process.cwd(),
    env: { ...process.env }
  };
  console.log(JSON.stringify(diag, null, 2));
}

/**
 * Main entry point for the CLI.
 * @param {string[]} args
 */
export function main(args = process.argv.slice(2)) {
  const options = parseArgs(args);
  if (options.help) {
    printUsage();
    process.exit(0);
  }
  if (options.version) {
    printVersion();
    process.exit(0);
  }
  if (options.diagnostics) {
    printDiagnostics();
    process.exit(0);
  }
  console.log('Options:', options);
}

// Run if invoked directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}