import fs from 'fs';
import path from 'path';

/**
 * Parse command-line arguments.
 * @param {string[]} args
 * @returns {{help: boolean, version: boolean, diagnostics: boolean}}
 */
export function parseArgs(args) {
  const options = { help: false, version: false, diagnostics: false };
  for (const arg of args) {
    if (arg === '--help') {
      options.help = true;
    } else if (arg === '--version') {
      options.version = true;
    } else if (arg === '--diagnostics') {
      options.diagnostics = true;
    } else {
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
    }
  }
  return options;
}

/**
 * Print usage information.
 */
export function printUsage() {
  console.log('Usage: node src/lib/main.js [options]');
  console.log('Options:');
  console.log('  --help         Show usage information and exit');
  console.log('  --version      Print current tool version and exit');
  console.log('  --diagnostics  Collect and display system diagnostics and exit');
}

/**
 * Print version from package.json.
 * @returns {string}
 */
export function printVersion() {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  let version;
  try {
    const content = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(content);
    version = pkg.version;
  } catch (e) {
    console.error(`Failed to read version from package.json: ${e.message}`);
    process.exit(1);
  }
  console.log(version);
  return version;
}

/**
 * Print system diagnostics.
 * @returns {object}
 */
export function printDiagnostics() {
  const diag = {
    nodeVersion: process.version,
    platform: process.platform,
    cwd: process.cwd(),
    env: process.env,
  };
  console.log(JSON.stringify(diag, null, 2));
  return diag;
}

/**
 * Main CLI entry point.
 * @param {string[]} args
 * @returns {{help: boolean, version: boolean, diagnostics: boolean}}
 */
export function main(args) {
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
  return options;
}

// Execute main when run as CLI
if (process.argv[1] && process.argv[1].endsWith('src/lib/main.js')) {
  main(process.argv.slice(2));
}
