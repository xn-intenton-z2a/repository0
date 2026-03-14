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

describe('FizzBuzz core', () => {
  test('fizzBuzz(1) returns ["1"]', () => {
    expect(fizzBuzz(1)).toEqual(["1"]);
  });

  test('fizzBuzz(3) returns correct values', () => {
    expect(fizzBuzz(3)).toEqual(["1","2","Fizz"]);
  });

  test('fizzBuzz(5) returns correct values', () => {
    expect(fizzBuzz(5)).toEqual(["1","2","Fizz","4","Buzz"]);
  });

  test('fizzBuzz(15) ends with FizzBuzz', () => {
    const res = fizzBuzz(15);
    expect(res.length).toBe(15);
    expect(res[14]).toBe('FizzBuzz');
  });

  test('fizzBuzz sample 20', () => {
    const expected = ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz","16","17","Fizz","19","Buzz"];
    expect(fizzBuzz(20)).toEqual(expected);
  });

  test('fizzBuzz(0) returns []', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test('fizzBuzzSingle cases', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  test('invalid types throw TypeError', () => {
    expect(() => fizzBuzz('a')).toThrow(TypeError);
    expect(() => fizzBuzz(NaN)).toThrow(TypeError);
    expect(() => fizzBuzz(Infinity)).toThrow(TypeError);
    expect(() => fizzBuzz(1.5)).toThrow(TypeError);
  });

  test('range errors for negatives and too large', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzz(10001)).toThrow(RangeError);
  });

  test('edge case: fizzBuzzSingle non-integer and negative', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-3)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(2.2)).toThrow(TypeError);
  });
});
