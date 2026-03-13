// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { encode, decode, listEncodings } from "../../src/lib/main.js";

describe("Base91 Encoding", () => {
  test("should use correct charset and properties", () => {
    const encodings = listEncodings();
    const base91 = encodings.find(e => e.name === "base91");
    
    expect(base91).toBeDefined();
    expect(base91.size).toBe(91);
    expect(base91.bitsPerChar).toBeCloseTo(6.508, 3);
    expect(base91.uuidLength).toBe(20);
    expect(base91.charset.length).toBe(91);
  });

  test("should be the densest encoding", () => {
    const encodings = listEncodings();
    const base91 = encodings.find(e => e.name === "base91");
    
    // Base91 should have the highest bits per character
    expect(encodings[0].name).toBe("base91");
    expect(base91.bitsPerChar).toBeGreaterThan(6.4);
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
      const encoded = encode(testData, "base91");
      const decoded = decode(encoded, "base91");
      expect(decoded).toEqual(testData);
    }
  });
});