// SPDX-License-Identifier: MIT
// Tests for FizzBuzz functions
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("FizzBuzz", () => {
  test("fizzBuzzSingle returns expected values", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("fizzBuzz(0) returns empty array", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("fizzBuzz(15) returns expected 15-element array", () => {
    const expected = [
      "1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  test("negative inputs throw RangeError", () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-3)).toThrow(RangeError);
  });

  test("non-integer inputs throw TypeError", () => {
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle("3")).toThrow(TypeError);
  });
});
