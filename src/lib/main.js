#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";

/**
 * Compute the Hamming distance between two strings, comparing Unicode code points.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function hammingDistance(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("hammingDistance expects two strings");
  }
  const ra = Array.from(a);
  const rb = Array.from(b);
  if (ra.length !== rb.length) {
    throw new RangeError("Strings must have the same length (in Unicode code points)");
  }
  let diff = 0;
  for (let i = 0; i < ra.length; i++) {
    if (ra[i] !== rb[i]) diff++;
  }
  return diff;
}

/**
 * Compute the Hamming distance (number of differing bits) between two non-negative integers.
 * Accepts Number (integer) or BigInt.
 * @param {number|bigint} x
 * @param {number|bigint} y
 * @returns {number}
 */
export function hammingDistanceBits(x, y) {
  const isNumber = typeof x === "number" || typeof y === "number";
  const isBigInt = typeof x === "bigint" || typeof y === "bigint";
  // Validate types
  const validType = (v) => typeof v === "number" || typeof v === "bigint";
  if (!validType(x) || !validType(y)) {
    throw new TypeError("hammingDistanceBits expects integer (number or bigint) arguments");
  }
  // Convert to BigInt and validate non-negative integers
  const bx = typeof x === "bigint" ? x : BigInt(x);
  const by = typeof y === "bigint" ? y : BigInt(y);
  if (bx < 0n || by < 0n) {
    throw new RangeError("hammingDistanceBits expects non-negative integers");
  }
  // Count differing bits via XOR
  let z = bx ^ by;
  let count = 0;
  while (z) {
    count += Number(z & 1n);
    z >>= 1n;
  }
  return count;
}

export function main(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
