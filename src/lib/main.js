#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

const isNode = typeof process !== "undefined" && !!process.versions?.node;

let pkg;
if (isNode) {
  const { createRequire } = await import("module");
  const requireFn = createRequire(import.meta.url);
  pkg = requireFn("../../package.json");
} else {
  try {
    const resp = await fetch(new URL("../../package.json", import.meta.url));
    pkg = await resp.json();
  } catch {
    pkg = { name: document.title, version: "0.0.0", description: "" };
  }
}

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

// Integer to Roman and Roman to Integer conversion utilities
// Requirements: support 1..3999, subtractive notation, strict validation

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

export function intToRoman(num) {
  if (typeof num !== "number" || !Number.isInteger(num)) {
    throw new TypeError("intToRoman expects an integer");
  }
  if (num < 1 || num > 3999) {
    throw new RangeError("Value must be in the range 1..3999");
  }
  let n = num;
  let res = "";
  for (const [value, numeral] of ROMAN_MAP) {
    while (n >= value) {
      res += numeral;
      n -= value;
    }
  }
  return res;
}

// Strict validator using classic Roman numeral pattern for 1..3999
const ROMAN_VALID_RE = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const ROMAN_VALUES = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

export function romanToInt(roman) {
  if (typeof roman !== "string") {
    throw new TypeError("romanToInt expects a string");
  }
  const s = roman.toUpperCase();
  if (!ROMAN_VALID_RE.test(s)) {
    throw new TypeError("Invalid Roman numeral");
  }
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const value = ROMAN_VALUES[s[i]];
    const next = ROMAN_VALUES[s[i + 1]];
    if (next && next > value) {
      total += next - value;
      i++; // skip next
    } else {
      total += value;
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

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
