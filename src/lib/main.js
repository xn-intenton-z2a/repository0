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
    pkg = { name: document.title || "repo", version: "0.0.0", description: "" };
  }
}

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description || "";

export function getIdentity() {
  return { name, version, description };
}

function validatePositiveInteger(n, allowZero = false) {
  if (typeof n !== 'number' || !Number.isFinite(n) || Number.isNaN(n)) {
    throw new TypeError('n must be a finite number');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0 || (!allowZero && n === 0)) {
    throw new RangeError('n must be a positive integer' + (allowZero ? ' or zero' : ''));
  }
  if (n > 10000) {
    throw new RangeError('n must not be greater than 10000');
  }
}

export function fizzBuzzSingle(i) {
  validatePositiveInteger(i, false);
  if (i % 15 === 0) return 'FizzBuzz';
  if (i % 3 === 0) return 'Fizz';
  if (i % 5 === 0) return 'Buzz';
  return String(i);
}

export function fizzBuzz(n) {
  // allow n === 0 to return [] per mission
  if (typeof n !== 'number' || !Number.isFinite(n) || Number.isNaN(n)) {
    throw new TypeError('n must be a finite number');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  if (n > 10000) {
    throw new RangeError('n must not be greater than 10000');
  }
  if (n === 0) return [];
  const out = Array(n);
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out[i - 1] = 'FizzBuzz';
    else if (i % 3 === 0) out[i - 1] = 'Fizz';
    else if (i % 5 === 0) out[i - 1] = 'Buzz';
    else out[i - 1] = String(i);
  }
  return out;
}

export function main(args) {
  // Preserve existing identity flags
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  // If CLI called with a numeric arg, behave as fizzbuzz CLI
  if (isNode) {
    const argv = args ?? process.argv.slice(2);
    if (argv.length > 0) {
      // support --json flag
      const jsonFlag = argv.includes('--json');
      const filtered = argv.filter(a => a !== '--json');
      const nArg = filtered[0];
      if (nArg) {
        const n = Number(nArg);
        try {
          const result = fizzBuzz(n);
          if (jsonFlag) console.log(JSON.stringify(result));
          else result.forEach(line => console.log(line));
          return;
        } catch (err) {
          console.error('Error:', err.message);
          // exit non-zero when run as script
          if (typeof process !== 'undefined') process.exitCode = 1;
          return;
        }
      }
    }
  }
  console.log(`${name}@${version}`);
}

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
  }
}
