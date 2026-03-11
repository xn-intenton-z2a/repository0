#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";

let pkg;
if (typeof process !== "undefined" && process.versions?.node) {
  // Node.js environment
  const require = createRequire(import.meta.url);
  pkg = require("../../package.json");
} else {
  // Browser environment - fetch package.json
  try {
    const response = await fetch('./lib-meta.js');
    if (response.ok) {
      const module = await import('./lib-meta.js');
      pkg = { name: module.name, version: module.version, description: module.description };
    } else {
      pkg = { name: 'Hamming Distance Library', version: '0.1.0', description: 'A JavaScript library for Hamming distance calculations' };
    }
  } catch {
    pkg = { name: 'Hamming Distance Library', version: '0.1.0', description: 'A JavaScript library for Hamming distance calculations' };
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
 * The Hamming distance is the number of positions where characters differ.
 * 
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} The Hamming distance between the strings
 * @throws {TypeError} If either argument is not a string
 * @throws {RangeError} If the strings have different lengths
 */
export function hammingDistance(a, b) {
  if (typeof a !== 'string') {
    throw new TypeError('First argument must be a string');
  }
  if (typeof b !== 'string') {
    throw new TypeError('Second argument must be a string');
  }
  if (a.length !== b.length) {
    throw new RangeError('Strings must have equal length');
  }

  let distance = 0;
  // Use Array.from to handle Unicode characters correctly (code points, not UTF-16 code units)
  const aChars = Array.from(a);
  const bChars = Array.from(b);
  
  for (let i = 0; i < aChars.length; i++) {
    if (aChars[i] !== bChars[i]) {
      distance++;
    }
  }
  
  return distance;
}

/**
 * Compute the Hamming distance between two non-negative integers.
 * The Hamming distance is the count of differing bits in their binary representations.
 * 
 * @param {number} x - First integer
 * @param {number} y - Second integer
 * @returns {number} The Hamming distance between the integers
 * @throws {TypeError} If either argument is not an integer
 * @throws {RangeError} If either argument is negative or not a safe integer
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
  if (!Number.isSafeInteger(x)) {
    throw new RangeError('First argument must be a safe integer');
  }
  if (!Number.isSafeInteger(y)) {
    throw new RangeError('Second argument must be a safe integer');
  }

  // For large integers, we need to handle them more carefully due to JavaScript's
  // bitwise operation limitations with 32-bit signed integers
  let distance = 0;
  let a = x;
  let b = y;
  
  while (a > 0 || b > 0) {
    if ((a & 1) !== (b & 1)) {
      distance++;
    }
    a = Math.floor(a / 2);
    b = Math.floor(b / 2);
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

if (typeof process !== "undefined" && process.argv && process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
