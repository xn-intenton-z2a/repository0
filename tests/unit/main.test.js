// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, ExpressionParser, TimeSeriesGenerator, PlotGenerator } from "../../src/lib/main.js";

describe("ExpressionParser", () => {
  test("should parse and evaluate simple expressions", () => {
    const parser = new ExpressionParser();
    const func = parser.parse("x^2 + 2*x + 1");
    expect(func({ x: 1 })).toBe(4);
    expect(func({ x: 2 })).toBe(9);
  });

  test("should parse and evaluate trigonometric functions", () => {
    const parser = new ExpressionParser();
    const sinFunc = parser.parse("sin(x)");
    expect(sinFunc({ x: 0 })).toBe(0);
    expect(sinFunc({ x: Math.PI / 2 })).toBeCloseTo(1, 10);
  });

  test("should cache compiled expressions", () => {
    const parser = new ExpressionParser();
    const func1 = parser.parse("x^2");
    const func2 = parser.parse("x^2");
    expect(func1).toBe(func2); // Same reference due to caching
  });

  test("should throw error for invalid expressions", () => {
    const parser = new ExpressionParser();
    expect(() => parser.parse("invalid_expression(")).toThrow();
  });
});

describe("TimeSeriesGenerator", () => {
  test("should generate GeoJSON data from expression and range", () => {
    const parser = new ExpressionParser();
    const generator = new TimeSeriesGenerator(parser);
    
    const result = generator.generate("x^2", "x=-1:1:0.5");
    
    expect(result.type).toBe("Feature");
    expect(result.geometry.type).toBe("LineString");
    expect(result.geometry.coordinates).toHaveLength(5); // -1, -0.5, 0, 0.5, 1
    expect(result.geometry.coordinates[0]).toEqual([-1, 1]);
    expect(result.geometry.coordinates[2]).toEqual([0, 0]);
    expect(result.properties.expression).toBe("x^2");
  });

  test("should parse range specifications correctly", () => {
    const parser = new ExpressionParser();
    const generator = new TimeSeriesGenerator(parser);
    
    // Test with explicit step
    let range = generator.parseRange("x=-1:1:0.5");
    expect(range).toEqual({ variable: "x", start: -1, end: 1, step: 0.5 });
    
    // Test without step (should default to 100 points)
    range = generator.parseRange("t=0:10");
    expect(range).toEqual({ variable: "t", start: 0, end: 10, step: 0.1 });
  });

  test("should handle mathematical expressions in range", () => {
    const parser = new ExpressionParser();
    const generator = new TimeSeriesGenerator(parser);
    
    const range = generator.parseRange("x=0:2*pi:pi/4");
    expect(range.variable).toBe("x");
    expect(range.start).toBe(0);
    expect(range.end).toBeCloseTo(2 * Math.PI, 10);
    expect(range.step).toBeCloseTo(Math.PI / 4, 10);
  });

  test("should throw error for invalid range format", () => {
    const parser = new ExpressionParser();
    const generator = new TimeSeriesGenerator(parser);
    
    expect(() => generator.parseRange("invalid_range")).toThrow("Invalid range format");
  });

  test("should skip invalid data points", () => {
    const parser = new ExpressionParser();
    const generator = new TimeSeriesGenerator(parser);
    
    // Expression that produces NaN for some values
    const result = generator.generate("sqrt(x)", "x=-1:1:0.5");
    
    expect(result.geometry.coordinates.length).toBeLessThan(5); // Some points skipped
    // All remaining points should be valid numbers
    result.geometry.coordinates.forEach(([x, y]) => {
      expect(typeof x).toBe("number");
      expect(typeof y).toBe("number");
      expect(isFinite(x)).toBe(true);
      expect(isFinite(y)).toBe(true);
    });
  });
});

describe("PlotGenerator", () => {
  test("should extract coordinates from GeoJSON feature", () => {
    const plotter = new PlotGenerator();
    const geoJson = {
      type: "Feature",
      geometry: {
        type: "LineString", 
        coordinates: [[0, 0], [1, 1], [2, 4]]
      }
    };
    
    const coords = plotter.extractCoordinates(geoJson);
    expect(coords).toEqual([[0, 0], [1, 1], [2, 4]]);
  });

  test("should generate SVG markup", () => {
    const plotter = new PlotGenerator();
    const geoJson = {
      type: "Feature",
      properties: { expression: "x^2" },
      geometry: {
        type: "LineString",
        coordinates: [[0, 0], [1, 1], [2, 4]]
      }
    };
    
    const svg = plotter.generateSVG(geoJson, "Test Plot");
    
    expect(svg).toContain('<svg');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('Test Plot');
    expect(svg).toContain('x^2'); // Expression should be in the plot
    expect(svg).toContain('<path'); // Should contain the line path
  });

  test("should throw error for invalid GeoJSON", () => {
    const plotter = new PlotGenerator();
    const invalidGeoJson = { type: "Point", coordinates: [0, 0] };
    
    expect(() => plotter.extractCoordinates(invalidGeoJson)).toThrow("Invalid GeoJSON format");
  });

  test("should throw error for empty coordinates", () => {
    const plotter = new PlotGenerator();
    const geoJson = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: []
      }
    };
    
    expect(() => plotter.generateSVG(geoJson)).toThrow("No coordinate data found");
  });
});

describe("Main CLI function", () => {
  test("should accept arguments without error", () => {
    expect(() => main([])).not.toThrow();
  });
});
