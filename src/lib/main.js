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

// Encoding library implementation
const ambiguousChars = new Set(['0', 'O', '1', 'l', 'I']);

function validateCharsetString(cs) {
  if (typeof cs !== 'string') throw new TypeError('charset must be a string');
  if (cs.length < 2) throw new TypeError('charset must contain at least 2 characters');
  // Must contain printable ASCII characters only (U+0021..U+007E)
  for (const ch of cs) {
    const code = ch.codePointAt(0);
    if (code < 0x21 || code > 0x7e) throw new TypeError('charset contains invalid (non-printable) characters');
    if (ambiguousChars.has(ch)) throw new TypeError('charset contains ambiguous characters (0/O,1/l/I) which are not allowed');
  }
  // Unique characters only
  const uniq = new Set(cs);
  if (uniq.size !== cs.length) throw new TypeError('charset contains duplicate characters');
  return true;
}

function encodeGeneric(bytes, alphabet) {
  if (!(bytes && bytes.length >= 0)) throw new TypeError('data must be a Uint8Array');
  if (bytes.length === 0) return '';
  // count leading zeros
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
  // drop leading zeros from input for conversion; they will be added back as leading alphabet[0]
  let input = Array.from(bytes.slice(zeros));
  const base = alphabet.length;
  const output = [];
  while (input.length > 0) {
    let carry = 0;
    const newInput = [];
    for (let i = 0; i < input.length; i++) {
      const value = (carry << 8) + input[i];
      const q = Math.floor(value / base);
      carry = value % base;
      if (newInput.length > 0 || q !== 0) newInput.push(q);
    }
    output.push(alphabet[carry]);
    input = newInput;
  }
  // preserve leading zero bytes as leading alphabet[0]
  for (let i = 0; i < zeros; i++) output.push(alphabet[0]);
  return output.reverse().join('');
}

function decodeGeneric(str, alphabet) {
  if (typeof str !== 'string') throw new TypeError('input must be a string');
  if (str.length === 0) return new Uint8Array([]);
  const base = alphabet.length;
  // count leading alphabet[0]
  let zeros = 0;
  while (zeros < str.length && str[zeros] === alphabet[0]) zeros++;
  const input = [];
  for (let i = zeros; i < str.length; i++) {
    const ch = str[i];
    const val = alphabet.indexOf(ch);
    if (val === -1) throw new TypeError('invalid character in input for this alphabet: ' + ch);
    input.push(val);
  }
  const output = [];
  while (input.length > 0) {
    let carry = 0;
    const newInput = [];
    for (let i = 0; i < input.length; i++) {
      const value = input[i] + carry * base;
      const q = Math.floor(value / 256);
      carry = value % 256;
      if (newInput.length > 0 || q !== 0) newInput.push(q);
    }
    output.push(carry);
    input.length = 0;
    for (let v of newInput) input.push(v);
  }
  // add leading zero bytes
  for (let i = 0; i < zeros; i++) output.push(0);
  return new Uint8Array(output.reverse());
}

const registry = new Map();

function registerEncoding(name, charset) {
  if (typeof name !== 'string' || name.length === 0) throw new TypeError('encoding name must be a non-empty string');
  if (typeof charset !== 'string' || charset.length < 2) throw new TypeError('charset must be a string with at least 2 characters');
  registry.set(name, {
    name,
    charset,
    bitsPerChar: Math.log2(charset.length),
    charsetSize: charset.length,
    encode: (data) => encodeGeneric(data, charset),
    decode: (str) => decodeGeneric(str, charset),
  });
}

// Built-in alphabets
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const Z85 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#';
// Printable ASCII from 0x21 (!) to 0x7E (~)
let printable = '';
for (let i = 0x21; i <= 0x7e; i++) printable += String.fromCharCode(i);

registerEncoding('base62', BASE62);
registerEncoding('base85', Z85);
registerEncoding('base94', printable); // densest built-in using all printable ASCII

export function encode(name, data) {
  const enc = registry.get(name);
  if (!enc) throw new TypeError('unknown encoding: ' + name);
  if (!(data instanceof Uint8Array)) {
    // allow Buffer in Node (Buffer is a subclass of Uint8Array too), but reject other types
    throw new TypeError('data must be a Uint8Array');
  }
  return enc.encode(data);
}

export function decode(name, str) {
  const enc = registry.get(name);
  if (!enc) throw new TypeError('unknown encoding: ' + name);
  return enc.decode(str);
}

export function createEncoding(name, charsetString) {
  // custom encodings must exclude ambiguous characters and control chars
  validateCharsetString(charsetString);
  registerEncoding(name, charsetString);
}

export function listEncodings() {
  const out = [];
  for (const [k, v] of registry.entries()) {
    out.push({ name: k, bitsPerChar: v.bitsPerChar, charsetSize: v.charsetSize, charset: v.charset });
  }
  return out;
}

export function uuidEncode(uuidString, encodingName) {
  if (typeof uuidString !== 'string') throw new TypeError('uuid must be a string');
  const hex = uuidString.replace(/-/g, '').toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(hex)) throw new TypeError('invalid UUID string');
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  const encoded = encode(encodingName, bytes);
  // mission shorthand: reverse output
  return encoded.split('').reverse().join('');
}

// keep CLI behaviour
if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
