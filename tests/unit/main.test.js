// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, getIdentity, name, version, description, fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

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

describe("FizzBuzz", () => {
  test("fizzBuzzSingle returns Fizz/Buzz/FizzBuzz/number strings", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("fizzBuzz returns array up to n and fizzBuzz(15) ends with FizzBuzz", () => {
    const arr = fizzBuzz(15);
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBe(15);
    expect(arr[14]).toBe("FizzBuzz");
  });

  test("edge cases: zero returns empty array for fizzBuzz and '0' for fizzBuzzSingle", () => {
    expect(fizzBuzz(0)).toEqual([]);
    expect(fizzBuzzSingle(0)).toBe("0");
  });

  test("edge cases: negative throws RangeError", () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-5)).toThrow(RangeError);
  });

  test("edge cases: non-integer throws TypeError", () => {
    expect(() => fizzBuzz(2.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
  });
});
