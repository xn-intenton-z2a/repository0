#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js — Dense binary-to-text encoding library

const isNode = typeof process !== "undefined" && !!process.versions?.node;

let pkg = { name: "repo", version: "0.0.0", description: "" };
if (isNode) {
  const { createRequire } = await import("module");
  const requireFn = createRequire(import.meta.url);
  try {
    pkg = requireFn("../../package.json");
  } catch (e) {
    // keep defaults
  }
} else {
  try {
    const resp = await fetch(new URL("../../package.json", import.meta.url));
    pkg = await resp.json();
  } catch (e) {
    // keep defaults
  }
}

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description || "";

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

// --- Encoding registry and implementations ---
const encodings = new Map();

function ensureString(v, label = "value") {
  if (typeof v !== "string") throw new TypeError(`${label} must be a string`);
}

function ensureUint8Array(v, label = "data") {
  if (!(v instanceof Uint8Array)) throw new TypeError(`${label} must be a Uint8Array`);
}

function createGenericBase(charArray) {
  // charArray: array of unique characters
  const base = BigInt(charArray.length);
  const map = new Map();
  for (let i = 0; i < charArray.length; i++) map.set(charArray[i], i);

  function encode(bytes) {
    ensureUint8Array(bytes, "data");
    if (bytes.length === 0) return "";
    // count leading zero bytes
    let z = 0;
    while (z < bytes.length && bytes[z] === 0) z++;
    // convert remaining bytes to BigInt
    let value = 0n;
    for (let i = z; i < bytes.length; i++) {
      value = (value << 8n) + BigInt(bytes[i]);
    }
    // convert BigInt to base string
    if (value === 0n) {
      return charArray[0].repeat(z);
    }
    const digits = [];
    while (value > 0n) {
      const rem = Number(value % base);
      digits.push(charArray[rem]);
      value = value / base;
    }
    digits.reverse();
    return charArray[0].repeat(z) + digits.join("");
  }

  function decode(text) {
    ensureString(text, "text");
    if (text.length === 0) return new Uint8Array(0);
    // count leading charArray[0] characters -> leading zero bytes
    const zeroChar = charArray[0];
    let z = 0;
    while (z < text.length && text[z] === zeroChar) z++;
    const payload = text.slice(z);
    if (payload.length === 0) return new Uint8Array(z);
    // convert payload to BigInt
    let value = 0n;
    for (let i = 0; i < payload.length; i++) {
      const ch = payload[i];
      const idx = map.get(ch);
      if (idx === undefined) throw new RangeError(`Invalid character '${ch}' for this encoding`);
      value = value * base + BigInt(idx);
    }
    // convert BigInt to bytes
    const bytes = [];
    while (value > 0n) {
      bytes.push(Number(value & 0xffn));
      value = value >> 8n;
    }
    bytes.reverse();
    return new Uint8Array([...Array(z).fill(0), ...bytes]);
  }

  return { encode, decode };
}

// Characters to remove for visual ambiguity
const AMBIGUOUS_CHARS = new Set(["0", "O", "1", "l", "I"]);

export function defineEncoding(name, charset, options = {}) {
  ensureString(name, "name");
  ensureString(charset, "charset");
  if (encodings.has(name)) throw new RangeError(`Encoding '${name}' already defined`);

  const { sanitize = true } = options;

  // turn into array of Unicode codepoints (works for BMP and astral)
  const original = Array.from(charset);

  // reject control characters (U+0000..U+001F, U+007F) and whitespace
  const hasControl = original.some(ch => /[\u0000-\u001F\u007F]/.test(ch) || /\s/.test(ch));
  if (hasControl) {
    throw new RangeError("Charset contains control or whitespace characters");
  }

  // reject duplicate characters in the original input
  if (new Set(original).size !== original.length) {
    throw new RangeError("Charset contains duplicate characters");
  }

  // sanitize ambiguous characters if requested
  const finalChars = sanitize ? original.filter(ch => !AMBIGUOUS_CHARS.has(ch)) : original.slice();

  if (finalChars.length < 2) {
    throw new RangeError("Charset invalid after sanitisation (needs at least 2 unique chars)");
  }

  const impl = createGenericBase(finalChars);
  const metadata = {
    name,
    charset: finalChars.join(""),
    charsetSize: finalChars.length,
    bitsPerChar: Math.log2(finalChars.length),
  };
  encodings.set(name, { ...metadata, encode: impl.encode, decode: impl.decode });
  return metadata;
}

export function listEncodings() {
  return Array.from(encodings.values())
    .map(({ name, charset, charsetSize, bitsPerChar }) => ({ name, charset, charsetSize, bitsPerChar }))
    .sort((a, b) => b.bitsPerChar - a.bitsPerChar);
}

export function encode(encodingNameOrData, dataMaybe) {
  // flexible signature: encode(name, data) or encode(data, name)
  let name, data;
  if (typeof encodingNameOrData === "string") {
    name = encodingNameOrData;
    data = dataMaybe;
  } else {
    data = encodingNameOrData;
    name = dataMaybe;
  }
  ensureString(name, "encodingName");
  ensureUint8Array(data, "data");
  const enc = encodings.get(name);
  if (!enc) throw new RangeError(`Unknown encoding '${name}'`);
  return enc.encode(data);
}

export function decode(encodingNameOrText, textMaybe) {
  // flexible signature: decode(name, text) or decode(text, name)
  let name, text;
  if (typeof encodingNameOrText === "string" && typeof textMaybe === "string") {
    // prefer decode(name, text)
    name = encodingNameOrText;
    text = textMaybe;
  } else if (typeof encodingNameOrText === "string") {
    // decode(name, text)
    name = encodingNameOrText;
    text = textMaybe;
  } else {
    text = encodingNameOrText;
    name = textMaybe;
  }
  ensureString(name, "encodingName");
  ensureString(text, "text");
  const enc = encodings.get(name);
  if (!enc) throw new RangeError(`Unknown encoding '${name}'`);
  return enc.decode(text);
}

// --- UUID helpers ---
function hexToBytes(hex) {
  const clean = hex.replace(/-/g, "");
  if (!/^[0-9a-fA-F]{32}$/.test(clean)) throw new TypeError("Invalid UUID hex string");
  const out = new Uint8Array(16);
  for (let i = 0; i < 16; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}

function bytesToUuid(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length !== 16) throw new TypeError("UUID bytes must be a Uint8Array of length 16");
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  return `${hex.substr(0,8)}-${hex.substr(8,4)}-${hex.substr(12,4)}-${hex.substr(16,4)}-${hex.substr(20,12)}`;
}

export function normalizeUuidStr(s) {
  // remove dashes and whitespace, fold to lower-case
  return s.replace(/[\s-]+/g, '').toLowerCase();
}

// encodeUUIDShorthand now accepts an optional third parameter `reverse` (boolean, default false).
// When reverse=false (default) behaviour is unchanged: strip dashes, encode the 16 bytes and return the encoded string.
// When reverse=true the encoded string is reversed (encoded output reversed). decodeUUIDShorthand mirrors this behaviour by
// reversing the encoded string before decoding when reverse=true.
export function encodeUUIDShorthand(uuid, encodingName, reverse = false) {
  ensureString(uuid, "uuid");
  const bytes = hexToBytes(uuid);
  let encName = encodingName;
  if (encName == null) {
    // pick densest registered encoding
    const list = listEncodings();
    if (list.length === 0) throw new Error("No encodings defined");
    encName = list[0].name;
  }
  const encoded = encode(encName, bytes);
  if (reverse) {
    return Array.from(encoded).reverse().join("");
  }
  return encoded;
}

export function decodeUUIDShorthand(encoded, encodingName, reverse = false) {
  ensureString(encoded, "encoded");
  ensureString(encodingName, "encodingName");
  const toDecode = reverse ? Array.from(encoded).reverse().join("") : encoded;
  const bytes = decode(encodingName, toDecode);
  if (!(bytes instanceof Uint8Array) || bytes.length !== 16) throw new RangeError("Decoded UUID must be 16 bytes");
  return bytesToUuid(bytes);
}

// --- builtin encodings ---
// base62 (traditional)
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
defineEncoding("base62", BASE62, { sanitize: false });
// base85 - use a Z85-like charset
const BASE85 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#";
defineEncoding("base85", BASE85, { sanitize: false });
// base91 - use 91 printable ASCII characters from 33 ('!') to 123 ('{') inclusive
let BASE91 = "";
for (let i = 33; i <= 123; i++) BASE91 += String.fromCharCode(i);
defineEncoding("base91", BASE91, { sanitize: false });
// high-density printable ASCII excluding ambiguous characters
(function registerHighDensity() {
  const ambiguous = new Set(["0", "O", "1", "l", "I"]);
  let cs = "";
  for (let i = 33; i <= 126; i++) {
    const ch = String.fromCharCode(i);
    if (!ambiguous.has(ch)) cs += ch;
  }
  const name = "ascii-printable-no-ambiguous";
  defineEncoding(name, cs);
})();

// make sure exports are stable
export default { name, version, description, getIdentity, main };

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
