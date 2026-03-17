// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { hammingDistanceStrings } from "../../src/lib/main.js";

describe("Unicode handling", () => {
  test("handles astral code points (emoji) correctly", () => {
    const a = 'a\u{1F600}b'; // a + grinning face + b
    const b = 'a\u{1F601}b'; // a + beaming face + b
    // Only the emoji differs -> distance 1
    expect(hammingDistanceStrings(a, b)).toBe(1);
  });

  test("surrogate pairs counted as single code points", () => {
    const smile = '\u{1F600}';
    expect(Array.from(smile).length).toBe(1);
  });
});
