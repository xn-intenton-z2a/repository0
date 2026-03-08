#!/usr/bin/env node
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name || 'roman-numerals';
export const version = pkg.version || '0.0.0';
export const description = pkg.description || 'Roman numeral conversion library';

export function getIdentity() {
  return { name, version, description };
}

/**
 * Convert an integer (1..3999) to a Roman numeral string using standard
 * subtractive notation.
 * @param {number} n - Integer between 1 and 3999 inclusive
 * @returns {string} Roman numeral
 * @throws {TypeError} if n is not an integer
 * @throws {RangeError} if n is outside 1..3999
 */
export function toRoman(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || Math.floor(n) !== n) {
    throw new TypeError('toRoman: input must be an integer');
  }
  if (n < 1 || n > 3999) {
    throw new RangeError('toRoman: input must be in range 1..3999');
  }
  const map = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let result = '';
  let remaining = n;
  for (const [value, numeral] of map) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}

/**
 * Convert a Roman numeral string (canonical) to an integer.
 * Accepts uppercase only and canonical subtractive notation. Rejects invalid
 * or non-canonical forms by throwing SyntaxError.
 * @param {string} s - Roman numeral string (e.g. "MCMXCIV")
 * @returns {number} integer value
 * @throws {TypeError} if input is not a string
 * @throws {SyntaxError} if string is not a valid canonical Roman numeral
 */
export function fromRoman(s) {
  if (typeof s !== 'string') {
    throw new TypeError('fromRoman: input must be a string');
  }
  if (s.length === 0) {
    throw new SyntaxError('fromRoman: empty string is not a valid Roman numeral');
  }
  // Only accept uppercase canonical forms
  if (s !== s.toUpperCase()) {
    throw new SyntaxError('fromRoman: lowercase or mixed-case numerals are not allowed');
  }
  const numerals = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50,
    'C': 100, 'D': 500, 'M': 1000
  };
  // Validate characters
  if (!/^[IVXLCDM]+$/.test(s)) {
    throw new SyntaxError('fromRoman: contains invalid characters');
  }
  // Validate canonical form using a strict regex for 1..3999
  const canonical = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  if (!canonical.test(s)) {
    throw new SyntaxError('fromRoman: non-canonical or out-of-range numeral');
  }
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const value = numerals[s[i]];
    const next = numerals[s[i+1]] || 0;
    if (value < next) {
      total += next - value;
      i++; // skip next
    } else {
      total += value;
    }
  }
  // final range check
  if (total < 1 || total > 3999) {
    throw new SyntaxError('fromRoman: result out of range');
  }
  return total;
}

export default { name, version, description, toRoman, fromRoman, getIdentity };

export function main(args) {
  if (args?.includes('--version')) {
    console.log(version);
    return;
  }
  if (args?.includes('--identity')) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  console.log(`${name}@${version}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
