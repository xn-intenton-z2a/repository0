// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { hammingDistanceString, hammingDistanceInt } from "../../src/lib/main.js";

describe("Hamming distance (strings)", () => {
  test("karolin vs kathrin => 3", () => {
    expect(hammingDistanceString("karolin", "kathrin")).toBe(3);
  });

  test("empty strings => 0", () => {
    expect(hammingDistanceString("", "")).toBe(0);
  });

  test("unequal length strings throws RangeError", () => {
    expect(() => hammingDistanceString("a", "ab")).toThrow(RangeError);
  });

  test("non-string args throw TypeError", () => {
    // @ts-ignore
    expect(() => hammingDistanceString(1, 2)).toThrow(TypeError);
  });

  test("unicode code points compared correctly", () => {
    // emoji are single code points; different emoji should count as differing
    expect(hammingDistanceString('🙂', '😀')).toBe(1);
  });
});

describe("Hamming distance (integers)", () => {
  test("1 vs 4 => 2", () => {
    expect(hammingDistanceInt(1, 4)).toBe(2);
  });

  test("0 vs 0 => 0", () => {
    expect(hammingDistanceInt(0, 0)).toBe(0);
  });

  test("non-integer throws TypeError", () => {
    expect(() => hammingDistanceInt(1.5, 2)).toThrow(TypeError);
  });

  test("negative integer throws RangeError", () => {
    expect(() => hammingDistanceInt(-1, 0)).toThrow(RangeError);
  });

  test("bit counting for a known value", () => {
    // 255 (0xFF) vs 0 => 8 differing bits
    expect(hammingDistanceInt(255, 0)).toBe(8);
  });
});
