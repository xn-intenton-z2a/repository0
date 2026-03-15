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

// FizzBuzz API required by mission

export function fizzBuzzSingle(n) {
  // Input validation
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

export function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push(fizzBuzzSingle(i));
  }
  return out;
}

// Backwards-compatible helpers kept for internal tests
export function fizzbuzzNumber(n) { return fizzBuzzSingle(n); }
export function fizzbuzzRange(start, end) {
  if (typeof start !== 'number' || !Number.isFinite(start) || !Number.isInteger(start) ||
      typeof end !== 'number' || !Number.isFinite(end) || !Number.isInteger(end)) {
    throw new TypeError('start and end must be integers');
  }
  if (start > end) {
    throw new RangeError('start must be <= end');
  }
  const out = [];
  for (let i = start; i <= end; i++) {
    out.push(fizzBuzzSingle(i));
  }
  return out;
}

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
