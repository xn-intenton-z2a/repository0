// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, getIdentity, name, version, description, computeHamming } from "../../src/lib/main.js";

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

describe("computeHamming", () => {
  test("karolin vs kathrin => 3", () => {
    expect(computeHamming('karolin', 'kathrin')).toBe(3);
  });

  test("binary strings", () => {
    expect(computeHamming('1011101','1001001')).toBe(2);
  });

  test("empty strings => 0", () => {
    expect(computeHamming('', '')).toBe(0);
  });

  test("single char identical => 0", () => {
    expect(computeHamming('a', 'a')).toBe(0);
  });

  test("single char different => 1", () => {
    expect(computeHamming('a', 'b')).toBe(1);
  });

  test('emoji family differences: 👩‍👩‍👧 vs 👩‍👩‍👦 => 1', () => {
    expect(computeHamming('👩‍👩‍👧', '👩‍👩‍👦')).toBe(1);
  });

  test('non-string inputs throw TypeError with exact message', () => {
    expect(() => computeHamming(42, 'a')).toThrow(TypeError);
    expect(() => computeHamming(42, 'a')).toThrow('Inputs must be strings');
    expect(() => computeHamming(null, null)).toThrow(TypeError);
  });

  test('different length inputs throw RangeError with exact message', () => {
    expect(() => computeHamming('a', '')).toThrow(RangeError);
    expect(() => computeHamming('abc', 'ab')).toThrow('Inputs must have same length');
  });
});
