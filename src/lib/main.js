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

// ----------------- Encoding library -----------------

// Built-in alphabets
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 62 chars
const Z85 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#"; // 85 chars (Z85)
// basE91 alphabet (common implementation) - 91 chars
const BASE91 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~\"";

function assertUint8Array(input) {
  if (!(input instanceof Uint8Array)) {
    throw new TypeError("Input must be a Uint8Array");
  }
}

function bytesToBigInt(bytes) {
  let n = 0n;
  for (let i = 0; i < bytes.length; i++) {
    n = (n << 8n) + BigInt(bytes[i]);
  }
  return n;
}

function bigIntToBytes(n) {
  if (n === 0n) return new Uint8Array([]);
  const parts = [];
  while (n > 0n) {
    parts.unshift(Number(n & 0xffn));
    n >>= 8n;
  }
  return new Uint8Array(parts);
}

function encodeWithCharset(bytes, charset) {
  assertUint8Array(bytes);
  if (bytes.length === 0) return "";
  const base = BigInt(charset.length);

  // count leading zero bytes so we can preserve them
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;

  let n = bytesToBigInt(bytes);

  const digits = [];
  while (n > 0n) {
    const rem = Number(n % base);
    digits.push(charset[rem]);
    n = n / base;
  }
  digits.reverse();

  // prefix mapping for leading zero bytes using first charset char
  const prefix = charset[0].repeat(zeros);
  return prefix + digits.join("");
}

function decodeWithCharset(str, charset) {
  if (str === "") return new Uint8Array([]);
  const base = BigInt(charset.length);

  // count leading prefix chars that represent zero bytes
  let zeros = 0;
  while (zeros < str.length && str[zeros] === charset[0]) zeros++;

  let n = 0n;
  for (let i = zeros; i < str.length; i++) {
    const ch = str[i];
    const idx = charset.indexOf(ch);
    if (idx === -1) throw new Error("Invalid character for charset");
    n = n * base + BigInt(idx);
  }

  const bytes = bigIntToBytes(n);
  // prepend zeros
  const out = new Uint8Array(zeros + bytes.length);
  out.set(bytes, zeros);
  return out;
}

function hexToBytes(hex) {
  const clean = hex.replace(/[^0-9a-fA-F]/g, "");
  if (clean.length % 2 !== 0) throw new Error("Invalid hex string");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return out;
}

function bytesToHex(bytes) {
  const parts = [];
  for (let i = 0; i < bytes.length; i++) {
    parts.push(bytes[i].toString(16).padStart(2, "0"));
  }
  return parts.join("");
}

function formatUuidFromHex(hex) {
  const h = hex.toLowerCase();
  return `${h.substr(0, 8)}-${h.substr(8, 4)}-${h.substr(12, 4)}-${h.substr(16, 4)}-${h.substr(20, 12)}`;
}

export function createEncoding(charset, name = "custom") {
  if (typeof charset !== "string" || charset.length < 2) {
    throw new Error("Charset must be a string with at least 2 characters");
  }
  // ensure unique characters
  const set = new Set(charset.split(""));
  if (set.size !== charset.length) throw new Error("Charset contains duplicate characters");

  const charsetSize = charset.length;
  const bitsPerChar = Math.log2(charsetSize);

  return {
    name,
    charset,
    charsetSize,
    bitsPerChar,
    encode: (bytes) => encodeWithCharset(bytes, charset),
    decode: (str) => decodeWithCharset(str, charset),
    encodeUUID: (uuid) => {
      // strip dashes and encode 16 bytes then reverse the final encoded string
      const hex = uuid.replace(/[^0-9a-fA-F]/g, "");
      if (hex.length !== 32) throw new Error("UUID must be 16 bytes (32 hex chars)");
      const bytes = hexToBytes(hex);
      const enc = encodeWithCharset(bytes, charset);
      return enc.split("").reverse().join("");
    },
    decodeUUID: (encoded) => {
      // reverse encoded string then decode to bytes and return formatted uuid
      const fixed = encoded.split("").reverse().join("");
      const bytes = decodeWithCharset(fixed, charset);
      if (bytes.length !== 16) throw new Error("Decoded UUID must be 16 bytes");
      return formatUuidFromHex(bytesToHex(bytes));
    },
  };
}

// Built-in encodings
export const base62 = createEncoding(BASE62, "base62");
export const base85 = createEncoding(Z85, "base85");
export const base91 = createEncoding(BASE91, "base91");

const BUILT_INS = { base62, base85, base91 };

export function listEncodings() {
  return Object.values(BUILT_INS).map((e) => {
    // compute uuid length for a canonical sample uuid (16 bytes) using encodeUUID
    const sampleUuid = "01234567-89ab-cdef-0123-456789abcdef";
    const encoded = e.encodeUUID(sampleUuid);
    return {
      name: e.name,
      charsetSize: e.charsetSize,
      bitsPerChar: e.bitsPerChar,
      uuidLength: encoded.length,
    };
  });
}

export function encode(bytes, encodingName) {
  if (typeof encodingName === "string" && BUILT_INS[encodingName]) {
    return BUILT_INS[encodingName].encode(bytes);
  }
  throw new Error("Unknown encoding: " + String(encodingName));
}

export function decode(str, encodingName) {
  if (typeof encodingName === "string" && BUILT_INS[encodingName]) {
    return BUILT_INS[encodingName].decode(str);
  }
  throw new Error("Unknown encoding: " + String(encodingName));
}

export function encodeUUID(uuid, encodingName) {
  if (typeof encodingName === "string" && BUILT_INS[encodingName]) {
    return BUILT_INS[encodingName].encodeUUID(uuid);
  }
  throw new Error("Unknown encoding: " + String(encodingName));
}

export function decodeUUID(encoded, encodingName) {
  if (typeof encodingName === "string" && BUILT_INS[encodingName]) {
    return BUILT_INS[encodingName].decodeUUID(encoded);
  }
  throw new Error("Unknown encoding: " + String(encodingName));
}

// Per-encoding convenience wrappers
export function encodeBase62(bytes) { return base62.encode(bytes); }
export function decodeBase62(str) { return base62.decode(str); }
export function encodeUUIDBase62(uuid) { return base62.encodeUUID(uuid); }
export function decodeUUIDBase62(encoded) { return base62.decodeUUID(encoded); }

export function encodeBase85(bytes) { return base85.encode(bytes); }
export function decodeBase85(str) { return base85.decode(str); }
export function encodeUUIDBase85(uuid) { return base85.encodeUUID(uuid); }
export function decodeUUIDBase85(encoded) { return base85.decodeUUID(encoded); }

export function encodeBase91(bytes) { return base91.encode(bytes); }
export function decodeBase91(str) { return base91.decode(str); }
export function encodeUUIDBase91(uuid) { return base91.encodeUUID(uuid); }
export function decodeUUIDBase91(encoded) { return base91.decodeUUID(encoded); }

// Keep node CLI behavior
if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
