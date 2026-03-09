#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

// Return the FizzBuzz string for a single positive integer i
export function fizzBuzzSingle(i) {
  if (typeof i !== 'number' || !Number.isInteger(i) || i < 1) {
    throw new TypeError('n must be a non-negative integer');
  }
  const by3 = (i % 3 === 0);
  const by5 = (i % 5 === 0);
  if (by3 && by5) return 'FizzBuzz';
  if (by3) return 'Fizz';
  if (by5) return 'Buzz';
  return String(i);
}

// Return an array of FizzBuzz strings from 1..n (1-indexed). n must be a non-negative integer.
export function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
    throw new TypeError('n must be a non-negative integer');
  }
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push(fizzBuzzSingle(i));
  }
  return out;
}

export function main(args) {
  // Existing identity/version behavior retained but show library name by default
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  console.log(`${name}@${version}`);
}

// CLI entry: when executed directly, print fizzbuzz for n=100
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const lines = fizzBuzz(100).join('\n');
    console.log(lines);
    process.exit(0);
  } catch (e) {
    console.error(e && e.message ? e.message : String(e));
    process.exit(1);
  }
}
