// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { listEncodings } from "../../src/lib/main.js";

describe("Encoding Metadata", () => {
  test("should return all built-in encodings", () => {
    const encodings = listEncodings();
    
    expect(encodings.length).toBeGreaterThanOrEqual(3);
    
    const names = encodings.map(e => e.name);
    expect(names).toContain("base62");
    expect(names).toContain("base85");
    expect(names).toContain("base91");
  });

  test("should include complete metadata for each encoding", () => {
    const encodings = listEncodings();
    
    for (const encoding of encodings) {
      expect(encoding).toHaveProperty("name");
      expect(encoding).toHaveProperty("charset");
      expect(encoding).toHaveProperty("size");
      expect(encoding).toHaveProperty("bitsPerChar");
      expect(encoding).toHaveProperty("uuidLength");
      
      expect(typeof encoding.name).toBe("string");
      expect(typeof encoding.charset).toBe("string");
      expect(typeof encoding.size).toBe("number");
      expect(typeof encoding.bitsPerChar).toBe("number");
      expect(typeof encoding.uuidLength).toBe("number");
      
      expect(encoding.size).toBe(encoding.charset.length);
      expect(encoding.bitsPerChar).toBeCloseTo(Math.log2(encoding.size), 5);
      expect(encoding.uuidLength).toBe(Math.ceil(128 / encoding.bitsPerChar));
    }
  });

  test("should sort encodings by bit density (densest first)", () => {
    const encodings = listEncodings();
    
    for (let i = 1; i < encodings.length; i++) {
      expect(encodings[i - 1].bitsPerChar).toBeGreaterThanOrEqual(encodings[i].bitsPerChar);
    }
    
    // Base91 should be first (densest)
    expect(encodings[0].name).toBe("base91");
  });
});