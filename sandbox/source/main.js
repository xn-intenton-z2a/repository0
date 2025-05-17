#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';
import { main as echoMain } from "../../src/lib/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runCLI() {
  const argv = minimist(process.argv.slice(2), {
    alias: { m: 'mission' },
    boolean: ['mission'],
    default: { mission: false }
  });

  if (argv.mission) {
    try {
      const missionPath = path.resolve(__dirname, '../../MISSION.md');
      const content = await fs.readFile(missionPath, 'utf-8');
      console.log(content);
      process.exit(0);
    } catch (err) {
      console.error(`Error reading mission file: ${err.message}`);
      process.exit(1);
    }
  } else {
    // Delegate to existing echo behavior, passing non-option arguments
    echoMain(argv._);
  }
}

runCLI();
