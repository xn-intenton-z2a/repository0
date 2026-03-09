#!/usr/bin/env node
// src/lib/main.js

import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

export const name = pkg.name || 'repository0';
export const version = pkg.version || '0.0.0';
export const description = pkg.description || '';

export function getIdentity() {
  return { name, version, description };
}

function validatePositiveInteger(n, paramName = 'n') {
  if (!Number.isSafeInteger(n) || n <= 0) {
    throw new TypeError(`${paramName} must be a positive integer`);
  }
}

export function fizzBuzz(n) {
  validatePositiveInteger(n, 'n');
  const out = new Array(n);
  for (let i = 1; i <= n; i++) {
    const idx = i - 1;
    if (i % 15 === 0) out[idx] = 'FizzBuzz';
    else if (i % 3 === 0) out[idx] = 'Fizz';
    else if (i % 5 === 0) out[idx] = 'Buzz';
    else out[idx] = String(i);
  }
  return out;
}

export function fizzBuzzSingle(i) {
  validatePositiveInteger(i, 'n');
  if (i % 15 === 0) return 'FizzBuzz';
  if (i % 3 === 0) return 'Fizz';
  if (i % 5 === 0) return 'Buzz';
  return String(i);
}

export function main(args) {
  // CLI entry: node src/lib/main.js [N]
  const raw = (args && args.length && args[0]) || process.argv[2] || '100';
  const n = Number(raw);
  try {
    validatePositiveInteger(n, 'n');
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
    return;
  }
  const list = fizzBuzz(n);
  // Print each on its own line
  console.log(list.join('\n'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
