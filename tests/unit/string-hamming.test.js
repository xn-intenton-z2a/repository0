// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { hammingDistanceStrings } from "../../src/lib/main.js";

describe("String Hamming Distance", () => {
  test("karolin vs kathrin is 3", () => {
    expect(hammingDistanceStrings("karolin", "kathrin")).toBe(3);
  });

  test("empty strings return 0", () => {
    expect(hammingDistanceStrings("", "")).toBe(0);
  });

  test("different length strings throw RangeError", () => {
    expect(() => hammingDistanceStrings("a", "ab")).toThrow(RangeError);
  });

  test("non-string arguments throw TypeError", () => {
    // @ts-ignore
    expect(() => hammingDistanceStrings(null, "a")).toThrow(TypeError);
  });
});
