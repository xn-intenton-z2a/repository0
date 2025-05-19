#!/usr/bin/env node
import minimist from 'minimist';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

async function main() {
  const argv = minimist(process.argv.slice(2));
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
    default:
      console.log(`Unknown command: ${command}`);
      printHelp();
      break;
  }
}

function printHelp() {
  const scriptName = path.basename(process.argv[1]);
  console.log(`Usage: ${scriptName} <command> [arguments]`);
  console.log(`Commands:`);
  console.log(`  help     Show this help message`);
  console.log(`  mission  Print the mission statement`);
  console.log(`  version  Print the version from package.json`);
  console.log(`  echo     Echo the provided arguments`);
}

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

function printEcho(args) {
  console.log(args.join(' '));
}

// If run directly, execute main
if (path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
