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

// Hamming distance between two strings measured by Unicode code points
export function hammingString(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("hammingString: both arguments must be strings");
  }
  const aPoints = Array.from(a);
  const bPoints = Array.from(b);
  if (aPoints.length !== bPoints.length) {
    throw new RangeError("hammingString: strings must have equal length (in Unicode code points)");
  }
  let dist = 0;
  for (let i = 0; i < aPoints.length; i++) {
    if (aPoints[i] !== bPoints[i]) dist++;
  }
  return dist;
}

// Hamming distance between two non-negative integers by differing bits
export function hammingBits(a, b) {
  const isBigInt = (v) => typeof v === 'bigint';
  const isNumberInt = (v) => typeof v === 'number' && Number.isInteger(v);
  if (!(isNumberInt(a) || isBigInt(a)) || !(isNumberInt(b) || isBigInt(b))) {
    throw new TypeError("hammingBits: both arguments must be integers (Number or BigInt)");
  }
  if ((isNumberInt(a) && a < 0) || (isNumberInt(b) && b < 0) || (isBigInt(a) && a < 0n) || (isBigInt(b) && b < 0n)) {
    throw new RangeError("hammingBits: integers must be non-negative");
  }
  // Use XOR and popcount; support BigInt
  if (isBigInt(a) || isBigInt(b)) {
    // coerce both to BigInt
    const A = isBigInt(a) ? a : BigInt(a);
    const B = isBigInt(b) ? b : BigInt(b);
    let x = A ^ B;
    let count = 0n;
    while (x) {
      count += x & 1n;
      x = x >> 1n;
    }
    return Number(count);
  } else {
    let x = a ^ b;
    let count = 0;
    while (x) {
      count += x & 1;
      x = x >>> 1;
    }
    return count;
  }
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
