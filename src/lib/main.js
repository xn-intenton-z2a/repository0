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

// Validate that a value is an integer number
function ensureInteger(value, argName = "n") {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError(`${argName} must be a number`);
  }
  if (!Number.isInteger(value)) {
    throw new TypeError(`${argName} must be an integer`);
  }
}

/**
 * Return the FizzBuzz string for a single positive integer.
 * - multiples of 3 => "Fizz"
 * - multiples of 5 => "Buzz"
 * - multiples of both => "FizzBuzz"
 * - otherwise the number as a string
 * Throws RangeError for n <= 0, TypeError for non-integers
 */
export function fizzBuzzSingle(n) {
  ensureInteger(n, "n");
  if (n <= 0) throw new RangeError("n must be a positive integer");
  const by3 = n % 3 === 0;
  const by5 = n % 5 === 0;
  if (by3 && by5) return "FizzBuzz";
  if (by3) return "Fizz";
  if (by5) return "Buzz";
  return String(n);
}

/**
 * Return an array of FizzBuzz strings from 1..n
 * - n = 0 => []
 * - negative numbers => RangeError
 * - non-integers => TypeError
 */
export function fizzBuzz(n) {
  ensureInteger(n, "n");
  if (n < 0) throw new RangeError("n must be >= 0");
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
  // If called with `fizz:N` argument, print fizzBuzz(N)
  const fizzArg = (args || []).find(a => a.startsWith("fizz:"));
  if (fizzArg) {
    const parts = fizzArg.split(":", 2);
    const n = Number(parts[1]);
    try {
      console.log(JSON.stringify(fizzBuzz(n)));
    } catch (e) {
      console.error(e && e.message ? e.message : String(e));
      process.exitCode = 2;
    }
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
