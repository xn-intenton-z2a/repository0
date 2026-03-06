#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";

// Convert integer (1..3999) to Roman numeral using standard subtractive notation
export function toRoman(n) {
  if (!Number.isInteger(n)) {
    throw new TypeError("toRoman: input must be an integer");
  }
  if (n < 1 || n > 3999) {
    throw new RangeError("toRoman: input must be in range 1..3999");
  }
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let result = "";
  let i = 0;
  while (n > 0) {
    const times = Math.floor(n / values[i]);
    if (times > 0) {
      result += symbols[i].repeat(times);
      n -= values[i] * times;
    }
    i += 1;
  }
  return result;
}

// Convert Roman numeral string to integer. Strict validation using standard form.
export function fromRoman(s) {
  if (typeof s !== "string") {
    throw new TypeError("fromRoman: input must be a string");
  }
  const str = s.trim().toUpperCase();
  if (str.length === 0) {
    throw new TypeError("fromRoman: input must be a non-empty Roman numeral string");
  }
  // Strict regex for valid roman numerals (1..3999)
  const validRoman = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  if (!validRoman.test(str)) {
    throw new TypeError("fromRoman: invalid Roman numeral string");
  }
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    const value = map[str[i]];
    const next = i + 1 < str.length ? map[str[i + 1]] : 0;
    if (next > value) {
      total += next - value;
      i += 1; // skip next
    } else {
      total += value;
    }
  }
  return total;
}

export function main(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
