#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { main } from "../../src/lib/main.js";

/**
 * Run the CLI with given arguments. If 'mission' or '--mission' is passed,
 * read and print the repository mission statement.
 * Otherwise, delegate to the echo main function.
 */
export async function run(args) {
  if (args.includes('mission') || args.includes('--mission')) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const missionPath = path.resolve(__dirname, '../../MISSION.md');
    try {
      const content = await fs.readFile(missionPath, 'utf-8');
      console.log(content);
      return;
    } catch (err) {
      console.error(`Error reading mission file: ${err.message}`);
      process.exit(1);
    }
  }
  // Fallback to echo behavior
  main(args);
}

// If this file is run directly, invoke the run function
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  run(args);
}
