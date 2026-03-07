#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

/**
 * FizzBuzz library entrypoint and CLI
 * Exports named functions: fizzBuzz, fizzBuzzSingle, fizzBuzzStream, createFizzBuzzReadable
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import { fizz as _fizz, fizzSequence as _fizzSequence } from './fizzbuzz.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

/**
 * Return library identity
 * @returns {{name:string,version:string,description:string}}
 */
export function getIdentity() {
  return { name, version, description };
}

/**
 * Return FizzBuzz sequence from 1..n
 * @param {number} n - integer >= 0
 * @returns {string[]}
 * @throws {TypeError} if n is not an integer
 * @throws {RangeError} if n < 0
 */
export function fizzBuzz(n) {
  return _fizzSequence(n);
}

/**
 * Return FizzBuzz representation for a single integer
 * @param {number} n - integer >= 1
 * @returns {string}
 * @throws {TypeError} if n is not an integer
 * @throws {RangeError} if n < 1
 */
export function fizzBuzzSingle(n) {
  return _fizz(n);
}

/**
 * Async generator (async iterable) that yields FizzBuzz strings from 1..n
 * Validation is performed synchronously so callers receive TypeError/RangeError immediately.
 * @param {number} n - integer >= 0
 * @returns {AsyncGenerator<string>}
 * @throws {TypeError} if n is not an integer
 * @throws {RangeError} if n < 0
 */
export function fizzBuzzStream(n) {
  // synchronous validation
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }

  // return an async generator instance
  return (async function* () {
    for (let i = 1; i <= n; i++) {
      yield _fizz(i);
    }
  })();
}

/**
 * Create a Node Readable (objectMode) that emits FizzBuzz strings from 1..n
 * Validation is synchronous.
 * @param {number} n - integer >= 0
 * @returns {Readable} objectMode Readable stream
 * @throws {TypeError} if n is not an integer
 * @throws {RangeError} if n < 0
 */
export function createFizzBuzzReadable(n) {
  // synchronous validation
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  const gen = (async function* () {
    for (let i = 1; i <= n; i++) yield _fizz(i);
  })();
  return Readable.from(gen, { objectMode: true });
}

/**
 * Simple CLI for the library.
 * Modes:
 *  - single <n>   : print fizzBuzzSingle(n)
 *  - range <n>    : print fizzBuzz(n) one-per-line
 *  - --version    : print version
 *  - --identity   : print JSON identity
 */
export function main(argv) {
  const args = Array.isArray(argv) ? argv : process.argv.slice(2);
  if (args.includes('--version')) {
    console.log(version);
    return;
  }
  if (args.includes('--identity')) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }

  const cmd = args[0];
  if (!cmd) {
    console.log(`${name}@${version}`);
    return;
  }

  try {
    if (cmd === 'single') {
      const raw = args[1];
      const n = Number(raw);
      if (!raw) throw new Error('missing argument: n');
      const out = fizzBuzzSingle(n);
      console.log(out);
      return;
    }

    if (cmd === 'range') {
      const raw = args[1];
      const n = Number(raw);
      if (!raw) throw new Error('missing argument: n');
      const seq = fizzBuzz(n);
      for (const line of seq) console.log(line);
      return;
    }

    if (cmd === 'help' || cmd === '-h' || cmd === '--help') {
      console.log('Usage: node src/lib/main.js <single|range> <n>');
      return;
    }

    console.error(`Unknown command: ${String(cmd)}`);
    process.exitCode = 2;
  } catch (err) {
    // Emit clear error and set non-zero exit code
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

// Node CLI entrypoint
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
