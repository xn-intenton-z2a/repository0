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
  test("fizzBuzzSingle(3) returns 'Fizz'", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
  });

  test("fizzBuzzSingle(5) returns 'Buzz'", () => {
    expect(fizzBuzzSingle(5)).toBe("Buzz");
  });

  test("fizzBuzzSingle(15) returns 'FizzBuzz'", () => {
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
  });

  test("fizzBuzzSingle(7) returns '7'", () => {
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("fizzBuzz(15) returns correct 15-element array ending with 'FizzBuzz'", () => {
    const expected = [
      "1","2","Fizz","4","Buzz",
      "Fizz","7","8","Fizz","Buzz",
      "11","Fizz","13","14","FizzBuzz"
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  test("fizzBuzz(0) returns empty array", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("negative inputs throw RangeError", () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-5)).toThrow(RangeError);
  });

  test("non-integers throw TypeError", () => {
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(3.5)).toThrow(TypeError);
    expect(() => fizzBuzz("5")).toThrow(TypeError);
    expect(() => fizzBuzzSingle("5")).toThrow(TypeError);
  });
});
