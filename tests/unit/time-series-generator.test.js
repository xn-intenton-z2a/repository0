// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { TimeSeriesGenerator, ExpressionParser } from "../../src/lib/main.js";

const isNode = typeof process !== "undefined" && !!process.versions?.node;

describe("Time Series Generator", () => {
  test.skipIf(!isNode)("should generate coordinate data from range", () => {
    const generator = new TimeSeriesGenerator();
    const parser = new ExpressionParser();
    const func = parser.parse("y=x^2");
    
    const range = { x: { min: -1, max: 1, step: 0.5 } };
    const data = generator.generate(func, range);
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('x');
    expect(data[0]).toHaveProperty('y');
  });

  test("should parse range specifications", () => {
    const generator = new TimeSeriesGenerator();
    const range = generator.parseRange("x=-1:1,step=0.1");
    
    expect(range.x.min).toBe(-1);
    expect(range.x.max).toBe(1);
    expect(range.x.step).toBe(0.1);
  });

  test("should support mathematical constants", () => {
    const generator = new TimeSeriesGenerator();
    const range = generator.parseRange("x=-pi:pi");
    
    expect(range.x.min).toBeCloseTo(-Math.PI);
    expect(range.x.max).toBeCloseTo(Math.PI);
  });

  test("should export data in JSON format", () => {
    const generator = new TimeSeriesGenerator();
    const data = [{ x: 1, y: 2 }, { x: 2, y: 4 }];
    const json = generator.exportJSON(data);
    
    expect(typeof json).toBe("string");
    expect(JSON.parse(json)).toEqual(data);
  });

  test("should export data in CSV format", () => {
    const generator = new TimeSeriesGenerator();
    const data = [{ x: 1, y: 2 }, { x: 2, y: 4 }];
    const csv = generator.exportCSV(data);
    
    expect(typeof csv).toBe("string");
    expect(csv).toContain("x,y");
    expect(csv).toContain("1,2");
    expect(csv).toContain("2,4");
  });

  test.skipIf(!isNode)("should handle discontinuous functions gracefully", () => {
    const generator = new TimeSeriesGenerator();
    const parser = new ExpressionParser();
    const func = parser.parse("y=1/x"); // Division by zero at x=0
    
    const range = { x: { min: -1, max: 1, step: 0.5 } };
    const data = generator.generate(func, range);
    
    // Should skip invalid points
    expect(data.every(point => isFinite(point.y))).toBe(true);
  });

  test("should use default step size when not specified", () => {
    const generator = new TimeSeriesGenerator();
    const range = generator.parseRange("x=-1:1");
    
    expect(range.x.step).toBe(0.1);
  });
});