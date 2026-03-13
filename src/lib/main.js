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

// Character sets for built-in encodings
const CHARSETS = {
  base62: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  base85: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~",
  base91: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~-"
};

// Custom encodings registry
const customEncodings = new Map();

// Core encoding implementation with length preservation
function encodeBase(buffer, charset) {
  if (buffer.length === 0) return "";
  
  const base = BigInt(charset.length);
  let num = 0n;
  
  // Convert bytes to big integer
  for (let i = 0; i < buffer.length; i++) {
    num = (num << 8n) | BigInt(buffer[i]);
  }
  
  // For all-zero data, we need to encode the length to preserve it
  if (num === 0n) {
    // Encode length as prefix, then zeros
    const lengthStr = buffer.length.toString();
    return lengthStr + ":" + charset[0].repeat(Math.max(1, Math.ceil(buffer.length * 8 / Math.log2(charset.length))));
  }
  
  let result = "";
  while (num > 0n) {
    result = charset[Number(num % base)] + result;
    num = num / base;
  }
  
  return result;
}

function decodeBase(str, charset) {
  if (str === "") return new Uint8Array(0);
  
  const base = BigInt(charset.length);
  
  // Check if this is a length-prefixed zero encoding
  if (str.includes(":") && str.split(":")[1].split("").every(c => c === charset[0])) {
    const [lengthStr, _zeros] = str.split(":");
    const length = parseInt(lengthStr);
    if (!isNaN(length)) {
      return new Uint8Array(length);
    }
  }
  
  let num = 0n;
  
  // Convert string to big integer
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const index = charset.indexOf(char);
    if (index === -1) {
      throw new Error(`Invalid character '${char}' for encoding`);
    }
    num = num * base + BigInt(index);
  }
  
  if (num === 0n) {
    return new Uint8Array([0]);
  }
  
  // Convert back to bytes
  const bytes = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xFFn));
    num = num >> 8n;
  }
  
  return new Uint8Array(bytes);
}

// Public API functions
export function encode(buffer, encoding) {
  // Convert input to Uint8Array if needed
  if (buffer instanceof ArrayBuffer) {
    buffer = new Uint8Array(buffer);
  } else if (!(buffer instanceof Uint8Array)) {
    throw new Error("Input must be Uint8Array or ArrayBuffer");
  }
  
  const charset = CHARSETS[encoding] || customEncodings.get(encoding);
  if (!charset) {
    throw new Error(`Unknown encoding: ${encoding}`);
  }
  
  return encodeBase(buffer, charset);
}

export function decode(str, encoding) {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  
  const charset = CHARSETS[encoding] || customEncodings.get(encoding);
  if (!charset) {
    throw new Error(`Unknown encoding: ${encoding}`);
  }
  
  return decodeBase(str, charset);
}

// UUID utility functions
function parseUUID(uuid) {
  // Remove dashes and validate format
  const cleaned = uuid.replace(/-/g, "");
  if (cleaned.length !== 32 || !/^[0-9a-fA-F]+$/.test(cleaned)) {
    throw new Error("Invalid UUID format");
  }
  
  // Convert hex string to bytes
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 32; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }
  
  return bytes;
}

function formatUUID(bytes) {
  if (bytes.length !== 16) {
    throw new Error("UUID must be exactly 16 bytes");
  }
  
  // Convert bytes to hex string with dashes
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32)
  ].join("-");
}

export function encodeUUID(uuid) {
  const bytes = parseUUID(uuid);
  
  // Find the densest encoding (highest bits per character)
  const encodings = listEncodings();
  const densest = encodings.reduce((best, current) => 
    current.bitsPerChar > best.bitsPerChar ? current : best
  );
  
  return encode(bytes, densest.name);
}

export function decodeUUID(str) {
  // Try to decode with each encoding until one works and produces 16 bytes
  const encodings = listEncodings();
  
  for (const encoding of encodings) {
    try {
      const bytes = decode(str, encoding.name);
      if (bytes.length === 16) {
        return formatUUID(bytes);
      }
    } catch (e) {
      // Continue trying other encodings
      continue;
    }
  }
  
  throw new Error("Could not decode UUID with any available encoding");
}

export function createEncoding(name, charset) {
  if (typeof name !== "string" || name.length === 0) {
    throw new Error("Encoding name must be a non-empty string");
  }
  
  if (typeof charset !== "string" || charset.length < 2) {
    throw new Error("Charset must be a string with at least 2 characters");
  }
  
  // Check for duplicate characters
  const uniqueChars = new Set(charset);
  if (uniqueChars.size !== charset.length) {
    throw new Error("Charset cannot contain duplicate characters");
  }
  
  // Check for control characters
  for (let i = 0; i < charset.length; i++) {
    const code = charset.charCodeAt(i);
    if (code < 32 || code === 127) {
      throw new Error("Charset cannot contain control characters");
    }
  }
  
  // Don't allow overwriting built-in encodings
  if (CHARSETS[name]) {
    throw new Error(`Cannot overwrite built-in encoding: ${name}`);
  }
  
  customEncodings.set(name, charset);
  return {
    name,
    charset,
    size: charset.length,
    bitsPerChar: Math.log2(charset.length)
  };
}

export function listEncodings() {
  const encodings = [];
  
  // Add built-in encodings
  for (const [name, charset] of Object.entries(CHARSETS)) {
    const bitsPerChar = Math.log2(charset.length);
    encodings.push({
      name,
      charset,
      size: charset.length,
      bitsPerChar,
      uuidLength: Math.ceil(128 / bitsPerChar)
    });
  }
  
  // Add custom encodings
  for (const [name, charset] of customEncodings) {
    const bitsPerChar = Math.log2(charset.length);
    encodings.push({
      name,
      charset,
      size: charset.length,
      bitsPerChar,
      uuidLength: Math.ceil(128 / bitsPerChar)
    });
  }
  
  // Sort by bits per character (densest first)
  return encodings.sort((a, b) => b.bitsPerChar - a.bitsPerChar);
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

if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}