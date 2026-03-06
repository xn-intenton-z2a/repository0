// SPDX-License-Identifier: MIT
// src/lib/hamming.js

// Unicode-safe Hamming distance (by code points) and integer/byte-wise Hamming distance (bits)

export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('hammingDistance: expected two strings');
  }

  const sa = a.normalize('NFC');
  const sb = b.normalize('NFC');

  const ra = Array.from(sa);
  const rb = Array.from(sb);

  if (ra.length !== rb.length) {
    throw new RangeError('hammingDistance: inputs must have same number of code points');
  }

  let diff = 0;
  for (let i = 0; i < ra.length; i++) {
    if (ra[i] !== rb[i]) diff++;
  }
  return diff;
}

// build a popcount table for 0..255
const POPCOUNT = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  let v = i;
  let c = 0;
  while (v) {
    c += v & 1;
    v >>>= 1;
  }
  POPCOUNT[i] = c;
}

function toUint8Array(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  // Buffer is a subclass of Uint8Array in Node; above handles it
  throw new TypeError('hammingDistanceBits: expected Buffer, Uint8Array, or ArrayBuffer for byte-wise comparison');
}

function popcount32(u) {
  // u is a 32-bit unsigned number
  return POPCOUNT[u & 0xff] + POPCOUNT[(u >>> 8) & 0xff] + POPCOUNT[(u >>> 16) & 0xff] + POPCOUNT[(u >>> 24) & 0xff];
}

export function hammingDistanceBits(x, y) {
  // Numeric path: accepts Number and BigInt (mixed allowed per rules)
  const tx = typeof x;
  const ty = typeof y;

  const xIsNum = tx === 'number';
  const yIsNum = ty === 'number';
  const xIsBig = tx === 'bigint';
  const yIsBig = ty === 'bigint';

  // If both are numeric primitives (number or bigint), handle integer logic
  if ((xIsNum || xIsBig) && (yIsNum || yIsBig)) {
    // Validate types: numbers must be integers and non-negative; bigints must be non-negative
    if (xIsNum) {
      if (!Number.isInteger(x)) throw new TypeError('hammingDistanceBits: Number inputs must be integers');
      if (x < 0) throw new RangeError('hammingDistanceBits: negative values not allowed');
      if (!Number.isSafeInteger(x)) throw new RangeError('hammingDistanceBits: Number inputs must be safe integers or use BigInt');
    }
    if (yIsNum) {
      if (!Number.isInteger(y)) throw new TypeError('hammingDistanceBits: Number inputs must be integers');
      if (y < 0) throw new RangeError('hammingDistanceBits: negative values not allowed');
      if (!Number.isSafeInteger(y)) throw new RangeError('hammingDistanceBits: Number inputs must be safe integers or use BigInt');
    }

    // If either is BigInt, coerce Numbers (which are safe by previous checks) to BigInt
    if (xIsBig || yIsBig) {
      const bx = xIsBig ? x : BigInt(x);
      const by = yIsBig ? y : BigInt(y);
      if (bx < 0n || by < 0n) throw new RangeError('hammingDistanceBits: negative values not allowed');

      // Kernighan's algorithm for BigInt popcount on XOR
      let v = bx ^ by;
      let count = 0;
      while (v !== 0n) {
        v &= v - 1n;
        count++;
      }
      return count; // Number of differing bits as a JS Number
    }

    // Fast Number path: both are Numbers and safe integers (non-negative)
    // Use 32-bit chunks for efficient popcount while preserving correctness up to Number.MAX_SAFE_INTEGER
    const a = Number(x);
    const b = Number(y);
    if (a < 0 || b < 0) throw new RangeError('hammingDistanceBits: negative values not allowed');

    // Low 32 bits
    const lowA = a >>> 0;
    const lowB = b >>> 0;
    let bits = popcount32((lowA ^ lowB) >>> 0);

    // High part (remaining bits beyond low 32)
    const highA = Math.floor(a / 0x100000000) >>> 0;
    const highB = Math.floor(b / 0x100000000) >>> 0;
    bits += popcount32((highA ^ highB) >>> 0);

    return bits;
  }

  // Otherwise, treat inputs as byte sequences (Uint8Array / ArrayBuffer)
  // This preserves legacy behavior for Buffer/Uint8Array comparisons
  const ux = toUint8Array(x);
  const uy = toUint8Array(y);

  if (ux.length !== uy.length) {
    throw new RangeError('hammingDistanceBits: input byte lengths must match');
  }

  let bits = 0;
  for (let i = 0; i < ux.length; i++) {
    bits += POPCOUNT[ux[i] ^ uy[i]];
  }
  return bits;
}
