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
 * Compute the Hamming distance between two strings of equal length
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Number of positions where characters differ
 */
export function hammingDistance(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("Arguments must be strings");
  }
  
  if (a.length !== b.length) {
    throw new RangeError("Strings must have equal length");
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
 * Compute the Hamming distance between two non-negative integers
 * @param {number} x - First integer
 * @param {number} y - Second integer
 * @returns {number} Number of differing bits
 */
export function hammingDistanceBits(x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new TypeError("Arguments must be integers");
  }
  
  if (x < 0 || y < 0) {
    throw new RangeError("Arguments must be non-negative");
  }
  
  let xor = x ^ y;
  let distance = 0;
  
  while (xor > 0) {
    distance += xor & 1;
    xor >>>= 1;
  }
  
  return distance;
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
