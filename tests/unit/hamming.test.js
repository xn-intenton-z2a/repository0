// SPDX-License-Identifier: MIT
// tests for Hamming distance functions
import { describe, test, expect } from "vitest";
import { hammingDistance, hammingDistanceBits } from "../../src/lib/main.js";

describe("hammingDistance (strings)", () => {
  test("basic example: karolin vs kathrin -> 3", () => {
    expect(hammingDistance("karolin", "kathrin")).toBe(3);
  });

  test("empty strings -> 0", () => {
    expect(hammingDistance("", "")).toBe(0);
  });

  test("unequal length throws RangeError", () => {
    expect(() => hammingDistance("a", "bb")).toThrow(RangeError);
  });

  test("handles Unicode code points correctly", () => {
    // emoji are single code points but multiple UTF-16 code units
    expect(hammingDistance("👍👍", "👍👎")).toBe(1);
    // surrogate pair character
    expect(hammingDistance("a𠮷", "a𠮸")).toBe(1);
  });

  test("invalid types throw TypeError", () => {
    expect(() => hammingDistance(123, "abc")).toThrow(TypeError);
    expect(() => hammingDistance("a", null)).toThrow(TypeError);
  });
});

describe("hammingDistanceBits (integers)", () => {
  test("1 vs 4 -> 2", () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  test("0 vs 0 -> 0", () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test("accepts BigInt and works", () => {
    expect(hammingDistanceBits(1n, 4n)).toBe(2);
  });

  test("negative integers throw RangeError", () => {
    expect(() => hammingDistanceBits(-1, 1)).toThrow(RangeError);
    expect(() => hammingDistanceBits(1, -2)).toThrow(RangeError);
  });

  test("non-integer numbers throw TypeError", () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });

  test("non-number types throw TypeError", () => {
    expect(() => hammingDistanceBits("1", 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits(null, null)).toThrow(TypeError);
  });
});
