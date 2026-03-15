// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { main, getIdentity, name, version, description, fizzbuzzNumber, fizzbuzzRange } from "../../src/lib/main.js";

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

// FizzBuzz tests as required by mission

describe('FizzBuzz numeric API', () => {
  test('fizzbuzzNumber normal cases', () => {
    expect(fizzbuzzNumber(1)).toBe('1');
    expect(fizzbuzzNumber(3)).toBe('Fizz');
    expect(fizzbuzzNumber(5)).toBe('Buzz');
    expect(fizzbuzzNumber(15)).toBe('FizzBuzz');
  });

  test('fizzbuzzNumber negative inputs throw', () => {
    expect(() => fizzbuzzNumber(-3)).toThrow(RangeError);
  });

  test('fizzbuzzNumber invalid throws', () => {
    expect(() => fizzbuzzNumber(2.5)).toThrow(TypeError);
    expect(() => fizzbuzzNumber(2.5)).toThrow('n must be an integer');
  });

  test('fizzbuzzRange ranges and errors', () => {
    expect(fizzbuzzRange(1,5)).toEqual(['1','2','Fizz','4','Buzz']);
    expect(fizzbuzzRange(5,5)).toEqual(['Buzz']);
    expect(() => fizzbuzzRange(2,1)).toThrow(RangeError);
    expect(() => fizzbuzzRange(2,1)).toThrow('start must be <= end');
    expect(() => fizzbuzzRange(1.5,5)).toThrow(TypeError);
    expect(() => fizzbuzzRange(1.5,5)).toThrow('start and end must be integers');
  });
});
