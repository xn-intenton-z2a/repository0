#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

const isNode = typeof process !== "undefined" && !!process.versions?.node;

let pkg;
if (isNode) {
  const { createRequire } = await import("module");
  const requireFn = createRequire(import.meta.url);
  pkg = requireFn("../../package.json");
} else {
  try {
    const resp = await fetch(new URL("../../package.json", import.meta.url));
    pkg = await resp.json();
  } catch {
    pkg = { name: document.title, version: "0.0.0", description: "" };
  }
}

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description || "";

/**
 * Compute the Hamming distance between two strings by comparing Unicode code points.
 * - Throws TypeError if either argument is not a string.
 * - Throws RangeError if strings have different lengths (in code points).
 */
export function hammingDistance(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("hammingDistance: both arguments must be strings");
  }
  const aPoints = Array.from(a); // iterate code points, handles astral characters
  const bPoints = Array.from(b);
  if (aPoints.length !== bPoints.length) {
    throw new RangeError("hammingDistance: strings must be of equal length (in code points)");
  }
  let dist = 0;
  for (let i = 0; i < aPoints.length; i++) {
    if (aPoints[i] !== bPoints[i]) dist++;
  }
  return dist;
}

/**
 * Compute the bit-level Hamming distance between two non-negative integer Numbers.
 * - Throws TypeError if either argument is not a Number integer (no fractional part).
 * - Throws RangeError if either argument is negative.
 *
 * Implementation notes:
 * - Inputs are JavaScript Numbers (integers). The function converts them to BigInt
 *   to perform an exact bitwise XOR and counts differing bits. For Numbers larger
 *   than Number.MAX_SAFE_INTEGER the numeric value may already be imprecise; callers
 *   should avoid relying on bit-level behavior for inexact Number representations.
 */
export function hammingDistanceBits(a, b) {
  if (typeof a !== "number" || typeof b !== "number" || !Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError("hammingDistanceBits: both arguments must be integer Numbers");
  }
  if (a < 0 || b < 0) {
    throw new RangeError("hammingDistanceBits: both arguments must be non-negative");
  }
  // Convert to BigInt for exact bitwise operations.
  let xa = BigInt(a);
  let xb = BigInt(b);
  let x = xa ^ xb;
  let count = 0;
  while (x) {
    // count lowest set bit and shift
    count += Number(x & 1n);
    x >>= 1n;
  }
  return count;
}

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

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
