#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

/**
 * Compute the Hamming distance between two strings by comparing Unicode code points.
 * Uses Array.from to iterate Unicode code points (so surrogate pairs count as one).
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

  const pa = Array.from(a);
  const pb = Array.from(b);

  if (pa.length !== pb.length) {
    throw new RangeError(
      "hammingDistance: strings must have the same length in code points"
    );
  }

  let dist = 0;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i] !== pb[i]) dist++;
  }
  return dist;
}

/**
 * Compute the Hamming distance between two non-negative integers (count differing bits).
 * Supports Number (integers) and BigInt inputs. Returns a Number count.
 * @param {number|bigint} x
 * @param {number|bigint} y
 * @returns {number} count of differing bits
 * @throws {TypeError} if inputs are not integers (Number integer or BigInt)
 * @throws {RangeError} if inputs are negative
 */
export function hammingDistanceBits(x, y) {
  const isIntegerNumber = (v) => typeof v === "number" && Number.isInteger(v);
  const isBigInt = (v) => typeof v === "bigint";

  if (!(isIntegerNumber(x) || isBigInt(x))) {
    throw new TypeError(
      "hammingDistanceBits: first argument must be an integer (Number or BigInt)"
    );
  }
  if (!(isIntegerNumber(y) || isBigInt(y))) {
    throw new TypeError(
      "hammingDistanceBits: second argument must be an integer (Number or BigInt)"
    );
  }

  // Check non-negative
  if (isIntegerNumber(x) && x < 0) {
    throw new RangeError("hammingDistanceBits: integers must be non-negative");
  }
  if (isIntegerNumber(y) && y < 0) {
    throw new RangeError("hammingDistanceBits: integers must be non-negative");
  }
  if (isBigInt(x) && x < 0n) {
    throw new RangeError("hammingDistanceBits: integers must be non-negative");
  }
  if (isBigInt(y) && y < 0n) {
    throw new RangeError("hammingDistanceBits: integers must be non-negative");
  }

  // Convert both to BigInt for consistent bitwise operations
  const bx = isBigInt(x) ? x : BigInt(x);
  const by = isBigInt(y) ? y : BigInt(y);

  let v = bx ^ by;
  let count = 0;
  while (v !== 0n) {
    count++;
    v &= v - 1n; // remove lowest set bit
  }
  // Return as a regular Number (safe for counts within JS number range)
  return Number(count);
}
