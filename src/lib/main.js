#!/usr/bin/env node
// src/lib/main.js

/**
 * Compute Hamming distance between two Unicode strings.
 *
 * This function normalizes both inputs using NFC and compares by Unicode code points
 * (JS "for...of" iteration) so surrogate pairs are handled correctly. It does NOT
 * attempt to compare user-visible grapheme clusters; use Intl.Segmenter externally
 * if you need grapheme-cluster-aware distances.
 *
 * @param {string} a - first string
 * @param {string} b - second string
 * @returns {number} number of code points that differ
 * @throws {TypeError} if inputs are not strings
 * @throws {RangeError} if lengths (in code points after NFC normalization) differ
 */
export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('hammingDistance: both arguments must be strings');
  }
  const na = a.normalize && a.normalize('NFC') || a;
  const nb = b.normalize && b.normalize('NFC') || b;

  // collect code points using for...of to iterate code points (not UTF-16 code units)
  const pa = Array.from(na);
  const pb = Array.from(nb);

  if (pa.length !== pb.length) {
    throw new RangeError('hammingDistance: inputs must have equal length after NFC normalization');
  }

  let diff = 0;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i] !== pb[i]) diff++;
  }
  return diff;
}

/**
 * Compute Hamming distance in bits between two binary sequences.
 *
 * Accepts Buffer, Uint8Array, or ArrayBuffer. Both inputs must have equal byte length.
 * The implementation uses a small 256-entry popcount table for speed.
 *
 * @param {Buffer|Uint8Array|ArrayBuffer} x
 * @param {Buffer|Uint8Array|ArrayBuffer} y
 * @returns {number} total number of differing bits across all bytes
 * @throws {TypeError} if inputs are not binary sequences (Buffer/Uint8Array/ArrayBuffer)
 * @throws {RangeError} if byte lengths differ
 */
export function hammingDistanceBits(x, y) {
  // helper to coerce input to Uint8Array
  function toUint8(input) {
    if (typeof input === 'object' && input !== null) {
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(input)) {
        return new Uint8Array(input);
      }
      if (input instanceof Uint8Array) return input;
      if (input instanceof ArrayBuffer) return new Uint8Array(input);
    }
    throw new TypeError('hammingDistanceBits: inputs must be Buffer, Uint8Array, or ArrayBuffer');
  }

  const ux = toUint8(x);
  const uy = toUint8(y);

  if (ux.length !== uy.length) {
    throw new RangeError('hammingDistanceBits: inputs must have equal byte length');
  }

  // build popcount table
  const POPCOUNT = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    let v = i;
    v = v - ((v >> 1) & 0x55);
    v = (v & 0x33) + ((v >> 2) & 0x33);
    POPCOUNT[i] = ((v + (v >> 4)) & 0x0f);
  }

  let total = 0;
  for (let i = 0; i < ux.length; i++) {
    total += POPCOUNT[ux[i] ^ uy[i]];
  }
  return total;
}

import { fileURLToPath } from 'url';

export function main(args) {
  console.log(JSON.stringify({ args }, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
