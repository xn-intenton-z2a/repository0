// SPDX-License-Identifier: MIT
// src/lib/hamming.js

// Unicode-safe Hamming distance (by code points) and byte-wise Hamming distance (bits)

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
  throw new TypeError('hammingDistanceBits: expected Buffer, Uint8Array, or ArrayBuffer');
}

export function hammingDistanceBits(x, y) {
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
