// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { encode, decode, listEncodings } from "../../src/lib/main.js";

describe("Base62 Encoding", () => {
  test("should use correct charset and properties", () => {
    const encodings = listEncodings();
    const base62 = encodings.find(e => e.name === "base62");
    
    expect(base62).toBeDefined();
    expect(base62.charset).toBe("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    expect(base62.size).toBe(62);
    expect(base62.bitsPerChar).toBeCloseTo(5.954, 3);
    expect(base62.uuidLength).toBe(22);
  });

  test("should produce URL-safe output", () => {
    const testData = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]);
    const encoded = encode(testData, "base62");
    
    // Base62 should only contain alphanumeric characters
    expect(/^[0-9a-zA-Z]+$/.test(encoded)).toBe(true);
  });

  test("should maintain round-trip property", () => {
    const testCases = [
      new Uint8Array([]),
      new Uint8Array([0x00]),
      new Uint8Array([0xFF]), 
      new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]),
      new Uint8Array(Array(16).fill(0).map(() => Math.floor(Math.random() * 256)))
    ];
    
    for (const testData of testCases) {
      const encoded = encode(testData, "base62");
      const decoded = decode(encoded, "base62");
      expect(decoded).toEqual(testData);
    }
  });
});