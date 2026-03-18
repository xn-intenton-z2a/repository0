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
 * Compute the Hamming distance between two strings of equal length.
 * Comparison is Unicode-aware (compares code points, not UTF-16 code units).
 *
 * @param {string} a
 * @param {string} b
 * @returns {number} number of differing code points
 * @throws {TypeError} if arguments are not strings
 * @throws {RangeError} if strings are of unequal length
 */
export function hammingDistanceString(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("hammingDistanceString: both arguments must be strings");
  }
  const aPoints = Array.from(a);
  const bPoints = Array.from(b);
  if (aPoints.length !== bPoints.length) {
    throw new RangeError("hammingDistanceString: strings must be of equal length (in code points)");
  }
  let diff = 0;
  for (let i = 0; i < aPoints.length; i++) {
    if (aPoints[i] !== bPoints[i]) diff++;
  }
  return diff;
}

/**
 * Compute the Hamming distance between two non-negative integers by counting differing bits.
 * Accepts JavaScript Number integers (throws TypeError for non-integers). Uses BigInt internally
 * to perform bitwise XOR and popcount so distances are correct up to Number precision limits.
 *
 * Note: Inputs must be non-negative integers (Number). For very large values beyond
 * Number.MAX_SAFE_INTEGER, precision of Number may lose exactness; prefer passing integers
 * within the safe integer range.
 *
 * @param {number} a
 * @param {number} b
 * @returns {number} number of differing bits
 * @throws {TypeError} if arguments are not integer numbers
 * @throws {RangeError} if arguments are negative
 */
export function hammingDistanceInt(a, b) {
  if (typeof a !== "number" || typeof b !== "number" || !Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError("hammingDistanceInt: both arguments must be integer numbers");
  }
  if (a < 0 || b < 0) {
    throw new RangeError("hammingDistanceInt: arguments must be non-negative");
  }
  // Use BigInt for XOR and popcount to avoid 32-bit truncation from JS bitwise ops
  let x = BigInt(a) ^ BigInt(b);
  let count = 0n;
  while (x > 0n) {
    count += x & 1n;
    x >>= 1n;
  }
  return Number(count);
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
