#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

/**
 * Return the canonical FizzBuzz string for a single numeric input.
 * Validation policy:
 * - Accepts finite numbers that are mathematically integers (e.g. 3 and 3.0 are allowed).
 * - Rejects non-finite numbers, non-integers (e.g. 3.5), and non-number types with TypeError.
 * - Negative integers are allowed and follow the same divisibility rules (e.g. -3 => "fizz").
 *
 * @param {number} n
 * @returns {string}
 */
export function fizzBuzzSingle(n) {
  // Validation: require a finite numeric value that is an integer (3 or 3.0 accepted).
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('fizzBuzzSingle: input must be a finite number');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('fizzBuzzSingle: input must be an integer');
  }

  const value = n;
  const isFizz = value % 3 === 0;
  const isBuzz = value % 5 === 0;

  if (isFizz && isBuzz) return 'FizzBuzz';
  if (isFizz) return 'Fizz';
  if (isBuzz) return 'Buzz';
  return String(value);
}

/**
 * fizzBuzz(n[, options]) -> string[]
 * - n: number (integer >= 0). Returns results for 1..n inclusive.
 * - Throws TypeError for non-number or non-integer inputs.
 * - For n <= 0 returns an empty array.
 *
 * Examples:
 *   fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
 */
export function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('fizzBuzz: n must be a finite number');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('fizzBuzz: n must be an integer');
  }
  if (n <= 0) return [];

  const out = new Array(n);
  for (let i = 1; i <= n; i++) {
    out[i - 1] = fizzBuzzSingle(i);
  }
  return out;
}

export function main(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
