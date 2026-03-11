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

/**
 * Compute the Hamming distance between two strings, comparing Unicode code points.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function hammingDistance(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("Both arguments must be strings");
  }
  const ra = Array.from(a);
  const rb = Array.from(b);
  if (ra.length !== rb.length) {
    throw new RangeError("Strings must have the same length in code points");
  }
  let count = 0;
  for (let i = 0; i < ra.length; i++) {
    if (ra[i] !== rb[i]) count++;
  }
  return count;
}

/**
 * Compute the Hamming distance between two non-negative integers by counting differing bits.
 * Accepts Number (integers) or BigInt.
 * @param {number|bigint} x
 * @param {number|bigint} y
 * @returns {number}
 */
export function hammingDistanceBits(x, y) {
  const isBigIntX = typeof x === "bigint";
  const isBigIntY = typeof y === "bigint";
  if (!isBigIntX && typeof x !== "number") {
    throw new TypeError("x must be a number or bigint");
  }
  if (!isBigIntY && typeof y !== "number") {
    throw new TypeError("y must be a number or bigint");
  }

  const bx = isBigIntX ? x : BigInt(x);
  const by = isBigIntY ? y : BigInt(y);

  if (bx < 0n || by < 0n) {
    throw new RangeError("Integers must be non-negative");
  }

  let v = bx ^ by; // BigInt xor
  let count = 0;
  while (v) {
    count += Number(v & 1n);
    v = v >> 1n;
  }
  return count;
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
