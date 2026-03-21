// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("FizzBuzz core", () => {
  test("fizzBuzz(15) returns expected 15-item sequence ending with FizzBuzz", () => {
    const expected = [
      "1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz",
      "11","Fizz","13","14","FizzBuzz"
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  test("fizzBuzzSingle returns correct tokens", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("fizzBuzz(0) returns empty array", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("non-integer inputs throw TypeError", () => {
    expect(() => fizzBuzzSingle(3.5)).toThrow(TypeError);
    expect(() => fizzBuzz(2.2)).toThrow(TypeError);
    expect(() => fizzBuzzSingle("3")).toThrow(TypeError);
  });

  test("negative inputs throw RangeError", () => {
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
    expect(() => fizzBuzz(-5)).toThrow(RangeError);
  });
});
