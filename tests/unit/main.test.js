// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, getIdentity, name, version, description, fizzBuzz, fizzBuzzSingle, fizzBuzzSequence } from "../../src/lib/main.js";

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

// Additional FizzBuzz tests
describe('FizzBuzz API', ()=>{
  test('fizzBuzzSingle behaviors', ()=>{
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
    expect(fizzBuzzSingle(0)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(-3)).toBe('Fizz');
  });

  test('fizzBuzz sequences', ()=>{
    expect(fizzBuzz(0)).toEqual([]);
    expect(fizzBuzz(5)).toEqual(['1','2','Fizz','4','Buzz']);
    expect(fizzBuzz(-3)).toEqual(['Fizz','-2','-1']);
  });

  test('fizzBuzzSequence ranges', ()=>{
    expect(fizzBuzzSequence(-5,-1)).toEqual(['Buzz','-4','Fizz','-2','-1']);
  });
});
