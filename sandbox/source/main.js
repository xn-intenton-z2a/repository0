#!/usr/bin/env node
import minimist from 'minimist';
import fs from 'fs/promises';
import path from 'path';

async function showHelp() {
  console.log(`Usage: npm run start -- <command> [args]

Commands:
  help        Display this help message
  mission     Print the mission statement
  version     Print the current version
  echo        Echo the provided arguments

Examples:
  npm run start -- help
  npm run start -- mission
  npm run start -- version
  npm run start -- echo Hello World`);
}

async function showMission() {
  try {
    const cwd = process.cwd();
    const content = await fs.readFile(path.join(cwd, 'MISSION.md'), 'utf-8');
    console.log(content);
  } catch (err) {
    console.error('Error reading mission:', err.message);
    process.exit(1);
  }
}

async function showVersion() {
  try {
    const cwd = process.cwd();
    const pkg = await fs.readFile(path.join(cwd, 'package.json'), 'utf-8');
    const { version } = JSON.parse(pkg);
    console.log(version);
  } catch (err) {
    console.error('Error reading version:', err.message);
    process.exit(1);
  }
}

async function doEcho(args) {
  console.log(args.join(' '));
}

async function main() {
  const argv = minimist(process.argv.slice(2));
  const [command, ...rest] = argv._;
  switch (command) {
    case 'help':
    case undefined:
      await showHelp();
      break;
    case 'mission':
      await showMission();
      break;
    case 'version':
      await showVersion();
      break;
    case 'echo':
      await doEcho(rest);
      break;
    default:
      console.log(`Unknown command: ${command}\n`);
      await showHelp();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});