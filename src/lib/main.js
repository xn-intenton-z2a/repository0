#!/usr/bin/env node
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from 'path';

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

// Hamming distance for Unicode-aware strings (by code point)
export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('hammingDistance expects two strings');
  }
  const A = Array.from(a);
  const B = Array.from(b);
  if (A.length !== B.length) {
    throw new RangeError('Strings must have the same length');
  }
  let diff = 0;
  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) diff++;
  }
  return diff;
}

// Hamming distance for non-negative integers (supports Number and BigInt)
export function hammingDistanceBits(x, y) {
  const isBigInt = (v) => typeof v === 'bigint';
  const isNumber = (v) => typeof v === 'number';

  if (!isBigInt(x) && !isNumber(x)) {
    throw new TypeError('hammingDistanceBits expects integer arguments (Number or BigInt)');
  }
  if (!isBigInt(y) && !isNumber(y)) {
    throw new TypeError('hammingDistanceBits expects integer arguments (Number or BigInt)');
  }

  if (isNumber(x) && (!Number.isInteger(x) || x < 0)) {
    throw new RangeError('hammingDistanceBits expects non-negative integers');
  }
  if (isNumber(y) && (!Number.isInteger(y) || y < 0)) {
    throw new RangeError('hammingDistanceBits expects non-negative integers');
  }
  if (isBigInt(x) && x < 0n) {
    throw new RangeError('hammingDistanceBits expects non-negative integers');
  }
  if (isBigInt(y) && y < 0n) {
    throw new RangeError('hammingDistanceBits expects non-negative integers');
  }

  // Use BigInt for bitwise operations to support large integers
  const bx = isBigInt(x) ? x : BigInt(x);
  const by = isBigInt(y) ? y : BigInt(y);
  let v = bx ^ by;
  let count = 0;
  while (v) {
    count += Number(v & 1n);
    v = v >> 1n;
  }
  return count;
}

export function usage() {
  return `Usage: node ${path.relative(process.cwd(), fileURLToPath(import.meta.url))} <mode> <arg1> <arg2>\n
Modes:\n  string <left> <right>   Compute Hamming distance between two strings (by code point)\n  bits <x> <y>            Compute Hamming distance between two non-negative integers (bits)\n`;
}

export function main(args) {
  // args: array of arguments, e.g. ['string', 'a', 'b']
  if (!args || args.length === 0) {
    console.error(usage());
    return 2;
  }

  const mode = args[0];
  if (mode === '--version') {
    console.log(version);
    return 0;
  }
  if (mode === '--identity') {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return 0;
  }

  if (mode === 'string') {
    if (args.length !== 3) {
      console.error('Error: string mode requires two string arguments.');
      console.error(usage());
      return 2;
    }
    try {
      const res = hammingDistance(args[1], args[2]);
      console.log(String(res));
      return 0;
    } catch (e) {
      console.error(e.message);
      return 2;
    }
  }

  if (mode === 'bits') {
    if (args.length !== 3) {
      console.error('Error: bits mode requires two integer arguments.');
      console.error(usage());
      return 2;
    }
    try {
      const x = Number(args[1]);
      const y = Number(args[2]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new TypeError('bits arguments must be finite numbers');
      }
      const res = hammingDistanceBits(x, y);
      console.log(String(res));
      return 0;
    } catch (e) {
      console.error(e.message);
      return 2;
    }
  }

  console.error(`Unknown mode: ${mode}`);
  console.error(usage());
  return 2;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const code = main(args);
  // Ensure explicit exit code for CLI invocation
  process.exit(code);
}
