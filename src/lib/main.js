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
 * Return the FizzBuzz string for a single positive integer.
 * Rules:
 * - Multiples of 3 => "Fizz"
 * - Multiples of 5 => "Buzz"
 * - Multiples of both => "FizzBuzz"
 * - Otherwise return the number as a string
 *
 * Throws:
 * - TypeError for non-integer inputs
 * - RangeError for non-positive integers
 */
export function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('n must be a finite integer');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n <= 0) {
    throw new RangeError('n must be a positive integer');
  }

  let out = '';
  if (n % 3 === 0) out += 'Fizz';
  if (n % 5 === 0) out += 'Buzz';
  return out || String(n);
}

/**
 * Return an array of FizzBuzz strings from 1..n.
 * - fizzBuzz(0) returns []
 * Throws:
 * - TypeError for non-integers
 * - RangeError for negative numbers
 */
export function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('n must be a finite integer');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be non-negative');
  }
  if (n === 0) return [];

  const results = new Array(n);
  for (let i = 1; i <= n; i++) {
    results[i - 1] = fizzBuzzSingle(i);
  }
  return results;
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
