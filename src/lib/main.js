#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

// FizzBuzz implementation
export function fizzBuzz(n) {
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be a finite integer');
  }
  if (n <= 0) return [];
  const res = [];
  for (let i = 1; i <= n; i++) {
    const by3 = i % 3 === 0;
    const by5 = i % 5 === 0;
    if (by3 && by5) res.push('FizzBuzz');
    else if (by3) res.push('Fizz');
    else if (by5) res.push('Buzz');
    else res.push(i);
  }
  return res;
}

export function fizzBuzzSingle(i) {
  if (!Number.isFinite(i) || !Number.isInteger(i)) {
    throw new TypeError('n must be a finite integer');
  }
  if (i <= 0) return String(i);
  const by3 = i % 3 === 0;
  const by5 = i % 5 === 0;
  if (by3 && by5) return 'FizzBuzz';
  if (by3) return 'Fizz';
  if (by5) return 'Buzz';
  return String(i);
}

export function main(args) {
  if (args?.includes("--version")) {
    console.log(version);
    return 0;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return 0;
  }

  const nArg = args && args[0];
  if (!nArg) {
    console.log(`${name}@${version}`);
    return 0;
  }
  const n = Number(nArg);
  try {
    const out = fizzBuzz(n);
    console.log(JSON.stringify(out));
    return 0;
  } catch (e) {
    console.error(e.message);
    return 2;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const code = main(args);
  process.exit(code);
}
