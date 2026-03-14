// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, getIdentity, name, version, description, hammingString, hammingBits } from "../../src/lib/main.js";

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

describe("hammingString", () => {
  test("karolin vs kathrin -> 3", () => {
    expect(hammingString('karolin','kathrin')).toBe(3);
  });

  test("empty strings -> 0", () => {
    expect(hammingString('','')).toBe(0);
  });

  test("different lengths throws RangeError", () => {
    expect(() => hammingString('a','ab')).toThrow(RangeError);
  });

  test("non-strings throw TypeError", () => {
    // @ts-ignore
    expect(() => hammingString(1,2)).toThrow(TypeError);
  });
});

describe("hammingBits", () => {
  test("1 vs 4 -> 2", () => {
    expect(hammingBits(1,4)).toBe(2);
  });

  test("0 vs 0 -> 0", () => {
    expect(hammingBits(0,0)).toBe(0);
  });

  test("non-integer throws TypeError", () => {
    // 1.5 is not integer
    expect(() => hammingBits(1.5, 2)).toThrow(TypeError);
  });

  test("negative throws RangeError", () => {
    expect(() => hammingBits(-1, 0)).toThrow(RangeError);
  });

  test("big integers work", () => {
    expect(hammingBits(12345678901234567890n, 12345678901234567890n)).toBe(0);
  });
});
