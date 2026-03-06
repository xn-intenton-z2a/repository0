// SPDX-License-Identifier: MIT
// src/lib/fizzbuzz.js

/**
 * Compute the FizzBuzz result for a single integer.
 * @param {number} n - An integer (may be 0)
 * @returns {string} - "Fizz", "Buzz", "FizzBuzz", or the number as a string
 * @throws {TypeError} if n is not a finite integer
 * @throws {RangeError} if n is negative
 */
export function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }

  const divisibleBy3 = n % 3 === 0;
  const divisibleBy5 = n % 5 === 0;

  if (divisibleBy3 && divisibleBy5) return 'FizzBuzz';
  if (divisibleBy3) return 'Fizz';
  if (divisibleBy5) return 'Buzz';
  return String(n);
}

/**
 * Produce the FizzBuzz sequence for integers 1..n (inclusive).
 * @param {number} n - A non-negative integer (0 returns an empty array)
 * @returns {string[]} - Array of fizzbuzz strings for 1..n
 * @throws {TypeError} if n is not a finite integer
 * @throws {RangeError} if n is negative
 */
export function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be a non-negative integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  if (n === 0) return [];

  const out = new Array(n);
  for (let i = 1; i <= n; i++) {
    out[i - 1] = fizzBuzzSingle(i);
  }
  return out;
}
