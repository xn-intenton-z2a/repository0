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

// --- Encoding library ---
// Generic bigint-based encoder/decoder using provided charset

function bytesToBigInt(bytes) {
  let v = 0n;
  for (const b of bytes) {
    v = (v << 8n) + BigInt(b);
  }
  return v;
}

function bigIntToBytes(v) {
  if (v === 0n) return new Uint8Array([]);
  const parts = [];
  while (v > 0n) {
    parts.push(Number(v & 0xffn));
    v >>= 8n;
  }
  return new Uint8Array(parts.reverse());
}

function encodeWithCharset(bytes, charset) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError("encode expects Uint8Array");
  // encode length to preserve leading zeros
  if (bytes.length === 0) return "0:";
  const base = BigInt(charset.length);
  let v = bytesToBigInt(bytes);
  let out = "";
  while (v > 0n) {
    const rem = Number(v % base);
    out = charset[rem] + out;
    v = v / base;
  }
  return `${bytes.length}:${out}`;
}

function decodeWithCharset(str, charset) {
  if (str === "0:") return new Uint8Array([]);
  const parts = str.split(":");
  if (parts.length !== 2) throw new Error('invalid encoded format');
  const len = parseInt(parts[0], 10);
  const payload = parts[1];
  const base = BigInt(charset.length);
  let v = 0n;
  for (const ch of payload) {
    const idx = charset.indexOf(ch);
    if (idx === -1) throw new Error("invalid character in input");
    v = v * base + BigInt(idx);
  }
  const bytes = bigIntToBytes(v);
  if (bytes.length === len) return bytes;
  if (bytes.length < len) {
    const padded = new Uint8Array(len);
    padded.set(bytes, len - bytes.length);
    return padded;
  }
  // bytes.length > len -> trim leading extra (shouldn't normally happen)
  return bytes.slice(bytes.length - len);
}

function sanitizeCharset(chars) {
  // remove control/space
  return Array.from(chars).filter(c => c >= "!" && c <= "~").join("");
}

const builtins = new Map();

function registerBuiltin(name, charset) {
  const cs = sanitizeCharset(charset);
  builtins.set(name, { name, charset: cs, bitsPerChar: Math.log2(cs.length) });
}

// base62
registerBuiltin("base62", "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
// Z85 (ZeroMQ Z85) charset (32..126 without quotes) - standard Z85
registerBuiltin("base85", "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#");
// high-density custom: printable ASCII excluding ambiguous 0 O 1 l I and space
const ambiguous = new Set(["0","O","1","l","I"," "]);
let denseChars = "";
for (let i=33;i<=126;i++){
  const ch = String.fromCharCode(i);
  if (!ambiguous.has(ch)) denseChars += ch;
}
registerBuiltin("dense94", denseChars);

export function listEncodings() {
  return Array.from(builtins.values()).map(e => ({ name: e.name, charsetSize: e.charset.length, bitsPerChar: e.bitsPerChar }));
}

export function createEncodingFromCharset(name, charset) {
  const cs = sanitizeCharset(charset);
  if (cs.length < 2) throw new Error("charset must contain at least 2 printable characters");
  registerBuiltin(name, cs);
  return { name, charset: cs };
}

export function encode(bytes, encoding) {
  const enc = typeof encoding === 'string' ? builtins.get(encoding) : null;
  if (typeof encoding === 'string' && enc) return encodeWithCharset(bytes, enc.charset);
  if (typeof encoding === 'object' && encoding?.charset) return encodeWithCharset(bytes, encoding.charset);
  throw new Error('unknown encoding');
}

export function decode(str, encoding) {
  const enc = typeof encoding === 'string' ? builtins.get(encoding) : null;
  if (typeof encoding === 'string' && enc) return decodeWithCharset(str, enc.charset);
  if (typeof encoding === 'object' && encoding?.charset) return decodeWithCharset(str, encoding.charset);
  throw new Error('unknown encoding');
}

export function encodeUUID(uuidStr, encoding) {
  // strip dashes, parse hex
  const hex = uuidStr.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(hex)) throw new Error('invalid uuid');
  const bytes = new Uint8Array(16);
  for (let i=0;i<16;i++) bytes[i] = parseInt(hex.slice(i*2,i*2+2),16);
  // encode then reverse (shorthand requirement)
  const enc = encode(bytes, encoding);
  return enc.split("").reverse().join("");
}

// expose builtins map for tests
export const _internal = { builtins };

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
