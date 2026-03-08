#!/usr/bin/env node
// src/lib/main.js

/**
 * Roman numerals library
 * Exports: toRoman(number), fromRoman(string), name, version, description, getIdentity
 */
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name || "roman-numerals";
export const version = pkg.version || "0.0.0";
export const description = pkg.description || "Convert between integers and Roman numerals";

export function getIdentity() {
  return { name, version, description };
}

const ROMAN_MAP = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/**
 * Convert integer to Roman numeral (1..3999).
 * @param {number} n - integer between 1 and 3999 inclusive
 * @returns {string} Roman numeral in canonical subtractive form
 * @throws {TypeError} when n is not an integer
 * @throws {RangeError} when n is outside 1..3999
 */
export function toRoman(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) throw new TypeError("toRoman requires a finite number");
  if (!Number.isInteger(n)) throw new TypeError("toRoman requires an integer");
  if (n < 1 || n > 3999) throw new RangeError("toRoman accepts integers in range 1..3999");

  let remaining = n;
  let out = "";
  for (const [value, symbol] of ROMAN_MAP) {
    while (remaining >= value) {
      out += symbol;
      remaining -= value;
    }
  }
  return out;
}

const VALID_ROMAN = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const TOKEN_MAP = { M:1000, D:500, C:100, L:50, X:10, V:5, I:1 };

/**
 * Convert Roman numeral string to integer.
 * Accepts canonical uppercase Roman numerals using subtractive notation.
 * @param {string} s - Roman numeral string (canonical form)
 * @returns {number} integer value
 * @throws {TypeError} when s is not a string
 * @throws {SyntaxError} when s is not a valid canonical Roman numeral
 */
export function fromRoman(s) {
  if (typeof s !== "string") throw new TypeError("fromRoman requires a string");
  if (s.length === 0) throw new SyntaxError("Empty string is not a valid Roman numeral");

  // Use uppercase for validation but reject lowercase as non-canonical
  if (s !== s.toUpperCase()) throw new SyntaxError("Roman numerals must be uppercase canonical form");

  if (!VALID_ROMAN.test(s)) throw new SyntaxError("Invalid or non-canonical Roman numeral");

  let total = 0;
  let i = 0;
  while (i < s.length) {
    const cur = TOKEN_MAP[s[i]];
    const next = i + 1 < s.length ? TOKEN_MAP[s[i+1]] : 0;
    if (next > cur) {
      total += (next - cur);
      i += 2;
    } else {
      total += cur;
      i += 1;
    }
  }
  return total;
}

export default { toRoman, fromRoman, name, version, description, getIdentity };

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
  const args = process.argv.slice(2);
  main(args);
}
