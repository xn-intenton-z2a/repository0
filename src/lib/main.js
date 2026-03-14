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

/**
 * Split a string into user-perceived characters (grapheme clusters) when possible.
 * Uses Intl.Segmenter with granularity 'grapheme' when available; falls back to Array.from.
 * This ensures emoji sequences like family emoji are treated as single units when supported.
 */
function splitGraphemes(str) {
  if (typeof str !== "string") throw new TypeError("Inputs must be strings");
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    try {
      const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      // seg.segment returns an iterable of { segment, index, ... }
      return Array.from(seg.segment(str), s => s.segment);
    } catch (e) {
      // If Segmenter exists but fails for some reason, fall back.
    }
  }
  // Fallback: Array.from splits by Unicode code points which is usually acceptable.
  return Array.from(str);
}

/**
 * Compute the Hamming distance between two strings measured in user-perceived characters.
 * - Throws TypeError("Inputs must be strings") if inputs are not strings
 * - Throws RangeError("Inputs must have same length") if lengths differ (by grapheme count)
 * - Returns integer count of differing positions
 */
export function computeHamming(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("Inputs must be strings");
  }
  const aUnits = splitGraphemes(a);
  const bUnits = splitGraphemes(b);
  if (aUnits.length !== bUnits.length) {
    throw new RangeError("Inputs must have same length");
  }
  let diff = 0;
  for (let i = 0; i < aUnits.length; i++) {
    if (aUnits[i] !== bUnits[i]) diff++;
  }
  return diff;
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
