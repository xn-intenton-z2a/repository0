#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export function main(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

export function gcd(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a <= 0 || b <= 0) {
    throw new Error("gcd function requires two positive integers");
  }
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
