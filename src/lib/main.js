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
 * Compute Hamming distance between two strings — by Unicode code points.
 * @throws {TypeError} if inputs are not strings
 * @throws {RangeError} if strings have different lengths (in code points)
 */
export function stringHamming(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('stringHamming expects two string arguments');
  }
  const aa = Array.from(a); // code points
  const bb = Array.from(b);
  if (aa.length !== bb.length) {
    throw new RangeError('Strings must have equal length (in code points)');
  }
  let diff = 0;
  for (let i = 0; i < aa.length; i++) {
    if (aa[i] !== bb[i]) diff++;
  }
  return diff;
}

/**
 * Compute Hamming distance between two non-negative integers at bit level.
 * @throws {TypeError} if inputs are not integers
 * @throws {RangeError} if inputs are negative
 */
export function bitHamming(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError('bitHamming expects integer arguments');
  }
  if (a < 0 || b < 0) {
    throw new RangeError('bitHamming expects non-negative integers');
  }
  let x = a ^ b;
  let count = 0;
  while (x) {
    count += x & 1;
    x = x >>> 1;
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
