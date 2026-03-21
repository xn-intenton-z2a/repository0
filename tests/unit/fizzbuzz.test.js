// SPDX-License-Identifier: MIT
// Tests for fizzBuzz library
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("fizzBuzzSingle", () => {
  test("returns Fizz for multiples of 3", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
  });

  test("returns Buzz for multiples of 5", () => {
    expect(fizzBuzzSingle(5)).toBe("Buzz");
  });

  test("returns FizzBuzz for multiples of 15", () => {
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
  });

  test("returns number as string for non-multiples", () => {
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("throws RangeError for negative numbers", () => {
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
  });

  test("throws TypeError for non-integers", () => {
    expect(() => fizzBuzzSingle(3.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle("3")).toThrow(TypeError);
  });
});

describe("fizzBuzz", () => {
  test("returns empty array for n=0", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("returns correct sequence for n=15", () => {
    const out = fizzBuzz(15);
    expect(out.length).toBe(15);
    expect(out[14]).toBe("FizzBuzz");
    // quick spot checks
    expect(out[0]).toBe("1");
    expect(out[2]).toBe("Fizz");
    expect(out[4]).toBe("Buzz");
  });

  test("throws RangeError for negative n", () => {
    expect(() => fizzBuzz(-5)).toThrow(RangeError);
  });

  test("throws TypeError for non-integer n", () => {
    expect(() => fizzBuzz(2.2)).toThrow(TypeError);
  });
});
