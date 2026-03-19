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

// --- Encoding library -----------------------------------------------------

const encodings = new Map();

function bytesToBigInt(bytes) {
  let n = 0n;
  for (const b of bytes) {
    n = (n << 8n) + BigInt(b);
  }
  return n;
}

function bigintToBytes(n) {
  if (n === 0n) return new Uint8Array([0]);
  const parts = [];
  while (n > 0n) {
    parts.push(Number(n & 0xffn));
    n >>= 8n;
  }
  parts.reverse();
  return new Uint8Array(parts);
}

function validateCharset(chars) {
  if (typeof chars !== 'string' || chars.length === 0) throw new TypeError('charset must be a non-empty string');
  const seen = new Set();
  for (const ch of chars) {
    const code = ch.codePointAt(0);
    if (code < 0x20 || code === 0x7f) throw new TypeError('charset contains control characters');
    if (seen.has(ch)) throw new TypeError('charset contains duplicate characters');
    seen.add(ch);
  }
  return chars;
}

export function createEncoding(name, charsetString) {
  if (!name || typeof name !== 'string') throw new TypeError('name must be a string');
  const charset = validateCharset([...charsetString].join(''));
  const size = [...charset].length;
  const bitsPerChar = Math.log2(size);
  const meta = { name, charset, charsetSize: size, bitsPerChar };
  const arr = [...charset];
  const map = new Map(arr.map((c,i) => [c,i]));
  encodings.set(name, { meta, charsetArray: arr, charsetMap: map });
  return meta;
}

export function listEncodings() {
  return Array.from(encodings.values()).map(e => ({ name: e.meta.name, bitsPerChar: e.meta.bitsPerChar, charsetSize: e.meta.charsetSize, charset: e.meta.charset }));
}

function getEncoding(name) {
  const e = encodings.get(name);
  if (!e) throw new Error(`unknown encoding: ${name}`);
  return e;
}

// Encode without length header (useful for fixed-size values like UUID raw bytes)
export function encodeRaw(encodingName, bytes) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('input must be a Uint8Array');
  const { charsetArray } = getEncoding(encodingName);
  let n = bytesToBigInt(bytes);
  const base = BigInt(charsetArray.length);
  if (n === 0n) return charsetArray[0];
  const out = [];
  while (n > 0n) {
    const rem = Number(n % base);
    out.push(charsetArray[rem]);
    n = n / base;
  }
  return out.reverse().join('');
}

// Decode without length header. Optionally supply expectedLength to pad leading zeros.
export function decodeRaw(encodingName, str, expectedLength = undefined) {
  if (typeof str !== 'string') throw new TypeError('input must be a string');
  const { charsetArray } = getEncoding(encodingName);
  const base = BigInt(charsetArray.length);
  const { charsetMap } = getEncoding(encodingName);
  if (str === charsetArray[0]) {
    const bytes = new Uint8Array([0]);
    if (expectedLength !== undefined) {
      if (expectedLength === 0) return new Uint8Array(0);
      const padded = new Uint8Array(expectedLength);
      padded.set(bytes, expectedLength - bytes.length);
      return padded;
    }
    return bytes;
  }
  let n = 0n;
  for (const ch of str) {
    const idx = charsetMap.get(ch);
    if (idx === undefined) throw new Error('invalid character for encoding');
    n = n * base + BigInt(idx);
  }
  let bytes = bigintToBytes(n);
  if (expectedLength !== undefined && bytes.length < expectedLength) {
    const padded = new Uint8Array(expectedLength);
    padded.set(bytes, expectedLength - bytes.length);
    bytes = padded;
  }
  return bytes;
}

export function encode(encodingName, bytes) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('input must be a Uint8Array');
  const { charsetArray } = getEncoding(encodingName);
  // prepend 4-byte length header to preserve leading zeros and empty arrays
  const len = bytes.length;
  const header = new Uint8Array(4);
  header[0] = (len >>> 24) & 0xff;
  header[1] = (len >>> 16) & 0xff;
  header[2] = (len >>> 8) & 0xff;
  header[3] = (len) & 0xff;
  const combined = new Uint8Array(4 + len);
  combined.set(header, 0);
  combined.set(bytes, 4);
  let n = bytesToBigInt(combined);
  const base = BigInt(charsetArray.length);
  if (n === 0n) return charsetArray[0];
  const out = [];
  while (n > 0n) {
    const rem = Number(n % base);
    out.push(charsetArray[rem]);
    n = n / base;
  }
  return out.reverse().join('');
}

export function decode(encodingName, str) {
  if (typeof str !== 'string') throw new TypeError('input must be a string');
  const { charsetArray } = getEncoding(encodingName);
  const base = BigInt(charsetArray.length);
  // special-case single-zero char
  if (str === charsetArray[0]) {
    const combined = new Uint8Array(4); // zeros
    const len = 0;
    return combined.slice(4, 4 + len);
  }
  let n = 0n;
  const { charsetMap } = getEncoding(encodingName);
  for (const ch of str) {
    const idx = charsetMap.get(ch);
    if (idx === undefined) throw new Error('invalid character for encoding');
    n = n * base + BigInt(idx);
  }
  let combined = bigintToBytes(n);
  // ensure at least 4 bytes for header
  if (combined.length < 4) {
    const padded = new Uint8Array(4);
    padded.set(combined, 4 - combined.length);
    combined = padded;
  }
  // read 4-byte big-endian length
  const view = combined;
  if (view.length < 4) throw new Error('decoded data too short');
  const len = (view[0] << 24) + (view[1] << 16) + (view[2] << 8) + (view[3]);
  const totalNeeded = 4 + len;
  if (combined.length < totalNeeded) {
    const padded = new Uint8Array(totalNeeded);
    padded.set(combined, totalNeeded - combined.length);
    combined = padded;
  }
  return combined.slice(4, 4 + len);
}

export function encodeUUID(encodingName, uuidString) {
  if (typeof uuidString !== 'string') throw new TypeError('uuid must be a string');
  const hex = uuidString.replace(/-/g, '').toLowerCase();
  if (hex.length !== 32) throw new TypeError('invalid uuid length');
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  bytes.reverse(); // reverse as required by convention
  // encode raw without length header to get compact representation for fixed-size UUIDs
  return encodeRaw(encodingName, bytes);
}

export function decodeUUID(encodingName, encodedString) {
  const bytes = decodeRaw(encodingName, encodedString, 16);
  bytes.reverse();
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

// --- Built-in encodings --------------------------------------------------
// base62
createEncoding('base62', '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
// Z85 / base85 (Z85 charset from ZeroMQ)
createEncoding('base85', '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#');
// base91-like: use printable ASCII 33..126 excluding space
let printable = '';
for (let i = 33; i <= 126; i++) printable += String.fromCharCode(i);
createEncoding('base91', printable);
// denser custom: printable ASCII excluding ambiguous characters 0,O,1,l,I
const ambiguous = new Set(['0','O','1','l','I']);
const denserChars = [...printable].filter(c => !ambiguous.has(c)).join('');
createEncoding('denser', denserChars);

// --- CLI glue ------------------------------------------------------------
export function main(args) {
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
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
