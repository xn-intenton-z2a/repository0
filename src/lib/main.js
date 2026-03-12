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
 * Compute the Hamming distance between two strings by Unicode code points.
 * Throws TypeError if inputs are not strings.
 * Throws RangeError if strings have different lengths in code points.
 */
export function hammingDistance(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("hammingDistance: both arguments must be strings");
  }
  const pa = Array.from(a);
  const pb = Array.from(b);
  if (pa.length !== pb.length) {
    throw new RangeError("hammingDistance: strings must have the same length (in Unicode code points)");
  }
  let diff = 0;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i] !== pb[i]) diff++;
  }
  return diff;
}

/**
 * Compute Hamming distance between two non-negative integers (count differing bits).
 * Accepts Number (integer) or BigInt. Throws TypeError for non-integer types,
 * RangeError for negative values.
 */
export function hammingDistanceBits(x, y) {
  const toBigInt = (v, name) => {
    if (typeof v === "bigint") return v;
    if (typeof v === "number") {
      if (!Number.isInteger(v)) throw new TypeError(`${name} must be an integer`);
      if (v < 0) throw new RangeError(`${name} must be non-negative`);
      return BigInt(v);
    }
    throw new TypeError(`${name} must be an integer (Number or BigInt)`);
  };

  const bx = toBigInt(x, "x");
  const by = toBigInt(y, "y");
  if (bx < 0n || by < 0n) throw new RangeError("arguments must be non-negative");

  let v = bx ^ by;
  let count = 0;
  while (v) {
    if (v & 1n) count++;
    v >>= 1n;
  }
  return count;
}

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
