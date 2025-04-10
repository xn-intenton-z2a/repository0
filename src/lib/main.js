#!/usr/bin/env node
// src/lib/main.js

import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from 'url';
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import https from 'https';

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
    const pkgPath = new URL('../../package.json', import.meta.url);
    const content = utils.readFileSyncWrapper(pkgPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error('Failed to load package.json: ' + error.message);
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
  const url = 'https://registry.npmjs.org/@xn-intenton-z2a/repository0';
  try {
    const data = await new Promise((resolve, reject) => {
      const req = https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => { resolve(data); });
      });
      req.on('error', (err) => { reject(err); });
    });
    const jsonData = JSON.parse(data);
    const latestVersion = jsonData['dist-tags'] && jsonData['dist-tags'].latest;
    if (!latestVersion) {
      throw new Error('Latest version information not found.');
    }
    let messageText = '';
    if (latestVersion === currentVersion) {
      messageText = `You are using the latest version: ${currentVersion}`;
    } else {
      messageText = `An update is available: current version ${currentVersion}, latest version ${latestVersion}`;
    }
    if (argv['json-output'] || argv['json-extended']) {
      console.log(JSON.stringify({ message: messageText }));
    } else {
      console.log(messageText);
    }
  } catch (err) {
    const errorMsg = 'Network error: ' + err.message;
    if (argv['json-output'] || argv['json-extended']) {
      console.log(JSON.stringify({ error: errorMsg }));
    } else {
      console.error(errorMsg);
    }
    process.exit(1);
  }
}

// Consolidated help message with updated subcommand documentation
const helpMessage =
  'Usage: node main.js <command> [options]\n' +
  '\n' +
  'Commands:\n' +
  '  version         Display the package version\n' +
  '  diagnostics     Show diagnostic information\n' +
  '  update          Check if a new version is available from the npm registry\n' +
  '  json [--extended]    Output CLI response in JSON format (use --extended for more metadata)\n' +
  '  verbose [--warning <num>]   Enable verbose logging (or set warning index mode)\n' +
  '  warn --value <num>          Set warning index mode explicitly\n' +
  '  nan             Display informational output regarding NaN flags (usage: node main.js nan). This command is informational only; see MISSION.md and CONTRIBUTING.md for guidelines.\n' +
  '\n' +
  'Legacy Flag Support (mapped to subcommands):\n' +
  '  --help, -h, --pkg-version, --diagnostics, --check-update, --json-output, --json-extended, --verbose, --warning-index-mode, --diagnose-nan\n' +
  '\n' +
  'Note: NaN-related flags are informational only per project guidelines.';

// Updated main to support subcommand architecture while retaining legacy flag behavior
export async function main(args = process.argv.slice(2)) {
  // Log environment configuration if CLI_MODE is set
  if (process.env.CLI_MODE) {
    console.log(`Environment CLI_MODE: ${process.env.CLI_MODE}`);
  }

  const legacyOptions = {
    help: { alias: 'h', type: 'boolean', description: 'Show help message' },
    'pkg-version': { type: 'boolean', description: 'Show package version' },
    diagnostics: { type: 'boolean', description: 'Show diagnostic information' },
    'json-output': { type: 'boolean', description: 'Output JSON formatted response' },
    'json-extended': { type: 'boolean', description: 'Output extended JSON formatted response' },
    verbose: { alias: 'v', type: 'boolean', description: 'Enable verbose logging' },
    'warning-index-mode': { type: 'number', description: 'Set warning index mode (numeric value)' },
    'diagnose-nan': { type: 'boolean', description: 'NaN informational flag' },
    'check-update': { type: 'boolean', description: 'Check for CLI update' }
  };

  const parser = yargs(args)
    .usage('Usage: $0 <command> [options]')
    .options(legacyOptions)
    .command(
      'version',
      'Display the package version',
      () => {},
      (argv) => {
        try {
          const pkg = getPkgData();
          console.log(`Package version: ${pkg.version}`);
        } catch (err) {
          const errorMsg = err.message;
          if (argv['json-output'] || argv['json-extended']) {
            console.log(JSON.stringify({ error: errorMsg }));
          } else {
            console.error(errorMsg);
          }
          process.exit(1);
        }
      }
    )
    .command(
      'diagnostics',
      'Show diagnostic information',
      () => {},
      (argv) => {
        try {
          const pkg = getPkgData();
          console.log('Diagnostics Information:');
          console.log(`Node version: ${process.version}`);
          console.log(`Package version: ${pkg.version}`);
          console.log('Dependencies:');
          for (const [dep, ver] of Object.entries(pkg.dependencies)) {
            console.log(`  ${dep}: ${ver}`);
          }
        } catch (err) {
          const errorMsg = err.message;
          if (argv['json-output'] || argv['json-extended']) {
            console.log(JSON.stringify({ error: errorMsg }));
          } else {
            console.error(errorMsg);
          }
          process.exit(1);
        }
      }
    )
    .command(
      'update',
      'Check if a new version is available from the npm registry',
      () => {},
      async (argv) => {
        await checkForUpdate(args, argv);
      }
    )
    .command(
      'json',
      'Output CLI response in JSON format',
      (yargs) => {
        return yargs.option('extended', {
          alias: 'e',
          type: 'boolean',
          description: 'Output extended metadata',
        }).positional('extra', {
          type: 'string',
          array: true,
          describe: 'Additional arguments',
          default: []
        });
      },
      (argv) => {
        try {
          if (argv.extended) console.log(generateJsonOutput(args, true));
          else console.log(generateJsonOutput(args, false));
        } catch (err) {
          const errorMsg = err.message;
          console.log(JSON.stringify({ error: errorMsg }));
          process.exit(1);
        }
      }
    )
    .command(
      'verbose',
      'Enable verbose logging',
      (yargs) => {
        return yargs.option('warning', {
          alias: 'w',
          type: 'number',
          description: 'Set warning index mode',
        });
      },
      (argv) => {
        if (argv.warning !== undefined) {
          console.log(`Warning index mode set to: ${argv.warning}`);
        } else {
          console.log('Verbose Mode Enabled:');
          console.log('Parsed Arguments:', args);
          console.log('Internal State:', { warningIndex: argv['warning-index-mode'] || null });
        }
      }
    )
    .command(
      'warn',
      'Set warning index mode',
      (yargs) => {
        return yargs.option('value', {
          type: 'number',
          demandOption: true,
          description: 'Warning index mode number',
        });
      },
      (argv) => {
        console.log(`Warning index mode set to: ${argv.value}`);
      }
    )
    .command(
      'nan',
      false,
      () => {},
      (argv) => {
        console.log('NaN Informational Output:');
        console.log('This command is for informational purposes only. It does not affect program behavior.');
        console.log('Refer to MISSION.md and CONTRIBUTING.md for guidelines on NaN usage.');
      }
    )
    .help(false)
    .version(false)
    .parserConfiguration({ "unknown-options-as-args": true })
    .exitProcess(false);

  // Use async parsing to support asynchronous command handlers
  const parsed = await parser.parseAsync();

  // If no subcommand provided, check for legacy flag-based calls
  if (!parsed._ || parsed._.length === 0) {
    if (parsed.help) {
      console.log(helpMessage);
      return;
    }
    if (parsed['pkg-version']) {
      try {
        const pkg = getPkgData();
        console.log(`Package version: ${pkg.version}`);
      } catch (err) {
        const errorMsg = err.message;
        if (parsed['json-output'] || parsed['json-extended']) {
          console.log(JSON.stringify({ error: errorMsg }));
        } else {
          console.error(errorMsg);
        }
        process.exit(1);
      }
      return;
    }
    if (parsed.diagnostics) {
      try {
        const pkg = getPkgData();
        console.log('Diagnostics Information:');
        console.log(`Node version: ${process.version}`);
        console.log(`Package version: ${pkg.version}`);
        console.log('Dependencies:');
        for (const [dep, ver] of Object.entries(pkg.dependencies)) {
          console.log(`  ${dep}: ${ver}`);
        }
      } catch (err) {
        const errorMsg = err.message;
        if (parsed['json-output'] || parsed['json-extended']) {
          console.log(JSON.stringify({ error: errorMsg }));
        } else {
          console.error(errorMsg);
        }
        process.exit(1);
      }
      return;
    }
    if (parsed['check-update']) {
      await checkForUpdate(args, parsed);
      return;
    }
    if (parsed['json-extended']) {
      try {
        console.log(generateJsonOutput(args, true));
      } catch (err) {
        console.log(JSON.stringify({ error: err.message }));
        process.exit(1);
      }
      return;
    }
    if (parsed['json-output']) {
      try {
        console.log(generateJsonOutput(args, false));
      } catch (err) {
        console.log(JSON.stringify({ error: err.message }));
        process.exit(1);
      }
      return;
    }
    if (parsed.verbose) {
      if (parsed['warning-index-mode'] !== undefined) {
        console.log(`Warning index mode set to: ${parsed['warning-index-mode']}`);
      } else {
        console.log('Verbose Mode Enabled:');
        console.log('Parsed Arguments:', args);
        console.log('Internal State:', { warningIndex: parsed['warning-index-mode'] || null });
      }
      return;
    }
    if (parsed['diagnose-nan']) {
      console.log('NaN Informational Output:');
      console.log('This command is for informational purposes only. Refer to MISSION.md and CONTRIBUTING.md for guidelines.');
      return;
    }
    if (parsed['warning-index-mode'] !== undefined) {
      const value = parsed['warning-index-mode'];
      if (!isNaN(value)) {
        console.log(`Warning index mode set to: ${value}`);
        return;
      }
    }
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
