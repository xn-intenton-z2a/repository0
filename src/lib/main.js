#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

/**
 * Compute the Hamming distance between two sequences.
 * Accepts: string | Buffer | Uint8Array | Array-like
 * For strings, comparison is by Unicode code points (Array.from is used).
 * Throws TypeError for unsupported types and RangeError for unequal lengths.
 * @param {string|Buffer|Uint8Array|ArrayLike} a
 * @param {string|Buffer|Uint8Array|ArrayLike} b
 * @returns {number} number of differing positions
 */
export function hammingDistance(a, b) {
  const isString = (v) => typeof v === "string";
  const isBuffer = (v) => typeof Buffer !== "undefined" && Buffer.isBuffer(v);
  const isUint8 = (v) => v instanceof Uint8Array;
  const isArrayLike = (v) => v && typeof v.length === "number";

  if (isString(a) && isString(b)) {
    const pa = Array.from(a);
    const pb = Array.from(b);
    if (pa.length !== pb.length) throw new RangeError("Inputs must be the same length");
    let diff = 0;
    for (let i = 0; i < pa.length; i++) if (pa[i] !== pb[i]) diff++;
    return diff;
  }

  // For binary/array-like comparisons: Buffer, Uint8Array, Array-like
  if ((isBuffer(a) || isUint8(a) || isArrayLike(a)) && (isBuffer(b) || isUint8(b) || isArrayLike(b))) {
    const la = a.length;
    const lb = b.length;
    if (la !== lb) throw new RangeError("Inputs must be the same length");
    let diff = 0;
    for (let i = 0; i < la; i++) {
      if (a[i] !== b[i]) diff++;
    }
    return diff;
  }

  throw new TypeError('Unsupported input types for hammingDistance. Use strings, Buffer, Uint8Array or array-like.');
}

/**
 * Compute Hamming distance between two integers by counting differing bits.
 * Accepts Number (treated as unsigned 32-bit) and BigInt. Mixing Number & BigInt is allowed
 * (Number is coerced via >>>0 then converted to BigInt). Negative BigInt throws RangeError.
 * @param {number|bigint} x
 * @param {number|bigint} y
 * @returns {number} count of differing bits
 */
export function hammingDistanceBits(x, y) {
  const isBigInt = (v) => typeof v === "bigint";
  const isNumber = (v) => typeof v === "number" && Number.isFinite(v);

  if (!isBigInt(x) && !isNumber(x)) throw new TypeError('hammingDistanceBits accepts only Number or BigInt');
  if (!isBigInt(y) && !isNumber(y)) throw new TypeError('hammingDistanceBits accepts only Number or BigInt');

  // If both are BigInt, operate in BigInt
  if (isBigInt(x) || isBigInt(y)) {
    const ax = isBigInt(x) ? x : BigInt(Number(x) >>> 0);
    const ay = isBigInt(y) ? y : BigInt(Number(y) >>> 0);
    if (ax < 0n || ay < 0n) throw new RangeError('Negative BigInt is not allowed');
    let diff = ax ^ ay;
    let count = 0;
    while (diff) {
      diff &= diff - 1n;
      count++;
    }
    return count;
  }

  // Both are Numbers -> treat as unsigned 32-bit
  const ux = Number(x) >>> 0;
  const uy = Number(y) >>> 0;
  let v = ux ^ uy;
  let c = 0;
  while (v) {
    v &= v - 1;
    c++;
  }
  return c;
}

export function main(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
