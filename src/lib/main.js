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

/**
 * Return the FizzBuzz string for a single positive integer.
 * - Non-number or non-integer: TypeError
 * - Negative numbers or zero: RangeError (single requires positive integer)
 */
export function fizzBuzzSingle(n) {
  if (typeof n !== "number" || Number.isNaN(n)) {
    throw new TypeError("n must be a number");
  }
  if (!Number.isInteger(n)) {
    throw new TypeError("n must be an integer");
  }
  if (n <= 0) {
    throw new RangeError("n must be a positive integer");
  }
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}

/**
 * Return an array of FizzBuzz strings from 1..n.
 * - n === 0 => []
 * - negative => RangeError
 * - non-integer => TypeError
 */
export function fizzBuzz(n) {
  if (typeof n !== "number" || Number.isNaN(n)) {
    throw new TypeError("n must be a number");
  }
  if (!Number.isInteger(n)) {
    throw new TypeError("n must be an integer");
  }
  if (n < 0) {
    throw new RangeError("n must be non-negative");
  }
  if (n === 0) return [];
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = fizzBuzzSingle(i + 1);
  }
  return out;
}

export default { name, version, description, getIdentity, main, fizzBuzz, fizzBuzzSingle };

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
