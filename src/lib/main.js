#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// src/lib/main.js

import { fileURLToPath } from 'url';
import { fizzBuzz, fizzBuzzSingle } from './fizzbuzz.js';

export { fizzBuzz, fizzBuzzSingle };

function printLines(lines) {
  for (const l of lines) console.log(l);
}

function parseIntegerToken(token, name = 'n') {
  if (token == null) {
    throw new TypeError(`${name} is required`);
  }
  const n = Number(token);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError(`${name} must be an integer`);
  }
  return n;
}

function usage() {
  console.error('Usage: node src/lib/main.js [--single N | --range N | N | start end]');
}

export function cli(argv) {
  const args = Array.from(argv);
  if (args.length === 0) {
    usage();
    process.exitCode = 1;
    return;
  }

  const first = args[0];
  try {
    if (first.startsWith('--single')) {
      const eq = first.indexOf('=');
      const token = eq !== -1 ? first.slice(eq + 1) : args[1];
      const n = parseIntegerToken(token, 'n');
      if (n === 0) return; // per spec: print nothing and exit 0
      const out = fizzBuzzSingle(n);
      console.log(out);
      return;
    }

    if (first.startsWith('--range')) {
      const eq = first.indexOf('=');
      const token = eq !== -1 ? first.slice(eq + 1) : args[1];
      const n = parseIntegerToken(token, 'n');
      if (n === 0) return;
      const out = fizzBuzz(n);
      printLines(out);
      return;
    }

    // positional args
    if (args.length === 1) {
      const n = parseIntegerToken(args[0], 'n');
      if (n === 0) return;
      printLines(fizzBuzz(n));
      return;
    }

    if (args.length === 2) {
      const start = parseIntegerToken(args[0], 'start');
      const end = parseIntegerToken(args[1], 'end');
      if (start < 1) {
        throw new RangeError('start must be >= 1');
      }
      if (end < start) {
        throw new RangeError('end must be >= start');
      }
      // inclusive range
      for (let i = start; i <= end; i++) console.log(fizzBuzzSingle(i));
      return;
    }

    usage();
    process.exitCode = 1;
  } catch (err) {
    // Print concise message to stderr and exit non-zero
    console.error(err && err.message ? err.message : String(err));
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  cli(process.argv.slice(2));
}
