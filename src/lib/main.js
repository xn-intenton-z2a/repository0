#!/usr/bin/env node
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name || 'repository0';
export const version = pkg.version || '0.0.0';
export const description = pkg.description || '';

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

// Hamming distance implementation
function isStringLike(x) {
  return typeof x === 'string' || x instanceof String;
}

function isByteLike(x) {
  // ArrayBuffer views (Uint8Array, Buffer in Node is also a Uint8Array subclass)
  return (typeof x === 'object' && x !== null && ArrayBuffer.isView(x));
}

export function hamming(a, b) {
  // Validate types
  if (isStringLike(a) && isStringLike(b)) {
    const sa = String(a);
    const sb = String(b);
    if (sa.length !== sb.length) {
      throw new TypeError('Inputs must have the same length');
    }
    let diff = 0;
    // Compare by UTF-16 code unit as required by acceptance criteria
    for (let i = 0; i < sa.length; i++) {
      if (sa.charCodeAt(i) !== sb.charCodeAt(i)) diff++;
    }
    return diff;
  }

  if (isByteLike(a) && isByteLike(b)) {
    const va = new Uint8Array(a.buffer ?? a, a.byteOffset ?? 0, a.byteLength ?? a.length);
    const vb = new Uint8Array(b.buffer ?? b, b.byteOffset ?? 0, b.byteLength ?? b.length);
    if (va.length !== vb.length) {
      throw new TypeError('Inputs must have the same length');
    }
    let diff = 0;
    for (let i = 0; i < va.length; i++) {
      if (va[i] !== vb[i]) diff++;
    }
    return diff;
  }

  throw new TypeError('Inputs must be both strings or both byte-like objects of equal length');
}

// default export object exposing hamming
const defaultExport = { hamming };
export default defaultExport;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
