#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";

// Compute Hamming distance between two sequences (strings, Arrays, Buffer, Uint8Array)
// For strings: compare Unicode code points (using Array.from)
export function hammingDistance(a, b) {
  // Determine types
  const isStringA = typeof a === 'string';
  const isStringB = typeof b === 'string';
  const isArrayLikeA = Array.isArray(a) || (typeof Uint8Array !== 'undefined' && a instanceof Uint8Array);
  const isArrayLikeB = Array.isArray(b) || (typeof Uint8Array !== 'undefined' && b instanceof Uint8Array);

  if (isStringA && isStringB) {
    const aa = Array.from(a);
    const bb = Array.from(b);
    if (aa.length !== bb.length) throw new RangeError('Inputs must have equal length');
    let diff = 0;
    for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) diff++;
    return diff;
  }

  if (isArrayLikeA && isArrayLikeB) {
    const aa = Array.from(a);
    const bb = Array.from(b);
    if (aa.length !== bb.length) throw new RangeError('Inputs must have equal length');
    let diff = 0;
    for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) diff++;
    return diff;
  }

  throw new TypeError('hammingDistance expects both arguments to be strings or array-like (Array/Buffer/Uint8Array)');
}

// popcount for BigInt
function popcountBigInt(n) {
  let count = 0n;
  while (n) {
    n &= n - 1n;
    count += 1n;
  }
  return Number(count);
}

// popcount for number (0..255)
function popcountByte(x) {
  // Brian Kernighan for 32-bit number but input is small
  let count = 0;
  let v = x & 0xFF;
  while (v) {
    v &= v - 1;
    count++;
  }
  return count;
}

// Compute Hamming distance in bits between two numbers or two byte arrays
export function hammingDistanceBits(a, b) {
  const isNumberA = (typeof a === 'number' || typeof a === 'bigint');
  const isNumberB = (typeof b === 'number' || typeof b === 'bigint');
  const isArrayLikeA = Array.isArray(a) || (typeof Uint8Array !== 'undefined' && a instanceof Uint8Array);
  const isArrayLikeB = Array.isArray(b) || (typeof Uint8Array !== 'undefined' && b instanceof Uint8Array);

  if (isNumberA && isNumberB) {
    // Convert to BigInt for correct bitwise handling beyond 32 bits
    if (typeof a === 'number' && !Number.isInteger(a)) throw new TypeError('Numeric inputs must be integers');
    if (typeof b === 'number' && !Number.isInteger(b)) throw new TypeError('Numeric inputs must be integers');
    const ai = typeof a === 'bigint' ? a : BigInt(a);
    const bi = typeof b === 'bigint' ? b : BigInt(b);
    if (ai < 0n || bi < 0n) throw new RangeError('Numeric inputs must be non-negative');
    let x = ai ^ bi;
    return popcountBigInt(x);
  }

  if (isArrayLikeA && isArrayLikeB) {
    const aa = Array.from(a);
    const bb = Array.from(b);
    if (aa.length !== bb.length) throw new RangeError('Inputs must have equal length');
    let diff = 0;
    for (let i = 0; i < aa.length; i++) {
      const xv = (aa[i] & 0xFF) ^ (bb[i] & 0xFF);
      diff += popcountByte(xv);
    }
    return diff;
  }

  throw new TypeError('hammingDistanceBits expects both arguments to be numbers (integer) or array-like byte sequences (Array/Buffer/Uint8Array)');
}

export function main(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
