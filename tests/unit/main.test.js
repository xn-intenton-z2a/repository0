// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { 
  main, 
  getIdentity, 
  name, 
  version, 
  description,
  hammingDistance,
  hammingDistanceBits
} from "../../src/lib/main.js";

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
  });
});

describe("Library Identity", () => {
  test("exports name, version, and description", () => {
    expect(typeof name).toBe("string");
    expect(typeof version).toBe("string");
    expect(typeof description).toBe("string");
    expect(name.length).toBeGreaterThan(0);
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });

  test("getIdentity returns correct structure", () => {
    const identity = getIdentity();
    expect(identity).toEqual({ name, version, description });
  });
});

describe('hammingDistance', () => {
  describe('normal cases', () => {
    test('computes distance for different strings', () => {
      expect(hammingDistance("karolin", "kathrin")).toBe(3);
    });

    test('returns 0 for identical strings', () => {
      expect(hammingDistance("hello", "hello")).toBe(0);
      expect(hammingDistance("", "")).toBe(0);
    });

    test('returns correct distance for single character differences', () => {
      expect(hammingDistance("a", "b")).toBe(1);
      expect(hammingDistance("ab", "aa")).toBe(1);
      expect(hammingDistance("ab", "cb")).toBe(1);
    });

    test('handles all characters different', () => {
      expect(hammingDistance("abc", "xyz")).toBe(3);
    });
  });

  describe('Unicode support', () => {
    test('handles Unicode characters correctly', () => {
      expect(hammingDistance("café", "case")).toBe(2);
      expect(hammingDistance("🚀🌟", "🚀🎉")).toBe(1);
      expect(hammingDistance("αβγ", "αβδ")).toBe(1);
    });

    test('handles emoji and multi-byte characters', () => {
      expect(hammingDistance("👋🌍", "👋🌎")).toBe(1);
      expect(hammingDistance("🎵🎶", "🎵🎵")).toBe(1);
    });
  });

  describe('edge cases', () => {
    test('handles empty strings', () => {
      expect(hammingDistance("", "")).toBe(0);
    });

    test('handles whitespace and special characters', () => {
      expect(hammingDistance("a b", "a c")).toBe(1);
      expect(hammingDistance("a\tb", "a\nb")).toBe(1);
      expect(hammingDistance("!@#", "!@$")).toBe(1);
    });
  });

  describe('input validation', () => {
    test('throws TypeError for non-string arguments', () => {
      expect(() => hammingDistance(123, "abc")).toThrow(TypeError);
      expect(() => hammingDistance("abc", 123)).toThrow(TypeError);
      expect(() => hammingDistance(null, "abc")).toThrow(TypeError);
      expect(() => hammingDistance("abc", null)).toThrow(TypeError);
      expect(() => hammingDistance(undefined, "abc")).toThrow(TypeError);
      expect(() => hammingDistance("abc", undefined)).toThrow(TypeError);
      expect(() => hammingDistance([], "abc")).toThrow(TypeError);
      expect(() => hammingDistance("abc", {})).toThrow(TypeError);
    });

    test('throws RangeError for unequal length strings', () => {
      expect(() => hammingDistance("a", "bb")).toThrow(RangeError);
      expect(() => hammingDistance("abc", "ab")).toThrow(RangeError);
      expect(() => hammingDistance("", "a")).toThrow(RangeError);
      expect(() => hammingDistance("longer", "short")).toThrow(RangeError);
    });

    test('throws correct error messages', () => {
      expect(() => hammingDistance(123, "abc")).toThrow('First argument must be a string');
      expect(() => hammingDistance("abc", 123)).toThrow('Second argument must be a string');
      expect(() => hammingDistance("a", "bb")).toThrow('Strings must have equal length');
    });
  });
});

describe('hammingDistanceBits', () => {
  describe('normal cases', () => {
    test('computes distance for different integers', () => {
      expect(hammingDistanceBits(1, 4)).toBe(2); // 001 vs 100
      expect(hammingDistanceBits(7, 4)).toBe(2); // 111 vs 100
      expect(hammingDistanceBits(5, 3)).toBe(2); // 101 vs 011
    });

    test('returns 0 for identical integers', () => {
      expect(hammingDistanceBits(0, 0)).toBe(0);
      expect(hammingDistanceBits(5, 5)).toBe(0);
      expect(hammingDistanceBits(255, 255)).toBe(0);
    });

    test('handles single bit differences', () => {
      expect(hammingDistanceBits(0, 1)).toBe(1);  // 0 vs 1
      expect(hammingDistanceBits(1, 0)).toBe(1);  // 1 vs 0
      expect(hammingDistanceBits(2, 3)).toBe(1);  // 10 vs 11
      expect(hammingDistanceBits(8, 12)).toBe(1); // 1000 vs 1100
    });

    test('handles large integers', () => {
      expect(hammingDistanceBits(1024, 2048)).toBe(2); // 10000000000 vs 100000000000
      expect(hammingDistanceBits(65535, 0)).toBe(16);  // 16 bits all different
    });
  });

  describe('edge cases', () => {
    test('handles zero', () => {
      expect(hammingDistanceBits(0, 0)).toBe(0);
      expect(hammingDistanceBits(0, 7)).toBe(3); // 000 vs 111
      expect(hammingDistanceBits(15, 0)).toBe(4); // 1111 vs 0000
    });

    test('handles powers of 2', () => {
      expect(hammingDistanceBits(1, 2)).toBe(2);   // 01 vs 10
      expect(hammingDistanceBits(4, 8)).toBe(2);   // 0100 vs 1000
      expect(hammingDistanceBits(16, 32)).toBe(2); // 10000 vs 100000
    });
  });

  describe('input validation', () => {
    test('throws TypeError for non-integer arguments', () => {
      expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, 2.5)).toThrow(TypeError);
      expect(() => hammingDistanceBits("1", 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, "2")).toThrow(TypeError);
      expect(() => hammingDistanceBits(null, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, null)).toThrow(TypeError);
      expect(() => hammingDistanceBits(undefined, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, undefined)).toThrow(TypeError);
      expect(() => hammingDistanceBits(NaN, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, NaN)).toThrow(TypeError);
      expect(() => hammingDistanceBits(Infinity, 2)).toThrow(TypeError);
    });

    test('throws RangeError for negative integers', () => {
      expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
      expect(() => hammingDistanceBits(1, -2)).toThrow(RangeError);
      expect(() => hammingDistanceBits(-1, -2)).toThrow(RangeError);
    });

    test('throws correct error messages', () => {
      expect(() => hammingDistanceBits(1.5, 2)).toThrow('First argument must be an integer');
      expect(() => hammingDistanceBits(1, 2.5)).toThrow('Second argument must be an integer');
      expect(() => hammingDistanceBits(-1, 2)).toThrow('First argument must be non-negative');
      expect(() => hammingDistanceBits(1, -2)).toThrow('Second argument must be non-negative');
    });
  });
});
