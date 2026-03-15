// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("fizzBuzzSingle", () => {
  test("returns 'Fizz' for multiples of 3", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(6)).toBe("Fizz");
  });

  test("returns 'Buzz' for multiples of 5", () => {
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(10)).toBe("Buzz");
  });

  test("returns 'FizzBuzz' for multiples of 3 and 5", () => {
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(30)).toBe("FizzBuzz");
  });

  test("returns number as string when not divisible", () => {
    expect(fizzBuzzSingle(7)).toBe("7");
    expect(fizzBuzzSingle(1)).toBe("1");
  });

  test("throws RangeError for non-positive integers", () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-3)).toThrow(RangeError);
  });

  test("throws TypeError for non-integers", () => {
    expect(() => fizzBuzzSingle(1.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle("3")).toThrow(TypeError);
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
  });
});

describe("fizzBuzz", () => {
  test("returns empty array for n=0", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("returns expected 1..15 fizzbuzz array", () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  test("throws RangeError for negative n", () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });

  test("throws TypeError for non-integer n", () => {
    expect(() => fizzBuzz(2.5)).toThrow(TypeError);
    expect(() => fizzBuzz("10")).toThrow(TypeError);
  });
});
