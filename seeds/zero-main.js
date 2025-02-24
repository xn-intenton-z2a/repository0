#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  console.log(`Run with: ${JSON.stringify(args)}`);
}
