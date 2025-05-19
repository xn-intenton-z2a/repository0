#!/usr/bin/env node
import minimist from 'minimist';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Choose a random house, optionally using a seed for deterministic output.
 * @param {string[]} houses - Array of house names
 * @param {number} [seed] - Optional numeric seed for reproducibility
 * @returns {string} - Selected house
 */
function chooseHouse(houses, seed) {
  if (!Array.isArray(houses) || houses.length === 0) {
    throw new Error('Houses must be a non-empty array');
  }
  let random = Math.random;
  if (seed !== undefined) {
    const m = 0x80000000; // 2^31
    const a = 1103515245;
    const c = 12345;
    let state = seed % m;
    random = function () {
      state = (a * state + c) % m;
      return state / m;
    };
  }
  const index = Math.floor(random() * houses.length);
  return houses[index];
}

/**
 * Main entrypoint for CLI commands.
 * Accepts an optional array of args for testing.
 * @param {string[]} [inputArgs] - Arguments to parse (default: process.argv.slice(2))
 */
async function main(inputArgs) {
  const argv = minimist(
    inputArgs !== undefined ? inputArgs : process.argv.slice(2),
    { boolean: ['list'], alias: { l: 'list' } }
  );
  const [command, ...args] = argv._;

  switch (command) {
    case 'help':
    case undefined:
      printHelp();
      break;
    case 'mission':
      await printMission();
      break;
    case 'version':
      await printVersion();
      break;
    case 'echo':
      printEcho(args);
      break;
    case 'house-choice': {
      const houses = [
        'Gryffindor',
        'Hufflepuff',
        'Ravenclaw',
        'Slytherin',
      ];
      if (argv.list) {
        console.log(houses.join('\n'));
      } else {
        const seed = argv.seed !== undefined ? Number(argv.seed) : undefined;
        const chosen = chooseHouse(houses, seed);
        console.log(chosen);
      }
      break;
    }
    default:
      console.log(`Unknown command: ${command}`);
      printHelp();
      break;
  }
}

/**
 * Print help text for available commands.
 */
function printHelp() {
  const scriptName = path.basename(process.argv[1]);
  console.log(`Usage: ${scriptName} <command> [arguments]`);
  console.log(`Commands:`);
  console.log(`  help         Show this help message`);
  console.log(`  mission      Print the mission statement`);
  console.log(`  version      Print the version from package.json`);
  console.log(`  echo         Echo the provided arguments`);
  console.log(`  house-choice Randomly choose a house or list all houses`);
}

/**
 * Read and print the mission statement.
 */
async function printMission() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const missionPath = path.resolve(__dirname, '../../MISSION.md');
  try {
    const content = await readFile(missionPath, 'utf-8');
    console.log(content.trim());
  } catch (err) {
    console.error(`Error reading mission: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Read and print the package version.
 */
async function printVersion() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pkgPath = path.resolve(__dirname, '../../package.json');
  try {
    const content = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    console.log(pkg.version);
  } catch (err) {
    console.error(`Error reading version: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Echo provided arguments.
 * @param {string[]} args
 */
function printEcho(args) {
  console.log(args.join(' '));
}

// If run directly, execute main
if (path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { main, chooseHouse };