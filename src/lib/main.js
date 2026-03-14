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

/**
 * Split a string into user-perceived characters (grapheme clusters) when possible.
 * Uses Intl.Segmenter with granularity 'grapheme' when available; falls back to Array.from.
 */
function splitGraphemes(str) {
  if (typeof str !== "string") throw new TypeError("Inputs must be strings");
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    try {
      const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      return Array.from(seg.segment(str), s => s.segment);
    } catch (e) {
      // fall through
    }
  }
  return Array.from(str);
}

/**
 * Compute the Hamming distance between two strings measured in user-perceived characters.
 * - Throws TypeError("Inputs must be strings") if inputs are not strings
 * - Throws RangeError("Inputs must have same length") if lengths differ (by grapheme count)
 */
export function computeHamming(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("Inputs must be strings");
  }
  const aUnits = splitGraphemes(a);
  const bUnits = splitGraphemes(b);
  if (aUnits.length !== bUnits.length) {
    throw new RangeError("Inputs must have same length");
  }
  let diff = 0;
  for (let i = 0; i < aUnits.length; i++) {
    if (aUnits[i] !== bUnits[i]) diff++;
  }
  return diff;
}

// FizzBuzz implementation

function assertInteger(n, name = 'n') {
  if (typeof n !== 'number' || Number.isNaN(n)) {
    throw new TypeError(`${name} must be an integer`);
  }
  if (!Number.isInteger(n)) {
    throw new TypeError(`${name} must be an integer`);
  }
}

/**
 * fizzBuzzSingle(n)
 * - For positive integers returns:
 *   - "FizzBuzz" if divisible by 15
 *   - "Fizz" if divisible by 3
 *   - "Buzz" if divisible by 5
 *   - String(n) otherwise
 * - Throws TypeError when n is not an integer
 * - Throws RangeError when n is not a positive integer (> 0)
 */
export function fizzBuzzSingle(n) {
  assertInteger(n, 'n');
  if (n <= 0) throw new RangeError('n must be a positive integer');
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

/**
 * fizzBuzz(n)
 * - Returns an array of strings for range 1..n inclusive applying fizzBuzzSingle rules.
 * - fizzBuzz(0) returns []
 * - Throws TypeError when n is not an integer
 * - Throws RangeError when n is negative
 */
export function fizzBuzz(n) {
  assertInteger(n, 'n');
  if (n < 0) throw new RangeError('n must be >= 0');
  if (n === 0) return [];
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = fizzBuzzSingle(i + 1);
  }
  return out;
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
