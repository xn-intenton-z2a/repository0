#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

/**
 * Computes the greatest common divisor (GCD) of two positive integers.
 *
 * Acceptable inputs: both a and b must be positive integers (e.g., 1, 2, 3, ...).
 *
 * Throws an error if either input is not a positive integer, including non-integer values such as fractions.
 *
 * @param {number} a - A positive integer
 * @param {number} b - A positive integer
 * @returns {number} The greatest common divisor of a and b
 */
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

export function main(args = []) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
