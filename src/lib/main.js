#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";

/**
 * Compute the Hamming distance between two strings in a Unicode-safe way.
 *
 * Rules:
 * - Both inputs must be strings.
 * - Strings are normalized to Unicode NFC before comparison.
 * - Comparison is performed on Unicode code points (using Array.from on normalized string).
 * - If the normalized code-point lengths differ, a RangeError is thrown.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number} The number of positions at which the corresponding code points are different.
 * @throws {TypeError} If inputs are not strings.
 * @throws {RangeError} If inputs differ in length after normalization.
 */
export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('hammingDistance: both inputs must be strings');
  }
  const na = a.normalize('NFC');
  const nb = b.normalize('NFC');
  const ra = Array.from(na);
  const rb = Array.from(nb);
  if (ra.length !== rb.length) {
    throw new RangeError('Inputs must be the same length after normalisation/encoding');
  }
  let diff = 0;
  for (let i = 0; i < ra.length; i++) {
    if (ra[i] !== rb[i]) diff++;
  }
  return diff;
}

/**
 * Compute Hamming distance in bits between two byte sequences.
 *
 * Rules:
 * - Inputs may be Buffer, Uint8Array, or string.
 * - Strings are normalized to Unicode NFC and encoded as UTF-8 bytes.
 * - If the resulting byte lengths differ, a RangeError is thrown.
 * - Returns the total number of differing bits across all bytes.
 *
 * @param {string|Buffer|Uint8Array} x
 * @param {string|Buffer|Uint8Array} y
 * @returns {number} Number of differing bits.
 * @throws {TypeError} If inputs are not string/Buffer/Uint8Array.
 * @throws {RangeError} If byte lengths differ after normalization/encoding.
 */
export function hammingDistanceBits(x, y) {
  function toBytes(v) {
    if (typeof v === 'string') {
      return Buffer.from(v.normalize('NFC'), 'utf8');
    }
    if (Buffer.isBuffer(v)) return v;
    if (v instanceof Uint8Array) return Buffer.from(v);
    throw new TypeError('hammingDistanceBits: inputs must be string, Buffer, or Uint8Array');
  }

  const bx = toBytes(x);
  const by = toBytes(y);
  if (bx.length !== by.length) {
    throw new RangeError('Inputs must be the same length after normalisation/encoding');
  }

  // 8-bit popcount table for speed
  const POPCOUNT = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    let v = i;
    let c = 0;
    while (v) {
      v &= v - 1;
      c++;
    }
    POPCOUNT[i] = c;
  }

  let bits = 0;
  for (let i = 0; i < bx.length; i++) {
    bits += POPCOUNT[bx[i] ^ by[i]];
  }
  return bits;
}

export function main(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
