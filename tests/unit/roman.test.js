// SPDX-License-Identifier: MIT
// Unit tests for Roman numeral conversion
import { describe, test, expect } from "vitest";
import { intToRoman, romanToInt } from "../../src/lib/main.js";

describe("Roman conversion basics", () => {
  test("1994 -> MCMXCIV", () => {
    expect(intToRoman(1994)).toBe("MCMXCIV");
  });

  test("MCMXCIV -> 1994", () => {
    expect(romanToInt("MCMXCIV")).toBe(1994);
  });

  test("4 -> IV", () => {
    expect(intToRoman(4)).toBe("IV");
  });

  test("subtractive cases", () => {
    expect(intToRoman(9)).toBe("IX");
    expect(intToRoman(40)).toBe("XL");
    expect(intToRoman(90)).toBe("XC");
    expect(intToRoman(400)).toBe("CD");
    expect(intToRoman(900)).toBe("CM");
  });

  test("out of range throws RangeError", () => {
    expect(() => intToRoman(0)).toThrow(RangeError);
    expect(() => intToRoman(4000)).toThrow(RangeError);
  });

  test("invalid Roman throws TypeError", () => {
    expect(() => romanToInt("IIII")).toThrow(TypeError);
    expect(() => romanToInt("VX")).toThrow(TypeError);
    expect(() => romanToInt("IC")).toThrow(TypeError);
  });

  test("round-trip holds for 1..3999", () => {
    for (let i = 1; i <= 3999; i++) {
      const r = intToRoman(i);
      const back = romanToInt(r);
      expect(back).toBe(i);
    }
  });
});
