#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";

export function main(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}

// Re-export utility functions implemented in src/lib/hamming.js
export { hammingDistanceString, hammingDistanceInt } from './hamming.js';
// Also provide conventional aliases expected by the mission and consumers
export { hammingDistanceString as hammingDistance, hammingDistanceInt as hammingDistanceBits } from './hamming.js';
