#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js - Dense Binary-to-Text Encoding Library

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

// ============================================================================
// CORE ENCODING ENGINE
// ============================================================================

class BaseEncoder {
  constructor(name, charset) {
    this.name = name;
    this.charset = charset;
    this.base = charset.length;
    this.bitsPerChar = Math.log2(this.base);
  }

  encode(buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError('Input must be a Buffer');
    }
    if (buffer.length === 0) {
      return '';
    }

    // Convert buffer to big integer
    let value = 0n;
    for (let i = 0; i < buffer.length; i++) {
      value = value * 256n + BigInt(buffer[i]);
    }

    if (value === 0n) {
      // For all zeros, return minimal encoding
      return this.charset[0];
    }

    // Convert to base
    let result = '';
    const base = BigInt(this.base);
    while (value > 0n) {
      result = this.charset[Number(value % base)] + result;
      value = value / base;
    }

    return result;
  }

  decode(str) {
    if (typeof str !== 'string') {
      throw new TypeError('Input must be a string');
    }
    if (str === '') {
      return Buffer.alloc(0);
    }

    // Convert from base to big integer
    let value = 0n;
    const base = BigInt(this.base);
    for (const char of str) {
      const index = this.charset.indexOf(char);
      if (index === -1) {
        throw new Error(`Invalid character '${char}' for encoding ${this.name}`);
      }
      value = value * base + BigInt(index);
    }

    if (value === 0n) {
      return Buffer.from([0]);
    }

    // Convert to bytes
    const bytes = [];
    while (value > 0n) {
      bytes.unshift(Number(value & 0xFFn));
      value = value / 256n;
    }

    return Buffer.from(bytes);
  }

  getMetadata() {
    return {
      name: this.name,
      charset: this.charset,
      base: this.base,
      bitsPerChar: this.bitsPerChar,
      uuidLength: Math.ceil(128 / this.bitsPerChar)
    };
  }
}

// ============================================================================
// BUILT-IN ENCODINGS
// ============================================================================

const encoders = new Map();

// Base62: 0-9a-zA-Z (~5.95 bits/char, 22 chars for UUID)
encoders.set('base62', new BaseEncoder('base62', 
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));

// Base85 (Z85 variant): ~6.41 bits/char, 20 chars for UUID  
encoders.set('base85', new BaseEncoder('base85',
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#'));

// Base91: ~6.50 bits/char, ~20 chars for UUID
encoders.set('base91', new BaseEncoder('base91',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"'));

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Encode arbitrary binary data using a named encoding
 * @param {Buffer} buffer - Binary data to encode
 * @param {string} encoding - Name of the encoding to use
 * @returns {string} Encoded string
 */
export function encode(buffer, encoding) {
  const encoder = encoders.get(encoding);
  if (!encoder) {
    throw new Error(`Unknown encoding: ${encoding}`);
  }
  return encoder.encode(buffer);
}

/**
 * Decode a string using a named encoding
 * @param {string} str - String to decode
 * @param {string} encoding - Name of the encoding to use
 * @returns {Buffer} Decoded binary data
 */
export function decode(str, encoding) {
  const encoder = encoders.get(encoding);
  if (!encoder) {
    throw new Error(`Unknown encoding: ${encoding}`);
  }
  return encoder.decode(str);
}

/**
 * Encode a UUID string (strips dashes, encodes the 16 bytes)
 * @param {string} uuid - UUID string (with or without dashes)
 * @param {string} encoding - Encoding to use (default: 'base91')
 * @returns {string} Encoded UUID
 */
export function encodeUUID(uuid, encoding = 'base91') {
  if (typeof uuid !== 'string') {
    throw new TypeError('UUID must be a string');
  }
  
  // Strip dashes and validate format
  const cleaned = uuid.replace(/-/g, '').toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(cleaned)) {
    throw new Error('Invalid UUID format');
  }
  
  // Convert hex string to buffer
  const buffer = Buffer.from(cleaned, 'hex');
  return encode(buffer, encoding);
}

/**
 * Decode a UUID from an encoded string
 * @param {string} str - Encoded UUID string
 * @param {string} encoding - Encoding to use (default: 'base91')
 * @returns {string} UUID string with dashes
 */
export function decodeUUID(str, encoding = 'base91') {
  const buffer = decode(str, encoding);
  if (buffer.length !== 16) {
    throw new Error('Decoded data is not a valid UUID (must be 16 bytes)');
  }
  
  // Convert to hex and add dashes
  const hex = buffer.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Create a custom encoding from a character set
 * @param {string} name - Name for the encoding
 * @param {string} charset - Character set string
 */
export function createEncoding(name, charset) {
  if (typeof name !== 'string' || typeof charset !== 'string') {
    throw new TypeError('Name and charset must be strings');
  }
  if (charset.length < 2) {
    throw new Error('Charset must have at least 2 characters');
  }
  if (new Set(charset).size !== charset.length) {
    throw new Error('Charset must not contain duplicate characters');
  }
  
  encoders.set(name, new BaseEncoder(name, charset));
}

/**
 * List available encodings with metadata
 * @returns {Array} Array of encoding metadata objects
 */
export function listEncodings() {
  return Array.from(encoders.values()).map(encoder => encoder.getMetadata());
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

export function main(args) {
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  if (args?.includes("--encodings")) {
    console.log(JSON.stringify(listEncodings(), null, 2));
    return;
  }
  console.log(`${name}@${version}`);
  console.log('Dense binary-to-text encoding library');
  console.log('Available encodings:', listEncodings().map(e => `${e.name} (${e.base} chars)`).join(', '));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}