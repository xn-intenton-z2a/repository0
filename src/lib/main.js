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

// Core encoding functions - TODO: Implement
export function encode(buffer, encoding) {
  throw new Error("encode() function not yet implemented");
}

export function decode(str, encoding) {
  throw new Error("decode() function not yet implemented");
}

// UUID encoding functions - TODO: Implement  
export function encodeUUID(uuid) {
  throw new Error("encodeUUID() function not yet implemented");
}

export function decodeUUID(str) {
  throw new Error("decodeUUID() function not yet implemented");
}

// Custom encoding functions - TODO: Implement
export function createEncoding(name, charset) {
  throw new Error("createEncoding() function not yet implemented");
}

export function listEncodings() {
  throw new Error("listEncodings() function not yet implemented");
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