#!/usr/bin/env node
// SPDX-License-Identifier: MIT
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
 * Compares Unicode code points (Array.from) rather than UTF-16 code units.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 * @throws {TypeError} If arguments are not strings
 * @throws {RangeError} If strings have different lengths (in code points)
 */
export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('Both arguments must be strings');
  }

  const aPoints = Array.from(a);
  const bPoints = Array.from(b);

  if (aPoints.length !== bPoints.length) {
    throw new RangeError('Strings must have equal length');
  }

  let distance = 0;
  for (let i = 0; i < aPoints.length; i++) {
    if (aPoints[i] !== bPoints[i]) distance++;
  }

  return distance;
}

/**
 * Compute the Hamming distance between two non-negative integers.
 * Accepts Number (integer) or BigInt values. Uses BigInt internally for bit ops.
 * @param {number|bigint} x
 * @param {number|bigint} y
 * @returns {number}
 * @throws {TypeError} If arguments are not integers (Number or BigInt)
 * @throws {RangeError} If arguments are negative
 */
export function hammingDistanceBits(x, y) {
  const isIntegerLike = (v) => (typeof v === 'number' && Number.isInteger(v)) || typeof v === 'bigint';
  if (!isIntegerLike(x) || !isIntegerLike(y)) {
    throw new TypeError('Both arguments must be integers (Number or BigInt)');
  }

  const bx = typeof x === 'bigint' ? x : BigInt(x);
  const by = typeof y === 'bigint' ? y : BigInt(y);

  if (bx < 0n || by < 0n) {
    throw new RangeError('Arguments must be non-negative');
  }

  let xor = bx ^ by;
  let distance = 0;
  while (xor) {
    distance += Number(xor & 1n);
    xor >>= 1n;
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
