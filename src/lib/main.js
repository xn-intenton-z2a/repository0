#!/usr/bin/env node
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

/**
 * Compute the Hamming distance between two strings, comparing Unicode code points.
 * Uses Array.from to iterate code points so surrogate pairs are treated as single code points.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('hammingDistance expects two strings');
  }
  const pa = Array.from(a);
  const pb = Array.from(b);
  if (pa.length !== pb.length) {
    throw new RangeError('Strings must have the same length (in code points)');
  }
  let diff = 0;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i] !== pb[i]) diff++;
  }
  return diff;
}

/**
 * Compute the Hamming distance between two non-negative integers (count differing bits).
 * Accepts Number (integer >= 0) or BigInt. Returns a Number.
 * @param {number|bigint} x
 * @param {number|bigint} y
 * @returns {number}
 */
export function hammingDistanceBits(x, y) {
  const isNumber = (v) => typeof v === 'number';
  const isBigInt = (v) => typeof v === 'bigint';

  if (!(isNumber(x) || isBigInt(x)) || !(isNumber(y) || isBigInt(y))) {
    throw new TypeError('hammingDistanceBits expects integer (Number or BigInt) arguments');
  }

  if (isNumber(x)) {
    if (!Number.isInteger(x)) throw new TypeError('Number arguments must be integers');
    if (x < 0) throw new RangeError('Arguments must be non-negative');
  }
  if (isNumber(y)) {
    if (!Number.isInteger(y)) throw new TypeError('Number arguments must be integers');
    if (y < 0) throw new RangeError('Arguments must be non-negative');
  }
  if (isBigInt(x) && x < 0n) throw new RangeError('Arguments must be non-negative');
  if (isBigInt(y) && y < 0n) throw new RangeError('Arguments must be non-negative');

  // normalize to BigInt for bitwise operations
  let bx = isBigInt(x) ? x : BigInt(x);
  let by = isBigInt(y) ? y : BigInt(y);

  let xor = bx ^ by;
  let count = 0;
  while (xor) {
    xor &= xor - 1n; // remove lowest set bit
    count++;
  }
  return count;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
