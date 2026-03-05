#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from 'url';

export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('hammingDistance expects two string arguments');
  }
  const sa = Array.from(a); // iterate by Unicode code points
  const sb = Array.from(b);
  if (sa.length !== sb.length) {
    throw new RangeError('Strings must have the same length (in Unicode code points)');
  }
  let dist = 0;
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) dist++;
  }
  return dist;
}

function _isIntegerLike(v) {
  return (typeof v === 'bigint') || (typeof v === 'number' && Number.isFinite(v) && Math.floor(v) === v);
}

export function hammingDistanceBits(x, y) {
  if (!_isIntegerLike(x) || !_isIntegerLike(y)) {
    throw new TypeError('hammingDistanceBits expects integer (Number or BigInt) arguments');
  }

  // Normalize to BigInt for safe bitwise operations on large integers
  const bx = typeof x === 'bigint' ? x : BigInt(x);
  const by = typeof y === 'bigint' ? y : BigInt(y);

  if (bx < 0n || by < 0n) {
    throw new RangeError('hammingDistanceBits expects non-negative integers');
  }

  let v = bx ^ by;
  let count = 0;
  while (v) {
    // Brian Kernighan's algorithm
    v &= v - 1n;
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
