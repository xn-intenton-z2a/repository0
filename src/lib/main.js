#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

const isNode = typeof process !== "undefined" && !!process.versions?.node;

let pkg;
if (isNode) {
  const { createRequire } = await import("module");
  const requireFn = createRequire(import.meta.url);
  try {
    pkg = requireFn("../../package.json");
  } catch {
    pkg = { name: "repo", version: "0.0.0", description: "" };
  }
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

// Encoding library
const ambiguousChars = new Set(["0", "O", "1", "l", "I"]);

function isPrintableVisibleChar(ch) {
  if (!ch || ch.length !== 1) return false;
  const code = ch.charCodeAt(0);
  return code >= 0x21 && code <= 0x7e; // U+0021..U+007E
}

function uniqueChars(str) {
  const seen = new Set();
  for (const ch of str) {
    if (seen.has(ch)) return false;
    seen.add(ch);
  }
  return true;
}

function bytesToBigInt(bytes) {
  let n = 0n;
  for (let i = 0; i < bytes.length; i++) {
    n = (n << 8n) | BigInt(bytes[i]);
  }
  return n;
}

function bigIntToBytes(n) {
  if (n === 0n) return new Uint8Array(0);
  const parts = [];
  while (n > 0n) {
    parts.push(Number(n & 0xffn));
    n >>= 8n;
  }
  parts.reverse();
  return new Uint8Array(parts);
}

const encodings = new Map();
let customCounter = 1;

function registerEncoding(name, charset) {
  const obj = {
    name,
    charset,
    charsetSize: charset.length,
    bitsPerChar: Math.log2(charset.length),
  };
  encodings.set(name, obj);
  return obj;
}

// Built-in charsets
const base62Charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 62
// Ascii85 standard uses codepoints 33 (!) through 117 (u) inclusive -> 85 chars
let ascii85 = "";
for (let i = 33; i <= 117; i++) ascii85 += String.fromCharCode(i);
// Base91: printable ASCII 33..123 inclusive (91 chars)
let base91 = "";
for (let i = 33; i <= 123; i++) base91 += String.fromCharCode(i);
// Densest: printable ASCII 33..126 inclusive excluding ambiguous characters
let densest = "";
for (let i = 33; i <= 126; i++) {
  const ch = String.fromCharCode(i);
  if (!ambiguousChars.has(ch)) densest += ch;
}

registerEncoding("base62", base62Charset);
registerEncoding("base85", ascii85);
registerEncoding("base91", base91);
registerEncoding("densest", densest);

export function listEncodings() {
  return Array.from(encodings.values()).map(e => ({ name: e.name, bitsPerChar: e.bitsPerChar, charsetSize: e.charsetSize, charset: e.charset }));
}

export function createEncoding(charsetString, name) {
  if (typeof charsetString !== 'string' || charsetString.length < 2) {
    throw new TypeError('createEncoding: charsetString must be a string with at least 2 unique characters');
  }
  if (!uniqueChars(charsetString)) {
    throw new TypeError('createEncoding: charsetString must not contain duplicate characters');
  }
  for (const ch of charsetString) {
    if (!isPrintableVisibleChar(ch)) {
      throw new TypeError('createEncoding: charset contains invalid or control characters');
    }
    if (ambiguousChars.has(ch)) {
      throw new TypeError('createEncoding: charset contains ambiguous characters (0/O/1/l/I) which are disallowed');
    }
  }
  const chosenName = typeof name === 'string' && name.length ? name : `custom-${customCounter++}`;
  if (encodings.has(chosenName)) throw new Error('createEncoding: name already exists');
  return registerEncoding(chosenName, charsetString);
}

function getEncodingObject(enc) {
  if (!enc) return encodings.get('base62');
  if (typeof enc === 'string') {
    const found = encodings.get(enc);
    if (!found) throw new Error(`Unknown encoding: ${enc}`);
    return found;
  }
  if (typeof enc === 'object' && enc.charset) return enc;
  throw new TypeError('Invalid encoding specification');
}

export function encode(bytes, enc) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('encode: input must be Uint8Array');
  const encoding = getEncodingObject(enc);
  const alphabet = encoding.charset;
  const base = BigInt(alphabet.length);

  // count leading zeros
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
  const trimmed = bytes.subarray(zeros);
  if (trimmed.length === 0) {
    // empty input -> empty string; but preserve all-zero input as repeated alphabet[0]
    return zeros === 0 ? '' : alphabet[0].repeat(zeros);
  }
  let n = bytesToBigInt(trimmed);
  const chars = [];
  while (n > 0n) {
    const rem = Number(n % base);
    chars.push(alphabet[rem]);
    n = n / base;
  }
  chars.reverse();
  return alphabet[0].repeat(zeros) + chars.join('');
}

export function decode(str, enc) {
  if (typeof str !== 'string') throw new TypeError('decode: input must be a string');
  if (str.length === 0) return new Uint8Array(0);
  const encoding = getEncodingObject(enc);
  const alphabet = encoding.charset;
  const base = BigInt(alphabet.length);

  // count leading alphabet[0] as leading zero bytes
  let zeros = 0;
  while (zeros < str.length && str[zeros] === alphabet[0]) zeros++;
  const payload = str.slice(zeros);
  let n = 0n;
  for (const ch of payload) {
    const idx = alphabet.indexOf(ch);
    if (idx === -1) throw new Error('decode: invalid character for encoding');
    n = n * base + BigInt(idx);
  }
  const bytes = bigIntToBytes(n);
  const out = new Uint8Array(zeros + bytes.length);
  if (zeros > 0) out.fill(0, 0, zeros);
  if (bytes.length > 0) out.set(bytes, zeros);
  return out;
}

export function encodeUUID(uuidString, enc, options = {}) {
  if (typeof uuidString !== 'string') throw new TypeError('encodeUUID: uuidString must be a string');
  const hex = uuidString.replace(/-/g, '').toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(hex)) throw new TypeError('encodeUUID: invalid uuid string');
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  const toEncode = options.reverse ? bytes.slice().reverse() : bytes;
  return encode(toEncode, enc);
}

export function decodeUUID(encodedString, enc, options = {}) {
  const bytes = decode(encodedString, enc);
  const out = options.reverse ? bytes.slice().reverse() : bytes;
  if (out.length !== 16) throw new TypeError('decodeUUID: decoded bytes length is not 16');
  const hex = Array.from(out).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

// Mission-complete evaluation utilities
export function evaluateMissionComplete(metrics = {}, thresholds = {}) {
  // metrics: { resolvedIssues, sourceTodos, acceptanceCriteriaMet, acceptanceCriteriaTotal }
  // thresholds: { minResolvedIssues = 1, maxSourceTodos = 0, requireAcceptanceCriteria = true }
  const defaults = { minResolvedIssues: 1, maxSourceTodos: 0, requireAcceptanceCriteria: true };
  const t = Object.assign({}, defaults, thresholds);
  const m = Object.assign({ resolvedIssues: 0, sourceTodos: 0, acceptanceCriteriaMet: 0, acceptanceCriteriaTotal: 0 }, metrics);

  const resolvedIssuesMet = Number(m.resolvedIssues) >= Number(t.minResolvedIssues);
  const sourceTodosMet = Number(m.sourceTodos) <= Number(t.maxSourceTodos);
  let acceptanceCriteriaMet = true;
  if (t.requireAcceptanceCriteria) {
    if (Number(m.acceptanceCriteriaTotal) > 0) {
      acceptanceCriteriaMet = Number(m.acceptanceCriteriaMet) === Number(m.acceptanceCriteriaTotal);
    } else {
      // If no acceptance criteria defined, consider this condition satisfied
      acceptanceCriteriaMet = true;
    }
  }

  const missionComplete = resolvedIssuesMet && sourceTodosMet && acceptanceCriteriaMet;

  const conditions = { resolvedIssuesMet, sourceTodosMet, acceptanceCriteriaMet };
  const reasons = [];
  if (!resolvedIssuesMet) reasons.push('min resolved issues not met');
  if (!sourceTodosMet) reasons.push('too many TODOs in source');
  if (!acceptanceCriteriaMet) reasons.push('not all acceptance criteria met');

  return { missionComplete, conditions, reasons, metrics: m, thresholds: t };
}

export function formatMissionLog(result) {
  const m = result.metrics || {};
  const t = result.thresholds || {};
  const lines = [];
  const total = Number(m.acceptanceCriteriaTotal) || 0;
  lines.push(`Acceptance criteria | ${Number(m.acceptanceCriteriaMet)}/${total}`);
  lines.push(`Resolved issues | ${Number(m.resolvedIssues)} (min required ${Number(t.minResolvedIssues)})`);
  lines.push(`Source TODOs | ${Number(m.sourceTodos)} (max allowed ${Number(t.maxSourceTodos)})`);
  lines.push(`Mission complete declared | ${result.missionComplete ? 'YES' : 'NO'}`);
  if (result.reasons && result.reasons.length) {
    lines.push('Reasons: ' + result.reasons.join('; '));
  }
  return lines.join('\n');
}

// If run directly in node
if (isNode) {
  const { fileURLToPath } = await import("url");
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    main(args);
  }
}
