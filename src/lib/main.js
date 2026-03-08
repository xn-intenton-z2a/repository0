#!/usr/bin/env node
// src/lib/main.js

/* Dense encoding library
 * Exports: createEncoding, listEncodings, encode, decode, encodeUUID, decodeUUID
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

// Internal registry
const encodings = new Map();

function validateCharset(cs) {
  if (typeof cs !== 'string' || cs.length < 2) throw new Error('charset must be a string of length >= 2');
  // printable ASCII range 33..126 inclusive
  const seen = new Set();
  for (let i = 0; i < cs.length; i++) {
    const code = cs.charCodeAt(i);
    if (code < 33 || code > 126) throw new Error('charset contains non-printable ASCII characters');
    if (seen.has(cs[i])) throw new Error('charset contains duplicate characters');
    seen.add(cs[i]);
  }
}

export function createEncoding(name, charset) {
  if (!name || typeof name !== 'string') throw new Error('name required');
  validateCharset(charset);
  const base = charset.length;
  const bitsPerChar = Math.log2(base);
  const uuidLength = Math.ceil((128) / bitsPerChar);
  encodings.set(name, { name, charset, base, bitsPerChar, uuidLength });
  return encodings.get(name);
}

export function listEncodings() {
  return Array.from(encodings.values()).map(e => ({
    name: e.name,
    charsetLength: e.charset.length,
    bitsPerChar: e.bitsPerChar,
    uuidLength: e.uuidLength
  }));
}

function toUint8Array(input) {
  if (input == null) return new Uint8Array(0);
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) return new Uint8Array(input);
  if (Array.isArray(input)) return new Uint8Array(input);
  throw new Error('unsupported input type');
}

export function encode(input, encodingName) {
  const enc = encodings.get(encodingName);
  if (!enc) throw new Error('unknown encoding: ' + encodingName);
  const bytes = toUint8Array(input);
  if (bytes.length === 0) return '';
  let value = 0n;
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8n) | BigInt(bytes[i]);
  }
  const base = BigInt(enc.base);
  const chars = [];
  while (value > 0n) {
    const digit = Number(value % base);
    chars.push(enc.charset[digit]);
    value = value / base;
  }
  chars.reverse();
  const requiredChars = Math.ceil((bytes.length * 8) / enc.bitsPerChar);
  if (chars.length < requiredChars) {
    const pad = new Array(requiredChars - chars.length).fill(enc.charset[0]);
    return pad.join('') + chars.join('');
  }
  return chars.join('');
}

export function decode(str, encodingName) {
  const enc = encodings.get(encodingName);
  if (!enc) throw new Error('unknown encoding: ' + encodingName);
  if (!str) return new Uint8Array(0);
  const base = BigInt(enc.base);
  let value = 0n;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const idx = enc.charset.indexOf(ch);
    if (idx === -1) throw new Error('invalid character for encoding');
    value = value * base + BigInt(idx);
  }
  // Determine minimal byte length L such that ceil(L*8 / bitsPerChar) == str.length
  const bitsPerChar = enc.bitsPerChar;
  let L = Math.floor((str.length * bitsPerChar) / 8);
  if (L < 0) L = 0;
  while (Math.ceil((L * 8) / bitsPerChar) < str.length) L++;
  while (L > 0 && Math.ceil(((L - 1) * 8) / bitsPerChar) >= str.length) L--;
  const out = new Uint8Array(L);
  for (let i = L - 1; i >= 0; i--) {
    out[i] = Number(value & 0xffn);
    value = value >> 8n;
  }
  return out;
}

function hexToBytes(hex) {
  const s = hex.replace(/[^0-9a-fA-F]/g, '');
  if (s.length !== 32) throw new Error('invalid uuid hex length');
  const out = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function formatUuidHex(hex) {
  return [hex.slice(0,8), hex.slice(8,12), hex.slice(12,16), hex.slice(16,20), hex.slice(20)].join('-').toLowerCase();
}

export function encodeUUID(uuid, encodingName) {
  const bytes = hexToBytes(uuid);
  return encode(bytes, encodingName);
}

export function decodeUUID(str, encodingName) {
  const bytes = decode(str, encodingName);
  if (bytes.length !== 16) throw new Error('decoded UUID has unexpected length: ' + bytes.length);
  const hex = bytesToHex(bytes);
  return formatUuidHex(hex);
}

// Built-in encodings registration
// base62: 0-9 a-z A-Z
createEncoding('base62', '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
// Z85 charset (common z85 ordered set)
createEncoding('base85', "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#");
// base91: pick 91 printable ASCII chars excluding space and a few ambiguous; ensure uniqueness
const base91chars = (() => {
  const candidates = [];
  for (let i = 33; i <= 126; i++) {
    const ch = String.fromCharCode(i);
    // exclude backslash and quote to avoid escaping issues
    if (ch === '\\' || ch === '"') continue;
    candidates.push(ch);
  }
  // candidates length is 92 (33..126 inclusive = 94; minus 2 = 92) pick first 91
  return candidates.slice(0, 91).join('');
})();
createEncoding('base91', base91chars);

// main CLI behaviour preserved
export function main(args) {
  if (args?.includes('--version')) {
    console.log(version);
    return;
  }
  if (args?.includes('--identity')) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  console.log(`${name}@${version}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
