#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

/**
 * Computes the greatest common divisor (GCD) of two integers.
 *
 * @param {number} a - An integer
 * @param {number} b - An integer
 * @returns {number} The greatest common divisor of a and b
 */
export function gcd(a, b) {
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
