// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, getIdentity, name, version, description, stringHamming, intHamming } from "../../src/lib/main.js";

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

describe("stringHamming", () => {
  test("karolin vs kathrin => 3", () => {
    expect(stringHamming("karolin", "kathrin")).toBe(3);
  });

  test('empty strings => 0', () => {
    expect(stringHamming("", "")).toBe(0);
  });

  test('unequal lengths throws RangeError', () => {
    expect(() => stringHamming("a", "ab")).toThrow(RangeError);
  });

  test('non-strings throw TypeError', () => {
    // @ts-ignore
    expect(() => stringHamming(1, "a")).toThrow(TypeError);
  });

  test('unicode code points compared correctly', () => {
    // '𝟘' (MATHEMATICAL SANS-SERIF DIGIT ZERO) is a single code point
    const a = "A𝟘B"; // length in code points 3
    const b = "A0B"; // ASCII zero differs
    expect(stringHamming(a, b)).toBe(1);
  });
});

describe("intHamming", () => {
  test('1 vs 4 => 2', () => {
    expect(intHamming(1, 4)).toBe(2);
  });

  test('0 vs 0 => 0', () => {
    expect(intHamming(0, 0)).toBe(0);
  });

  test('negative ints throw RangeError', () => {
    // @ts-ignore
    expect(() => intHamming(-1, 1)).toThrow(RangeError);
  });

  test('non-integer throws TypeError', () => {
    // @ts-ignore
    expect(() => intHamming(1.5, 2)).toThrow(TypeError);
  });

  test('large integers handled (BigInt)', () => {
    const a = BigInt('0b' + '1'.repeat(80));
    const b = 0n;
    expect(intHamming(a, b)).toBe(80);
  });
});
