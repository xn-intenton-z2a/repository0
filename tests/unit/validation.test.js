// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { hammingDistanceStrings, hammingDistanceBits } from "../../src/lib/main.js";

describe("Validation errors", () => {
  test("string function throws TypeError for non-strings", () => {
    // @ts-ignore
    expect(() => hammingDistanceStrings(1, 2)).toThrow(TypeError);
  });

  test("bit function throws TypeError for non-integers", () => {
    // @ts-ignore
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });
});
