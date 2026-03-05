#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";

/**
 * Compute the Hamming distance between two strings by comparing Unicode code points.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 * @throws {TypeError} if inputs are not strings
 * @throws {RangeError} if strings have different lengths (in code points)
 */
export function hammingDistance(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("hammingDistance: both arguments must be strings");
  }

  // Use Array.from to iterate Unicode code points (not UTF-16 code units)
  const pa = Array.from(a);
  const pb = Array.from(b);

  if (pa.length !== pb.length) {
    throw new RangeError("hammingDistance: strings must have the same length in code points");
  }

  let dist = 0;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i] !== pb[i]) dist++;
  }
  return dist;
}

/**
 * Compute the Hamming distance between two non-negative integers (count differing bits).
 * Supports Number (integers) and BigInt inputs.
 * @param {number|bigint} x
 * @param {number|bigint} y
 * @returns {number} count of differing bits
 * @throws {TypeError} if inputs are not integers (Number integer or BigInt)
 * @throws {RangeError} if inputs are negative
 */
export function hammingDistanceBits(x, y) {
  const isBigInt = typeof x === "bigint" || typeof y === "bigint";

  // Validate types
  const validNumber = (v) => typeof v === "number" && Number.isInteger(v);
  const validBigInt = (v) => typeof v === "bigint";

  if (!(validNumber(x) || validBigInt(x))) {
    throw new TypeError("hammingDistanceBits: first argument must be an integer (Number or BigInt)");
  }
  if (!(validNumber(y) || validBigInt(y))) {
    throw new TypeError("hammingDistanceBits: second argument must be an integer (Number or BigInt)");
  }

  // Convert Numbers to BigInt for correct bitwise operations beyond 32 bits
  const bx = typeof x === "bigint" ? x : BigInt(x);
  const by = typeof y === "bigint" ? y : BigInt(y);

  if (bx < 0n || by < 0n) {
    throw new RangeError("hammingDistanceBits: arguments must be non-negative");
  }

  // XOR and count set bits using Brian Kernighan's algorithm for BigInt
  let z = bx ^ by;
  let count = 0;
  while (z) {
    z &= z - 1n;
    count++;
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
