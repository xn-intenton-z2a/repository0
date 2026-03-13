// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { createEncoding, encode, decode, listEncodings } from "../../src/lib/main.js";

describe("Custom Encodings", () => {
  test("should create valid custom encodings", () => {
    const encoding = createEncoding("hex", "0123456789ABCDEF");
    
    expect(encoding.name).toBe("hex");
    expect(encoding.charset).toBe("0123456789ABCDEF");
    expect(encoding.size).toBe(16);
    expect(encoding.bitsPerChar).toBe(4);
  });

  test("should integrate custom encodings with encode/decode", () => {
    createEncoding("binary", "01");
    
    const testData = new Uint8Array([0xAA]); // 10101010 in binary
    const encoded = encode(testData, "binary");
    expect(encoded).toBe("10101010");
    
    const decoded = decode(encoded, "binary");
    expect(decoded).toEqual(testData);
  });

  test("should validate charset requirements", () => {
    // Test minimum length
    expect(() => createEncoding("short", "A")).toThrow("at least 2 characters");
    
    // Test duplicate characters
    expect(() => createEncoding("dupe", "ABBA")).toThrow("duplicate characters");
    
    // Test control characters
    expect(() => createEncoding("ctrl", "ABC\n")).toThrow("control characters");
    
    // Test empty name
    expect(() => createEncoding("", "ABC")).toThrow("non-empty string");
  });

  test("should prevent overwriting built-in encodings", () => {
    expect(() => createEncoding("base62", "custom")).toThrow("Cannot overwrite built-in");
    expect(() => createEncoding("base85", "custom")).toThrow("Cannot overwrite built-in");
    expect(() => createEncoding("base91", "custom")).toThrow("Cannot overwrite built-in");
  });

  test("should appear in listEncodings output", () => {
    createEncoding("test64", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
    
    const encodings = listEncodings();
    const testEncoding = encodings.find(e => e.name === "test64");
    
    expect(testEncoding).toBeDefined();
    expect(testEncoding.size).toBe(64);
    expect(testEncoding.bitsPerChar).toBe(6);
    expect(testEncoding.uuidLength).toBe(22);
  });
});