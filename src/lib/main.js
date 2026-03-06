#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { hammingDistance, hammingDistanceBits } from "./hamming.js";

export function main(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

// Re-export utilities for consumers that import from the package entry
export { hammingDistance, hammingDistanceBits };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
