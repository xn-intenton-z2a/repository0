// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
  });
});

describe("FizzBuzz core", () => {
  test('Given n=5 When calling fizzBuzz Then returns correct sequence', () => {
    expect(fizzBuzz(5)).toEqual(["1", "2", "Fizz", "4", "Buzz"]);
  });

  test('Given n=15 When calling fizzBuzz Then element 15 is FizzBuzz', () => {
    const res = fizzBuzz(15);
    expect(res.length).toBe(15);
    expect(res[14]).toBe("FizzBuzz");
  });

  test('Given single inputs When calling fizzBuzzSingle Then returns expected values', () => {
    expect(fizzBuzzSingle(1)).toBe("1");
    expect(fizzBuzzSingle(2)).toBe("2");
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(30)).toBe("FizzBuzz");
  });

  test('Given n=0 When calling fizzBuzz Then returns empty array', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test('Given negative n When calling fizzBuzz Then returns empty array', () => {
    expect(fizzBuzz(-5)).toEqual([]);
  });

  test('Given non-integer numeric inputs Then functions throw TypeError', () => {
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
  });

  test('Given non-number inputs Then functions throw TypeError', () => {
    // null, undefined, string, NaN, object
    expect(() => fizzBuzz(null)).toThrow(TypeError);
    expect(() => fizzBuzz(undefined)).toThrow(TypeError);
    expect(() => fizzBuzz('20')).toThrow(TypeError);
    expect(() => fizzBuzz(NaN)).toThrow(TypeError);
    expect(() => fizzBuzz({})).toThrow(TypeError);

    expect(() => fizzBuzzSingle(null)).toThrow(TypeError);
    expect(() => fizzBuzzSingle('3')).toThrow(TypeError);
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
  });

  test('Boundary values: 100 produces length 100 and expected sample', () => {
    const arr = fizzBuzz(100);
    expect(arr.length).toBe(100);
    // sample checks
    expect(arr[2]).toBe("Fizz"); // 3
    expect(arr[4]).toBe("Buzz"); //5
    expect(arr[14]).toBe("FizzBuzz"); //15
  });
});
