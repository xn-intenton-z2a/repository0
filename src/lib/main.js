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

// Consolidated help message emphasizing subcommand usage and deprecation of legacy flags
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
  '  nan             Display informational output regarding NaN flags\n' +
  '\n' +
  'Note: Legacy CLI flags are deprecated. Please use the subcommand architecture for all operations.';

// Updated main to support subcommand architecture and deprecate legacy flags
export async function main(args = process.argv.slice(2)) {
  if (process.env.CLI_MODE) {
    console.log(`Environment CLI_MODE: ${process.env.CLI_MODE}`);
  }

  // Early handling of legacy flags
  const legacyFlagMapping = {
    '--help': () => {
      console.log('Deprecation Warning: Legacy flag --help is deprecated. Use subcommands instead.');
      console.log(helpMessage);
    },
    '--pkg-version': () => {
      console.log('Deprecation Warning: Legacy flag --pkg-version is deprecated. Use the "version" subcommand instead.');
      try {
        const pkg = getPkgData();
        console.log(`Package version: ${pkg.version}`);
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    },
    '--diagnostics': () => {
      console.log('Deprecation Warning: Legacy flag --diagnostics is deprecated. Use the "diagnostics" subcommand instead.');
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
        console.error(err.message);
        process.exit(1);
      }
    },
    '--check-update': async () => {
      console.log('Deprecation Warning: Legacy flag --check-update is deprecated. Use the "update" subcommand instead.');
      await checkForUpdate(args, {});
    },
    '--json-extended': () => {
      console.log('Deprecation Warning: Legacy flag --json-extended is deprecated. Use "json --extended" subcommand instead.');
      try {
        console.log(generateJsonOutput(args, true));
      } catch (err) {
        console.log(JSON.stringify({ error: err.message }));
        process.exit(1);
      }
    },
    '--json-output': () => {
      console.log('Deprecation Warning: Legacy flag --json-output is deprecated. Use the "json" subcommand instead.');
      try {
        console.log(generateJsonOutput(args, false));
      } catch (err) {
        console.log(JSON.stringify({ error: err.message }));
        process.exit(1);
      }
    },
    '--verbose': () => {
      console.log('Deprecation Warning: Legacy flag --verbose is deprecated. Use the "verbose" subcommand instead.');
      const index = args.indexOf('--warning-index-mode');
      if (index >= 0 && args.length > index + 1) {
        console.log(`Warning index mode set to: ${args[index + 1]}`);
      } else {
        console.log('Verbose Mode Enabled:');
        console.log('Parsed Arguments:', args);
        console.log('Internal State:', { warningIndex: null });
      }
    },
    '--diagnose-nan': () => {
      console.log('Deprecation Warning: Legacy flag --diagnose-nan is deprecated. Use the "nan" subcommand instead.');
      console.log('NaN Informational Output:');
      console.log('This command is for informational purposes only. Refer to MISSION.md and CONTRIBUTING.md for guidelines.');
    },
    '--warning-index-mode': () => {
      const index = args.indexOf('--warning-index-mode');
      if (index >= 0 && args.length > index + 1) {
        console.log('Deprecation Warning: Legacy flag --warning-index-mode is deprecated. Use the "verbose" or "warn" subcommand instead.');
        console.log(`Warning index mode set to: ${args[index + 1]}`);
      }
    }
  };

  for (const flag in legacyFlagMapping) {
    if (args.includes(flag)) {
      const handler = legacyFlagMapping[flag];
      // If the handler returns a promise, await it
      const result = handler();
      if (result instanceof Promise) {
        await result;
      }
      return;
    }
  }

  // Define only the new subcommands; legacy flags will be handled by the block above.
  const parser = yargs(args)
    .usage('Usage: $0 <command> [options]')
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
      'Display informational output regarding NaN flags (this command is purely informational and non-operative)',
      () => {},
      (argv) => {
        // This subcommand is informational only and does not affect program behavior.
        console.log('NaN Informational Output:');
        console.log('This command is for informational purposes only. It does not affect program behavior.');
        console.log('Refer to MISSION.md and CONTRIBUTING.md for guidelines on NaN usage.');
      }
    )
    .help(false)
    .version(false)
    .parserConfiguration({ "unknown-options-as-args": true })
    .exitProcess(false);

  // Parse the arguments
  const parsed = await parser.parseAsync();

  // If no subcommand is provided, show the help message
  if (!parsed._ || parsed._.length === 0) {
    console.log(`No valid subcommand provided.\n${helpMessage}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
