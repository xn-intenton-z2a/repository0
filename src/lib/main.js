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

/**
 * Return the FizzBuzz string for a single positive integer.
 * Throws TypeError for non-integers and RangeError for non-positive integers.
 */
export function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
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

/**
 * Return an array of FizzBuzz strings from 1 to n.
 * fizzBuzz(0) => []
 * Throws TypeError for non-integers and RangeError for negative n.
 */
export function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
