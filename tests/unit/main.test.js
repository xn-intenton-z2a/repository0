// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { 
  main, 
  ExpressionParser, 
  RangeParser, 
  TimeSeriesGenerator,
  SVGPlotter 
} from "../../src/lib/main.js";

describe("ExpressionParser", () => {
  test("should parse simple expression", () => {
    const parser = new ExpressionParser();
    const result = parser.parse("sin(x)");
    
    expect(result.variable).toBe('x');
    expect(result.formula).toBe('sin(x)');
    expect(result.compiled).toBeDefined();
  });

  test("should parse expression with variable assignment", () => {
    const parser = new ExpressionParser();
    const result = parser.parse("y=cos(x)");
    
    expect(result.variable).toBe('y');
    expect(result.formula).toBe('cos(x)');
  });

  test("should evaluate expression correctly", () => {
    const parser = new ExpressionParser();
    const expr = parser.parse("x^2");
    const result = parser.evaluate(expr, 3);
    
    expect(result).toBe(9);
  });

  test("should throw error for invalid expression", () => {
    const parser = new ExpressionParser();
    
    expect(() => parser.parse("invalid(")).toThrow();
  });
});

describe("RangeParser", () => {
  test("should parse simple range", () => {
    const parser = new RangeParser();
    const result = parser.parse("-1:1");
    
    expect(result.x.min).toBe(-1);
    expect(result.x.max).toBe(1);
  });

  test("should parse complex range", () => {
    const parser = new RangeParser();
    const result = parser.parse("x=-2:2,y=-5:5");
    
    expect(result.x.min).toBe(-2);
    expect(result.x.max).toBe(2);
    expect(result.y.min).toBe(-5);
    expect(result.y.max).toBe(5);
  });

  test("should use default range when empty", () => {
    const parser = new RangeParser();
    const result = parser.parse("");
    
    expect(result.x.min).toBe(-10);
    expect(result.x.max).toBe(10);
  });

  test("should throw error for invalid range", () => {
    const parser = new RangeParser();
    
    expect(() => parser.parse("1:-1")).toThrow();
  });
});

describe("TimeSeriesGenerator", () => {
  test("should generate time series data", () => {
    const parser = new ExpressionParser();
    const rangeParser = new RangeParser();
    const generator = new TimeSeriesGenerator();
    
    const expr = parser.parse("x");
    const ranges = rangeParser.parse("x=0:1");
    const data = generator.generate(expr, ranges, 3);
    
    expect(data).toHaveLength(3);
    expect(data[0]).toEqual({ x: 0, y: 0 });
    expect(data[1]).toEqual({ x: 0.5, y: 0.5 });
    expect(data[2]).toEqual({ x: 1, y: 1 });
  });
});

describe("SVGPlotter", () => {
  test("should generate SVG plot", () => {
    const plotter = new SVGPlotter();
    const data = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 4 }
    ];
    const ranges = { x: { min: 0, max: 2 }, y: { min: 0, max: 4 } };
    
    const svg = plotter.plot(data, ranges);
    
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('path');
  });
});

describe("Main CLI", () => {
  test("should load without error", () => {
    // Test that main function exists and is callable
    expect(typeof main).toBe('function');
  });
});
