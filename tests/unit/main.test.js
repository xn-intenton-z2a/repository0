// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { hammingDistance, hammingDistanceBits, main, getIdentity, name, version, description } from "../../src/lib/main.js";

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

describe("String Hamming Distance", () => {
  test("acceptance criteria cases", () => {
    expect(hammingDistance("karolin", "kathrin")).toBe(3);
    expect(hammingDistance("", "")).toBe(0);
    expect(() => hammingDistance("a", "bb")).toThrow(RangeError);
  });

  test("normal cases", () => {
    expect(hammingDistance("abc", "abc")).toBe(0);
    expect(hammingDistance("abc", "def")).toBe(3);
    expect(hammingDistance("hello", "world")).toBe(4);
    expect(hammingDistance("1011101", "1001001")).toBe(2);
  });

  test("Unicode support", () => {
    expect(hammingDistance("café", "cave")).toBe(2);
    expect(hammingDistance("🎉🎊", "🎉🌟")).toBe(1);
    expect(hammingDistance("résumé", "resume")).toBe(2);
  });

  test("edge cases", () => {
    expect(hammingDistance("a", "a")).toBe(0);
    expect(hammingDistance("x", "y")).toBe(1);
  });

  test("error cases", () => {
    expect(() => hammingDistance(123, "abc")).toThrow(TypeError);
    expect(() => hammingDistance("abc", 123)).toThrow(TypeError);
    expect(() => hammingDistance(null, "abc")).toThrow(TypeError);
    expect(() => hammingDistance("abc", null)).toThrow(TypeError);
    expect(() => hammingDistance("short", "longer")).toThrow(RangeError);
    expect(() => hammingDistance("longer", "short")).toThrow(RangeError);
  });
});

describe("Bits Hamming Distance", () => {
  test("acceptance criteria cases", () => {
    expect(hammingDistanceBits(1, 4)).toBe(2); // 001 vs 100
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test("normal cases", () => {
    expect(hammingDistanceBits(5, 3)).toBe(2); // 101 vs 011
    expect(hammingDistanceBits(7, 0)).toBe(3); // 111 vs 000
    expect(hammingDistanceBits(15, 15)).toBe(0); // 1111 vs 1111
    expect(hammingDistanceBits(255, 0)).toBe(8); // 11111111 vs 00000000
  });

  test("large numbers", () => {
    expect(hammingDistanceBits(1023, 0)).toBe(10); // 1111111111 vs 0000000000
    expect(hammingDistanceBits(1024, 1)).toBe(2); // 10000000000 vs 00000000001
  });

  test("edge cases", () => {
    expect(hammingDistanceBits(1, 1)).toBe(0);
    expect(hammingDistanceBits(0, 1)).toBe(1);
    expect(hammingDistanceBits(1, 0)).toBe(1);
  });

  test("error cases", () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits(1, 2.5)).toThrow(TypeError);
    expect(() => hammingDistanceBits("1", 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits(1, "2")).toThrow(TypeError);
    expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
    expect(() => hammingDistanceBits(1, -2)).toThrow(RangeError);
    expect(() => hammingDistanceBits(null, 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits(1, null)).toThrow(TypeError);
  });
});
