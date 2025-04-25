#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import process from "process";

const VERSION = "2.1.0-0";

export function main(args) {
  if (args.length > 0) {
    const command = args[0];
    if (command === "version") {
      console.log(VERSION);
      return;
    } else if (command === "diagnostics") {
      const diagnostics = {
        nodeVersion: process.version,
        message: "Diagnostics info: all systems operational"
      };
      console.log(JSON.stringify(diagnostics));
      return;
    }
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
