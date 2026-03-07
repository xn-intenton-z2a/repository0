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
  if (!Number.isFinite(n)) {
    throw new TypeError("fizzBuzzSingle: input must be a finite number");
  }
  // Accept numbers that are mathematically integers (3.0 -> 3)
  if (!Number.isInteger(n)) {
    throw new TypeError("fizzBuzzSingle: input must be an integer");
  }

  const value = n;
  const isFizz = value % 3 === 0;
  const isBuzz = value % 5 === 0;

  if (isFizz && isBuzz) return "fizzbuzz";
  if (isFizz) return "fizz";
  if (isBuzz) return "buzz";
  return String(value);
}

/**
 * Return an array of FizzBuzz results for the inclusive range [start, end].
 * Validation policy:
 * - start and end must be finite integers.
 * - If start > end, returns an empty array.
 * - Throws TypeError for invalid inputs.
 *
 * @param {number} start
 * @param {number} end
 * @returns {string[]}
 */
export function fizzBuzz(start, end) {
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    throw new TypeError("fizzBuzz: start and end must be finite numbers");
  }
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    throw new TypeError("fizzBuzz: start and end must be integers");
  }

  if (start > end) return [];

  const out = [];
  for (let i = start; i <= end; i++) {
    out.push(fizzBuzzSingle(i));
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
