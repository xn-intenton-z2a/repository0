#!/usr/bin/env node
import minimist from 'minimist';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

async function showHelp() {
  console.log(`Usage: <command> [arguments]
help      Displays usage instructions and available commands
mission   Prints the mission statement from MISSION.md
version   Prints the version from package.json
echo      Echoes the provided arguments`);
}

async function showMission() {
  const missionPath = path.resolve(process.cwd(), 'MISSION.md');
  const content = await fs.readFile(missionPath, 'utf-8');
  console.log(content);
}

async function showVersion() {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  const pkgContent = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(pkgContent);
  console.log(pkg.version);
}

async function echoArgs(args) {
  console.log(args.join(' '));
}

export async function main(inputArgs = process.argv.slice(2)) {
  const argv = minimist(inputArgs);
  const [cmd, ...rest] = argv._;
  switch (cmd) {
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
      await echoArgs(rest);
      break;
    default:
      await showHelp();
      break;
  }
}

const __filename = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === __filename) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
