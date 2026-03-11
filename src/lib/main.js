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
 * The Hamming distance is the number of positions where characters differ.
 * Handles Unicode strings correctly by comparing code points.
 * 
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} The Hamming distance
 * @throws {TypeError} If arguments are not strings
 * @throws {RangeError} If strings have different lengths
 */
export function hammingDistance(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("Arguments must be strings");
  }
  
  // Convert to arrays of code points to handle Unicode correctly
  const codePointsA = Array.from(a);
  const codePointsB = Array.from(b);
  
  if (codePointsA.length !== codePointsB.length) {
    throw new RangeError('Strings must have equal length');
  }
  
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      distance++;
    }
  }
  
  return distance;
}

/**
 * Compute the Hamming distance between two non-negative integers.
 * The Hamming distance is the number of differing bits in their binary representations.
 * 
 * @param {number} x - First integer
 * @param {number} y - Second integer
 * @returns {number} The number of differing bits
 * @throws {TypeError} If arguments are not integers
 * @throws {RangeError} If arguments are negative
 */
export function hammingDistanceBits(x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new TypeError("Arguments must be integers");
  }
  
  if (x < 0 || y < 0) {
    throw new RangeError("Arguments must be non-negative");
  }
  
  // XOR the numbers to get differing bits, then count the 1s
  let xor = x ^ y;
  let count = 0;
  
  while (xor > 0) {
    count += xor & 1;
    xor >>>= 1;
  }
  
  return count;
}

export function main(args = []) {
  if (args.includes("--version")) {
    console.log(version);
    return;
  }
  if (args.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  
  // If no arguments, show usage help
  if (args.length === 0) {
    console.log(`No expression provided. Use --expression 'y=sin(x)'`);
    console.log(`${name}@${version}`);
    return;
  }
  
  console.log(`${name}@${version}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
