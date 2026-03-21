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

describe('FizzBuzz functions', () => {
  test('fizzBuzzSingle normal cases', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  test('fizzBuzz normal array', () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz',
      '11','Fizz','13','14','FizzBuzz'
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  test('fizzBuzz(0) -> []', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test('edge cases: negative -> RangeError', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-5)).toThrow(RangeError);
  });

  test('edge cases: non-integer -> TypeError', () => {
    expect(() => fizzBuzz(2.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(3.14)).toThrow(TypeError);
  });

  test('edge cases: non-number -> TypeError', () => {
    // @ts-ignore
    expect(() => fizzBuzz('10')).toThrow(TypeError);
    // @ts-ignore
    expect(() => fizzBuzzSingle(null)).toThrow(TypeError);
  });
});
