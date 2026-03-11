// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, getIdentity, name, version, description, hammingDistance, hammingDistanceBits } from "../../src/lib/main.js";

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

// Hamming-specific tests
describe('hammingDistance (strings)', () => {
  test('computes known example', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  test('handles empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  test('throws for unequal length (code points)', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  test('compares Unicode code points (emoji)', () => {
    expect(hammingDistance('👍', '👎')).toBe(1);
  });
});

describe('hammingDistanceBits (integers)', () => {
  test('computes known example', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  test('handles zeros', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test('accepts BigInt and large values', () => {
    const a = 0n;
    const b = 1n;
    expect(hammingDistanceBits(a, b)).toBe(1);
  });

  test('throws TypeError for non-integer numbers', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });

  test('throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 0)).toThrow(RangeError);
  });
});
