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
function ensureInteger(n, name='n'){
  if (!Number.isFinite(n) || !Number.isInteger(n)) throw new TypeError(`${name} must be a finite integer`);
}

export function fizzBuzzSingle(i){
  ensureInteger(i,'n');
  const by3 = i % 3 === 0;
  const by5 = i % 5 === 0;
  if (by3 && by5) return 'FizzBuzz';
  if (by3) return 'Fizz';
  if (by5) return 'Buzz';
  return String(i);
}

export function fizzBuzz(n){
  ensureInteger(n,'n');
  if (n === 0) return [];
  const res = [];
  if (n > 0){
    for (let i = 1; i <= n; i++) res.push(fizzBuzzSingle(i));
  } else {
    // negative: produce sequence from n .. -1 preserving order
    for (let i = n; i <= -1; i++) res.push(fizzBuzzSingle(i));
  }
  return res;
}

export function fizzBuzzSequence(start, end){
  ensureInteger(start,'start');
  ensureInteger(end,'end');
  if (start > end) throw new RangeError('start must be <= end');
  const len = end - start + 1;
  if (len > 10000) throw new RangeError('range too large');
  const res = [];
  for (let i = start; i <= end; i++) res.push(fizzBuzzSingle(i));
  return res;
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
