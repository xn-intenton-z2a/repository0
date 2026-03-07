#!/usr/bin/env node
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

function assertIsNumberInteger(n) {
  if (typeof n !== 'number' || Number.isNaN(n) || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
}

function assertNonNegative(n) {
  if (n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }
}

export function fizzBuzzSingle(n) {
  assertIsNumberInteger(n);
  assertNonNegative(n);
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

export function fizzBuzz(n) {
  assertIsNumberInteger(n);
  assertNonNegative(n);
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push(fizzBuzzSingle(i));
  }
  return out;
}

/**
 * runCli({ argv, stdout, stderr }) -> exitCode
 * - argv: process.argv style array (defaults to process.argv)
 * - stdout/stderr: writable-like with write() method
 * returns numeric exit code
 */
export function runCli({ argv = process.argv, stdout = process.stdout, stderr = process.stderr } = {}) {
  const args = Array.isArray(argv) ? argv.slice(2) : [];
  if (args.length === 0) {
    stderr.write('Usage: node src/lib/main.js <n>\n');
    return 1;
  }
  const raw = args[0];
  const n = Number(raw);
  if (!Number.isFinite(n) || Number.isNaN(n) || !Number.isInteger(n)) {
    stderr.write('n must be an integer\n');
    return 2;
  }
  if (n < 0) {
    stderr.write('n must be a non-negative integer\n');
    return 2;
  }
  if (n === 0) {
    return 0;
  }
  for (let i = 1; i <= n; i++) {
    stdout.write(fizzBuzzSingle(i) + '\n');
  }
  return 0;
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
  console.log(`${name}@${version}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv;
  if (argv.includes('--version') || argv.includes('--identity')) {
    main(argv.slice(2));
    process.exit(0);
  }
  const code = runCli({ argv, stdout: process.stdout, stderr: process.stderr });
  process.exit(code);
}
