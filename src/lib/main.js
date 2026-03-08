#!/usr/bin/env node
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

// Hamming distance implementation
export function hamming(a, b) {
  // Validate types: string-like or byte-like (ArrayBuffer views)
  const isString = (x) => typeof x === 'string' || x instanceof String;
  const isView = (x) => ArrayBuffer.isView(x);

  if (isString(a) && isString(b)) {
    const s1 = String(a);
    const s2 = String(b);
    if (s1.length !== s2.length) {
      throw new TypeError('Inputs must have the same length');
    }
    let diff = 0;
    for (let i = 0; i < s1.length; i++) {
      if (s1.charCodeAt(i) !== s2.charCodeAt(i)) diff++;
    }
    return diff;
  }

  if (isView(a) && isView(b)) {
    const v1 = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    const v2 = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
    if (v1.length !== v2.length) {
      throw new TypeError('Inputs must have the same length');
    }
    let diff = 0;
    for (let i = 0; i < v1.length; i++) {
      if (v1[i] !== v2[i]) diff++;
    }
    return diff;
  }

  throw new TypeError('Inputs must be strings or byte array views of equal length');
}

export default { hamming };

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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
