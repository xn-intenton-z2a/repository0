#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

/**
 * Compute the Hamming distance between two strings of equal length.
 * @param {string} a - First string
 * @param {string} b - Second string  
 * @returns {number} Number of positions where characters differ
 * @throws {TypeError} If arguments are not strings
 * @throws {RangeError} If strings have different lengths
 */
export function hammingDistance(a, b) {
  if (typeof a !== 'string') {
    throw new TypeError('First argument must be a string');
  }
  if (typeof b !== 'string') {
    throw new TypeError('Second argument must be a string');
  }
  
  // Convert to arrays of Unicode code points to handle Unicode correctly
  const codePointsA = Array.from(a);
  const codePointsB = Array.from(b);
  
  if (codePointsA.length !== codePointsB.length) {
    throw new RangeError('Strings must have equal length');
  }
  
  let distance = 0;
  for (let i = 0; i < codePointsA.length; i++) {
    if (codePointsA[i] !== codePointsB[i]) {
      distance++;
    }
  }
  
  return distance;
}

/**
 * Compute the Hamming distance between two non-negative integers (count differing bits).
 * @param {number} x - First integer
 * @param {number} y - Second integer
 * @returns {number} Number of differing bits
 * @throws {TypeError} If arguments are not integers
 * @throws {RangeError} If arguments are negative
 */
export function hammingDistanceBits(x, y) {
  if (!Number.isInteger(x)) {
    throw new TypeError('First argument must be an integer');
  }
  if (!Number.isInteger(y)) {
    throw new TypeError('Second argument must be an integer');
  }
  if (x < 0) {
    throw new RangeError('First argument must be non-negative');
  }
  if (y < 0) {
    throw new RangeError('Second argument must be non-negative');
  }
  
  // XOR the two numbers to get bits that differ, then count the 1s
  let xor = x ^ y;
  let distance = 0;
  
  while (xor > 0) {
    distance += xor & 1;
    xor >>>= 1;
  }
  
  return distance;
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
