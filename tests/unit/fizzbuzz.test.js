// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("FizzBuzz Core", () => {
  test("fizzBuzz(15) returns correct 15-element array ending with FizzBuzz", () => {
    const out = fizzBuzz(15);
    expect(Array.isArray(out)).toBe(true);
    expect(out.length).toBe(15);
    expect(out[0]).toBe("1");
    expect(out[2]).toBe("Fizz");
    expect(out[4]).toBe("Buzz");
    expect(out[14]).toBe("FizzBuzz");
  });

  test("fizzBuzzSingle(3) -> Fizz, (5) -> Buzz, (15) -> FizzBuzz, (7) -> '7'", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("fizzBuzz(0) returns []", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("fizzBuzz negative throws RangeError", () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });

  test("fizzBuzz non-integer throws TypeError", () => {
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
  });

  test("fizzBuzzSingle non-integer or non-number throws TypeError and non-positive throws RangeError", () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-3)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(2.2)).toThrow(TypeError);
    expect(() => fizzBuzzSingle("3")).toThrow(TypeError);
  });
});
