// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { parseRange } from "../../src/lib/range-parser.js";

describe("Range Parser", () => {
  test("should parse simple numeric range", () => {
    const result = parseRange("x=-5:5,y=-10:10");
    expect(result.x).toEqual({ min: -5, max: 5 });
    expect(result.y).toEqual({ min: -10, max: 10 });
  });

  test("should parse mathematical expressions in ranges", () => {
    const result = parseRange("x=-2*pi:2*pi");
    expect(result.x.min).toBeCloseTo(-2 * Math.PI);
    expect(result.x.max).toBeCloseTo(2 * Math.PI);
  });

  test("should handle pi notation", () => {
    const result = parseRange("x=-π:π");
    expect(result.x.min).toBeCloseTo(-Math.PI);
    expect(result.x.max).toBeCloseTo(Math.PI);
  });

  test("should add default ranges when missing", () => {
    const result = parseRange("x=-5:5");
    expect(result.x).toEqual({ min: -5, max: 5 });
    expect(result.y).toEqual({ min: -10, max: 10 });
  });

  test("should handle parametric ranges", () => {
    const result = parseRange("t=0:10");
    expect(result.t).toEqual({ min: 0, max: 10 });
  });

  test("should throw error for invalid format", () => {
    expect(() => parseRange("invalid")).toThrow("Invalid range format");
  });

  test("should throw error for min >= max", () => {
    expect(() => parseRange("x=5:5")).toThrow("min (5) must be less than max (5)");
  });

  test("should throw error for empty range string", () => {
    expect(() => parseRange("")).toThrow("Range must be a non-empty string");
  });
});