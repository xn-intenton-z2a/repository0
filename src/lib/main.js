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

// Validate integer helper
function _assertInteger(value, fnName, allowZero = false) {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new TypeError(`${fnName}: expected integer`);
  }
  if (allowZero) {
    if (value < 0) throw new RangeError(`${fnName}: expected non-negative integer`);
  } else {
    if (value < 1) throw new RangeError(`${fnName}: expected positive integer`);
  }
}

// Return the FizzBuzz string for a single positive integer i
export function fizzBuzzSingle(i) {
  _assertInteger(i, 'fizzBuzzSingle', false);
  const by3 = (i % 3 === 0);
  const by5 = (i % 5 === 0);
  if (by3 && by5) return 'fizzbuzz';
  if (by3) return 'fizz';
  if (by5) return 'buzz';
  return String(i);
}

// Return an array of FizzBuzz strings from start..n (inclusive). opts: { start }
export function fizzBuzz(n, opts = {}) {
  _assertInteger(n, 'fizzBuzz', true); // allow zero
  if (n === 0) return [];
  const start = opts && opts.start !== undefined ? opts.start : 1;
  _assertInteger(start, 'fizzBuzz: opts.start', true);
  if (start > n) return [];
  const out = [];
  for (let i = start; i <= n; i++) out.push(fizzBuzzSingle(i));
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
