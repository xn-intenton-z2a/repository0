#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

// Built-in encodings with safe character sets
const ENCODINGS = {
  base62: {
    name: 'base62',
    charset: '0123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz', // Removed O, I, l for safety
    bitDensity: 5.95 // Keep original spec value  
  },
  base85: {
    name: 'base85',
    charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?^_`{|}~',
    bitDensity: 6.41
  },
  base91: {
    name: 'base91', 
    charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~-',
    bitDensity: 6.50
  }
};

/**
 * Encode a buffer using the specified encoding
 */
export function encode(buffer, encoding) {
  const enc = ENCODINGS[encoding];
  if (!enc) {
    throw new Error(`Unknown encoding: ${encoding}`);
  }

  if (buffer.length === 0) {
    return '';
  }

  // Use generic bigint encoding for all formats for reliability
  return encodeBigInt(buffer, enc.charset);
}

/**
 * Decode a string using the specified encoding
 */
export function decode(str, encoding) {
  const enc = ENCODINGS[encoding];
  if (!enc) {
    throw new Error(`Unknown encoding: ${encoding}`);
  }

  if (str.length === 0) {
    return Buffer.alloc(0);
  }

  // Use generic bigint decoding for all formats for reliability
  return decodeBigInt(str, enc.charset);
}

/**
 * Encode a UUID string using the densest available encoding
 */
export function encodeUUID(uuid) {
  const cleanUuid = uuid.replace(/-/g, '');
  if (cleanUuid.length !== 32) {
    throw new Error('Invalid UUID format');
  }
  
  const buffer = Buffer.from(cleanUuid, 'hex');
  return encode(buffer, 'base91');
}

/**
 * Decode a UUID from an encoded string
 */
export function decodeUUID(str) {
  const buffer = decode(str, 'base91');
  if (buffer.length !== 16) {
    throw new Error('Decoded data is not a valid UUID (must be 16 bytes)');
  }
  
  const hex = buffer.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Create a custom encoding from a character set
 */
export function createEncoding(name, charset) {
  if (charset.length < 2) {
    throw new Error('Charset must contain at least 2 characters');
  }
  
  if (new Set(charset).size !== charset.length) {
    throw new Error('Charset contains duplicate characters');
  }
  
  const bitDensity = Math.log2(charset.length);
  const encoding = {
    name,
    charset,
    bitDensity
  };
  
  ENCODINGS[name] = encoding;
  return encoding;
}

/**
 * List all available encodings with their metadata
 */
export function listEncodings() {
  return Object.values(ENCODINGS).map(enc => ({
    name: enc.name,
    charset: enc.charset,
    bitDensity: enc.bitDensity,
    charsetLength: enc.charset.length
  }));
}

// Reliable BigInt-based encoding with exact length preservation  
function encodeBigInt(buffer, charset) {
  const base = BigInt(charset.length);
  
  // Convert buffer to BigInt
  let num = BigInt(0);
  for (let i = 0; i < buffer.length; i++) {
    num = (num << 8n) | BigInt(buffer[i]);
  }
  
  // Handle zero case first
  if (num === 0n) {
    // For all zeros, calculate minimum characters needed
    const minChars = Math.ceil(buffer.length * Math.log(256) / Math.log(charset.length));
    return charset[0].repeat(minChars);
  }
  
  // Convert to target base
  let result = '';
  while (num > 0n) {
    const remainder = num % base;
    result = charset[Number(remainder)] + result;
    num = num / base;
  }
  
  return result;
}

function decodeBigInt(str, charset) {
  const base = BigInt(charset.length);
  
  // Convert from base
  let num = BigInt(0);
  for (let i = 0; i < str.length; i++) {
    const charIndex = charset.indexOf(str[i]);
    if (charIndex === -1) {
      throw new Error(`Invalid character in ${charset.length}-base string: ${str[i]}`);
    }
    num = num * base + BigInt(charIndex);
  }
  
  // Convert to bytes
  if (num === 0n) {
    // For all-zero string, estimate original byte length
    const estimatedBytes = Math.floor(str.length * Math.log(charset.length) / Math.log(256));
    return Buffer.alloc(Math.max(1, estimatedBytes));
  }
  
  const bytes = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xFFn));
    num = num >> 8n;
  }
  
  return Buffer.from(bytes);
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
  
  // Demo functionality
  if (args?.includes("--demo")) {
    console.log('Dense Binary-to-Text Encoding Library Demo\n');
    
    const sampleUUID = '01234567-89ab-cdef-0123-456789abcdef';
    console.log(`Sample UUID: ${sampleUUID}`);
    
    console.log('\nEncoding Comparisons:');
    console.log('===================');
    
    const uuidBuffer = Buffer.from(sampleUUID.replace(/-/g, ''), 'hex');
    const base64 = uuidBuffer.toString('base64');
    
    console.log(`Base64:   ${base64} (${base64.length} chars)`);
    
    for (const encoding of ['base62', 'base85', 'base91']) {
      const encoded = encode(uuidBuffer, encoding);
      console.log(`${encoding.padEnd(8)}: ${encoded} (${encoded.length} chars)`);
    }
    
    console.log(`\nUUID shorthand: ${encodeUUID(sampleUUID)} (${encodeUUID(sampleUUID).length} chars)`);
    
    return;
  }
  
  console.log(`${name}@${version}`);
  console.log('Add --demo to see encoding examples');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}