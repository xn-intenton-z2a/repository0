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
 * Compute the Hamming distance between two strings of equal length.
 * Comparison is Unicode-aware (compares code points, not UTF-16 code units).
 */
export function hammingDistanceString(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("hammingDistanceString: both arguments must be strings");
  }
  const aPoints = Array.from(a);
  const bPoints = Array.from(b);
  if (aPoints.length !== bPoints.length) {
    throw new RangeError("hammingDistanceString: strings must be of equal length (in code points)");
  }
  let diff = 0;
  for (let i = 0; i < aPoints.length; i++) {
    if (aPoints[i] !== bPoints[i]) diff++;
  }
  return diff;
}

/**
 * Compute the Hamming distance between two non-negative integers by counting differing bits.
 * Accepts Number integers or BigInt values and supports mixing Number/BigInt inputs.
 *
 * Validation:
 * - Numbers must be integer (Number.isInteger)
 * - Negative values (Number < 0 or BigInt < 0n) throw RangeError
 * - Other types throw TypeError
 */
export function hammingDistanceInt(a, b) {
  const ta = typeof a;
  const tb = typeof b;

  const isNumberA = ta === "number";
  const isNumberB = tb === "number";
  const isBigIntA = ta === "bigint";
  const isBigIntB = tb === "bigint";

  if (!((isNumberA || isBigIntA) && (isNumberB || isBigIntB))) {
    throw new TypeError("hammingDistanceInt: both arguments must be Number (integer) or BigInt");
  }

  if (isNumberA) {
    if (!Number.isInteger(a) || Number.isNaN(a)) {
      throw new TypeError("hammingDistanceInt: Number arguments must be integers");
    }
    if (a < 0) {
      throw new RangeError("hammingDistanceInt: arguments must be non-negative");
    }
  } else {
    // BigInt
    if (a < 0n) {
      throw new RangeError("hammingDistanceInt: arguments must be non-negative");
    }
  }

  if (isNumberB) {
    if (!Number.isInteger(b) || Number.isNaN(b)) {
      throw new TypeError("hammingDistanceInt: Number arguments must be integers");
    }
    if (b < 0) {
      throw new RangeError("hammingDistanceInt: arguments must be non-negative");
    }
  } else {
    if (b < 0n) {
      throw new RangeError("hammingDistanceInt: arguments must be non-negative");
    }
  }

  const aBig = isBigIntA ? a : BigInt(a);
  const bBig = isBigIntB ? b : BigInt(b);

  let x = aBig ^ bBig;
  let count = 0;
  while (x > 0n) {
    // Kernighan's bit-counting trick
    x &= x - 1n;
    count++;
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

// Re-export log-validator helpers for consumers (web UI, tests, CLI)
export { isMissionComplete, findMissionContradictions } from "./log-validator.js";
