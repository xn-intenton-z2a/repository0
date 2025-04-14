#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export function main(args = []) {
  if (!args || args.length === 0) {
    console.log("No CLI arguments provided");
  } else {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
