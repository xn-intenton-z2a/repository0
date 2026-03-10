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

// Convert integer (1..3999) to Roman numeral (standard subtractive notation)
export function toRoman(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('toRoman: input must be an integer');
  }
  if (n < 1 || n > 3999) {
    throw new RangeError('toRoman: input must be in the range 1..3999');
  }
  const map = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let res = '';
  let remaining = n;
  for (const [value, numeral] of map) {
    while (remaining >= value) {
      res += numeral;
      remaining -= value;
    }
  }
  return res;
}

// Convert Roman numeral string to integer; strict validation of canonical form
export function fromRoman(s) {
  if (typeof s !== 'string') {
    throw new TypeError('fromRoman: input must be a string');
  }
  const str = s.trim().toUpperCase();
  if (str.length === 0) {
    throw new TypeError('fromRoman: empty string');
  }
  // Validate canonical Roman numeral (1..3999) using regex
  const valid = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  if (!valid.test(str)) {
    throw new TypeError('fromRoman: invalid Roman numeral');
  }
  const values = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    const curr = values[str[i]];
    const next = values[str[i + 1]] || 0;
    if (curr < next) {
      total += next - curr;
      i++; // skip next as it was processed
    } else {
      total += curr;
    }
  }
  return total;
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
