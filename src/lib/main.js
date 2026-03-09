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

// FizzBuzz core functions
export function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n <= 0) {
    throw new RangeError('n must be a positive integer');
  }
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

export function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push(fizzBuzzSingle(i));
  }
  return out;
}

export function main(args) {
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  if (args?.includes("--fizzbuzz")) {
    const idx = args.indexOf('--fizzbuzz');
    const val = args[idx+1] ? Number(args[idx+1]) : NaN;
    try {
      const res = fizzBuzz(val);
      console.log(JSON.stringify(res, null, 2));
    } catch (e) {
      console.error(e.message);
      process.exitCode = 2;
    }
    return;
  }
  console.log(`${name}@${version}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
