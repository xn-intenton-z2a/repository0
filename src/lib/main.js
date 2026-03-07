#!/usr/bin/env node
// src/lib/main.js

/**
 * Return the FizzBuzz string for a single integer.
 * @param {number} n - The integer to evaluate. Must be a finite integer >= 1.
 * @returns {string} "Fizz", "Buzz", "FizzBuzz", or the string form of n.
 * @throws {TypeError} if n is not a number or not an integer
 * @throws {RangeError} if n is less than 1
 */
export function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || Number.isNaN(n) || !Number.isFinite(n)) {
    throw new TypeError('fizzBuzzSingle: n must be a finite number');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('fizzBuzzSingle: n must be an integer');
  }
  if (n < 1) {
    throw new RangeError('fizzBuzzSingle: n must be >= 1');
  }

  const by3 = n % 3 === 0;
  const by5 = n % 5 === 0;
  if (by3 && by5) return 'FizzBuzz';
  if (by3) return 'Fizz';
  if (by5) return 'Buzz';
  return String(n);
}

/**
 * Return a FizzBuzz sequence array of length `count` using 1-based indexing.
 * @param {number} count - Number of items to generate. Must be an integer >= 0.
 * @returns {string[]} array of FizzBuzz strings of length count
 * @throws {TypeError} if count is not a number or not an integer
 * @throws {RangeError} if count is negative
 */
export function fizzBuzz(count) {
  if (typeof count !== 'number' || Number.isNaN(count) || !Number.isFinite(count)) {
    throw new TypeError('fizzBuzz: count must be a finite number');
  }
  if (!Number.isInteger(count)) {
    throw new TypeError('fizzBuzz: count must be an integer');
  }
  if (count < 0) {
    throw new RangeError('fizzBuzz: count must be >= 0');
  }
  if (count === 0) return [];

  const out = new Array(count);
  for (let i = 1; i <= count; i++) {
    out[i - 1] = fizzBuzzSingle(i);
  }
  return out;
}

export function main(args) {
  if (!args || args.length === 0) {
    console.log('Usage: node src/lib/main.js <count>');
    return;
  }
  const n = Number(args[0]);
  try {
    const seq = fizzBuzz(n);
    console.log(seq.join(', '));
  } catch (err) {
    console.error(err && err.message ? err.message : String(err));
    process.exitCode = 2;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const args = process.argv.slice(2);
  main(args);
}
