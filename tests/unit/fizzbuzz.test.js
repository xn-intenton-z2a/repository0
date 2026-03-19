// SPDX-License-Identifier: MIT
// tests/unit/fizzbuzz.test.js
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("Dedicated FizzBuzz unit tests", () => {
  test("standard fizzBuzzSingle cases", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("fizzBuzz(15) returns the correct 15-element array ending with FizzBuzz", () => {
    const out = fizzBuzz(15);
    expect(Array.isArray(out)).toBe(true);
    expect(out).toHaveLength(15);
    expect(out[14]).toBe("FizzBuzz");
  });

  test("fizzBuzz(0) returns empty array", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("non-integer inputs throw TypeError", () => {
    expect(() => fizzBuzz(2.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
    expect(() => fizzBuzz("3")).toThrow(TypeError);
  });

  test("negative inputs throw RangeError where applicable", () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    // fizzBuzzSingle expects positive integers (0 is invalid)
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-5)).toThrow(RangeError);
  });
});
