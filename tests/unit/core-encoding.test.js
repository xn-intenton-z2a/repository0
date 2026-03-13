// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { encode, decode } from "../../src/lib/main.js";

describe("Core Encoding Functions", () => {
  test("should encode and decode arbitrary binary data", () => {
    const testData = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]);
    
    for (const encoding of ["base62", "base85", "base91"]) {
      const encoded = encode(testData, encoding);
      expect(typeof encoded).toBe("string");
      expect(encoded.length).toBeGreaterThan(0);
      
      const decoded = decode(encoded, encoding);
      expect(decoded).toEqual(testData);
    }
  });

  test("should handle edge cases correctly", () => {
    const testCases = [
      new Uint8Array([]), // empty buffer
      new Uint8Array([0x00]), // single zero byte
      new Uint8Array([0xFF]), // single max byte
      new Uint8Array([0x00, 0x00, 0x00, 0x00]), // all-zero bytes
      new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]) // all-0xFF bytes
    ];
    
    for (const encoding of ["base62", "base85", "base91"]) {
      for (const testData of testCases) {
        const encoded = encode(testData, encoding);
        const decoded = decode(encoded, encoding);
        expect(decoded).toEqual(testData);
      }
    }
  });

  test("should enforce round-trip property", () => {
    // Test with random binary data
    for (let i = 0; i < 10; i++) {
      const size = Math.floor(Math.random() * 100) + 1;
      const testData = new Uint8Array(size);
      for (let j = 0; j < size; j++) {
        testData[j] = Math.floor(Math.random() * 256);
      }
      
      for (const encoding of ["base62", "base85", "base91"]) {
        const encoded = encode(testData, encoding);
        const decoded = decode(encoded, encoding);
        expect(decoded).toEqual(testData);
      }
    }
  });
});