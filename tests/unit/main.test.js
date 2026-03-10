// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, getIdentity, name, version, description, hammingDistance, hammingDistanceBits } from "../../src/lib/main.js";

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

describe("Hamming Distance Functions", () => {
  describe("hammingDistance", () => {
    test("computes distance between equal length strings", () => {
      expect(hammingDistance("karolin", "kathrin")).toBe(3);
      expect(hammingDistance("1011101", "1001001")).toBe(2);
      expect(hammingDistance("2173896", "2233796")).toBe(3);
    });

    test("returns 0 for identical strings", () => {
      expect(hammingDistance("", "")).toBe(0);
      expect(hammingDistance("hello", "hello")).toBe(0);
      expect(hammingDistance("123", "123")).toBe(0);
    });

    test("handles Unicode strings correctly", () => {
      expect(hammingDistance("café", "case")).toBe(2);
      expect(hammingDistance("🎉🎊", "🎉🎁")).toBe(1);
    });

    test("throws TypeError for non-string arguments", () => {
      expect(() => hammingDistance(123, "abc")).toThrow(TypeError);
      expect(() => hammingDistance("abc", 123)).toThrow(TypeError);
      expect(() => hammingDistance(null, "abc")).toThrow(TypeError);
      expect(() => hammingDistance("abc", undefined)).toThrow(TypeError);
    });

    test("throws RangeError for unequal length strings", () => {
      expect(() => hammingDistance("a", "bb")).toThrow(RangeError);
      expect(() => hammingDistance("short", "longer string")).toThrow(RangeError);
      expect(() => hammingDistance("", "non-empty")).toThrow(RangeError);
    });
  });

  describe("hammingDistanceBits", () => {
    test("computes distance between integers", () => {
      expect(hammingDistanceBits(1, 4)).toBe(2); // 001 vs 100
      expect(hammingDistanceBits(7, 4)).toBe(2); // 111 vs 100
      expect(hammingDistanceBits(15, 8)).toBe(3); // 1111 vs 1000
    });

    test("returns 0 for identical integers", () => {
      expect(hammingDistanceBits(0, 0)).toBe(0);
      expect(hammingDistanceBits(5, 5)).toBe(0);
      expect(hammingDistanceBits(255, 255)).toBe(0);
    });

    test("handles large integers", () => {
      expect(hammingDistanceBits(0xFFFF, 0x0000)).toBe(16);
      expect(hammingDistanceBits(0xAAAA, 0x5555)).toBe(16);
    });

    test("throws TypeError for non-integer arguments", () => {
      expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, 2.7)).toThrow(TypeError);
      expect(() => hammingDistanceBits("1", 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, "2")).toThrow(TypeError);
      expect(() => hammingDistanceBits(null, 2)).toThrow(TypeError);
    });

    test("throws RangeError for negative integers", () => {
      expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
      expect(() => hammingDistanceBits(1, -2)).toThrow(RangeError);
      expect(() => hammingDistanceBits(-1, -2)).toThrow(RangeError);
    });
  });
});
