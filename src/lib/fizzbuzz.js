// src/lib/fizzbuzz.js
// Minimal ESM FizzBuzz implementation

/**
 * Return the FizzBuzz representation for a single positive integer.
 * @param {number} value - integer >= 1
 * @returns {string} "Fizz", "Buzz", "FizzBuzz" or the number as string
 * @throws {TypeError} if value is not an integer
 * @throws {RangeError} if value < 1
 */
export function fizz(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
    throw new TypeError('value must be an integer');
  }
  if (value < 1) {
    throw new RangeError('value must be >= 1');
  }
  const by3 = value % 3 === 0;
  const by5 = value % 5 === 0;
  if (by3 && by5) return 'FizzBuzz';
  if (by3) return 'Fizz';
  if (by5) return 'Buzz';
  return String(value);
}

/**
 * Return an array of FizzBuzz values from 1..n.
 * @param {number} n - integer >= 0 (n === 0 returns [])
 * @returns {string[]} array length n
 * @throws {TypeError} if n is not an integer
 * @throws {RangeError} if n < 0
 */
export function fizzSequence(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  if (n === 0) return [];
  const out = new Array(n);
  for (let i = 1; i <= n; i++) {
    out[i - 1] = fizz(i);
  }
  return out;
}
