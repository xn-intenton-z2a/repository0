#!/usr/bin/env node
// sandbox/source/main.js

import { fileURLToPath } from "url";
import fs from "fs";

/**
 * Template for discussion seeds.
 */
export const SEED_TEMPLATE = `# Discussion Seed

## Topic 1: [Placeholder]

## Topic 2: [Placeholder]
`;

/**
 * Main CLI entrypoint.
 * @param {string[]} args - CLI arguments (excluding node and script path).
 */
export function main(args = process.argv.slice(2)) {
  const [cmd, ...rest] = args;

  if (cmd === "seed") {
    const outIndex = rest.indexOf("--output");
    if (outIndex !== -1 && rest[outIndex + 1]) {
      const filepath = rest[outIndex + 1];
      fs.writeFileSync(filepath, SEED_TEMPLATE);
    } else {
      console.log(SEED_TEMPLATE);
    }
    process.exit(0);
  }

  // Fallback to original behavior
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}