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

// Input validation helpers
function _ensureInteger(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    throw new TypeError("n must be an integer");
  }
}

/**
 * fizzBuzzSingle(n)
 * - Accepts a positive integer (n > 0)
 * - Returns "Fizz", "Buzz", "FizzBuzz" or the stringified number
 */
export function fizzBuzzSingle(n) {
  _ensureInteger(n);
  if (n <= 0) {
    throw new RangeError("n must be a positive integer");
  }
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}

/**
 * fizzBuzz(n)
 * - Accepts a non-negative integer (n >= 0)
 * - Returns an array of length n with FizzBuzz substitutions for 1..n
 */
export function fizzBuzz(n) {
  _ensureInteger(n);
  if (n < 0) {
    throw new RangeError("n must be >= 0");
  }
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push(fizzBuzzSingle(i));
  }
  return out;
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
