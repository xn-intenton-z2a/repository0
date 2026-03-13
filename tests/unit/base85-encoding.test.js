// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { encode, decode, listEncodings } from "../../src/lib/main.js";

describe("Base85 Encoding", () => {
  test("should use correct charset and properties", () => {
    const encodings = listEncodings();
    const base85 = encodings.find(e => e.name === "base85");
    
    expect(base85).toBeDefined();
    expect(base85.size).toBe(85);
    expect(base85.bitsPerChar).toBeCloseTo(6.408, 2);
    expect(base85.uuidLength).toBe(20);
    expect(base85.charset.length).toBe(85);
  });

  test("should produce printable ASCII output", () => {
    const testData = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]);
    const encoded = encode(testData, "base85");
    
    // Base85 should only contain printable ASCII characters
    for (let i = 0; i < encoded.length; i++) {
      const code = encoded.charCodeAt(i);
      expect(code).toBeGreaterThanOrEqual(33); // No control chars
      expect(code).toBeLessThanOrEqual(126); // Printable range
    }
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
      const encoded = encode(testData, "base85");
      const decoded = decode(encoded, "base85");
      expect(decoded).toEqual(testData);
    }
  });
});