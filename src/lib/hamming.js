// SPDX-License-Identifier: MIT
// src/lib/hamming.js
// Hamming distance utilities for strings and integers.

/**
 * Compute Hamming distance between two strings (Unicode-aware).
 * @param {string} a
 * @param {string} b
 * @param {{permissive?: boolean}} [options]
 * @returns {number}
 * @throws {TypeError} when inputs are not strings or when lengths mismatch in strict mode
 *
 * Examples:
 * hammingDistanceString("karolin", "kathrin") === 3
 * hammingDistanceString("", "") === 0
 * hammingDistanceString("😊a", "😊b") === 1
 */
export function hammingDistanceString(a, b, options = {}) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('hammingDistanceString: inputs must be strings');
  }
  const permissive = Boolean(options.permissive);
  const A = Array.from(a);
  const B = Array.from(b);
  const la = A.length;
  const lb = B.length;
  if (!permissive && la !== lb) {
    throw new TypeError('hammingDistanceString: length mismatch');
  }
  const min = Math.min(la, lb);
  let diff = 0;
  for (let i = 0; i < min; i++) {
    if (A[i] !== B[i]) diff++;
  }
  if (permissive) diff += Math.abs(la - lb);
  return diff;
}

/**
 * Compute Hamming distance between two non-negative integers (Number or BigInt).
 * Converts Number inputs to BigInt for accurate bitwise comparison.
 * @param {number|bigint} a
 * @param {number|bigint} b
 * @returns {number}
 * @throws {TypeError} when inputs are not non-negative integers
 *
 * Examples:
 * hammingDistanceInt(0, 0) === 0
 * hammingDistanceInt(1, 4) === 2
 * hammingDistanceInt(255, 0) === 8
 * hammingDistanceInt(2n**65n, 0n) === 1
 */
export function hammingDistanceInt(a, b) {
  const validNumber = (v) => typeof v === 'number' && Number.isInteger(v) && v >= 0;
  const validBigInt = (v) => typeof v === 'bigint' && v >= 0n;
  let A;
  let B;
  if (validNumber(a)) A = BigInt(a);
  else if (validBigInt(a)) A = a;
  else throw new TypeError('hammingDistanceInt: inputs must be non-negative integers');
  if (validNumber(b)) B = BigInt(b);
  else if (validBigInt(b)) B = b;
  else throw new TypeError('hammingDistanceInt: inputs must be non-negative integers');

  let x = A ^ B;
  let count = 0;
  while (x) {
    count += Number(x & 1n);
    x >>= 1n;
  }
  return count;
}
