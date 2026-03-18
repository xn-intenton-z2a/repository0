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

/**
 * Compute the Hamming distance between two strings, measured in Unicode code points.
 * Throws TypeError if inputs are not strings.
 * Throws RangeError if the strings have different lengths (in code points).
 */
export function hammingString(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("hammingString: both arguments must be strings");
  }
  const pa = Array.from(a);
  const pb = Array.from(b);
  if (pa.length !== pb.length) {
    throw new RangeError("hammingString: strings must have the same length (in Unicode code points)");
  }
  let diff = 0;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i] !== pb[i]) diff++;
  }
  return diff;
}

/**
 * Compute the Hamming distance between two non-negative integers by counting differing bits.
 * Accepts Number (integers) or BigInt. Throws TypeError for non-integers and RangeError for negatives.
 */
export function hammingBits(a, b) {
  const aType = typeof a;
  const bType = typeof b;
  const aIsBig = aType === "bigint";
  const bIsBig = bType === "bigint";

  // Validate types
  const aIsNumberInt = aType === "number" && Number.isInteger(a);
  const bIsNumberInt = bType === "number" && Number.isInteger(b);

  if (!(aIsBig || aIsNumberInt) || !(bIsBig || bIsNumberInt)) {
    throw new TypeError("hammingBits: both arguments must be integers (Number or BigInt)");
  }

  const bigA = aIsBig ? a : BigInt(a);
  const bigB = bIsBig ? b : BigInt(b);

  if (bigA < 0n || bigB < 0n) {
    throw new RangeError("hammingBits: arguments must be non-negative");
  }

  let x = bigA ^ bigB;
  let count = 0;
  while (x !== 0n) {
    // Count lowest bit and shift
    if (x & 1n) count++;
    x = x >> 1n;
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

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
