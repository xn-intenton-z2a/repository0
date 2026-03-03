// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { writeFileSync } from "fs";
import { ExpressionParser, TimeSeriesGenerator, PlotGenerator, PlotCodeLib } from "../../src/lib/main.js";

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

  test("should parse multiple expressions from comma-separated string", () => {
    const parser = new ExpressionParser();
    const results = parser.parseMultiple("sin(x),cos(x),x^2");
    
    expect(results).toHaveLength(3);
    expect(results[0].expression).toBe("sin(x)");
    expect(results[0].label).toBe("sin(x)");
    expect(results[1].expression).toBe("cos(x)");
    expect(results[1].label).toBe("cos(x)");
    expect(results[2].expression).toBe("x^2");
    expect(results[2].label).toBe("x^2");
    
    // Test functions work
    expect(results[0].func({ x: 0 })).toBe(0);
    expect(results[1].func({ x: 0 })).toBe(1);
    expect(results[2].func({ x: 2 })).toBe(4);
  });

  test("should support expression aliasing with label:expression syntax", () => {
    const parser = new ExpressionParser();
    const results = parser.parseMultiple("Sine:sin(x),Square:x^2");
    
    expect(results).toHaveLength(2);
    expect(results[0].expression).toBe("sin(x)");
    expect(results[0].label).toBe("Sine");
    expect(results[1].expression).toBe("x^2");
    expect(results[1].label).toBe("Square");
  });

  test("should handle single expression in parseMultiple", () => {
    const parser = new ExpressionParser();
    const results = parser.parseMultiple("sin(x)");
    
    expect(results).toHaveLength(1);
    expect(results[0].expression).toBe("sin(x)");
    expect(results[0].label).toBe("sin(x)");
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

  test("should generate FeatureCollection from multiple expressions", () => {
    const parser = new ExpressionParser();
    const generator = new TimeSeriesGenerator(parser);
    
    const result = generator.generateMultiple("sin(x),cos(x)", "x=0:pi:pi/4");
    
    expect(result.type).toBe("FeatureCollection");
    expect(result.features).toHaveLength(2);
    
    expect(result.features[0].properties.expression).toBe("sin(x)");
    expect(result.features[0].properties.label).toBe("sin(x)");
    expect(result.features[0].properties.color).toBe("#1f77b4");
    
    expect(result.features[1].properties.expression).toBe("cos(x)");
    expect(result.features[1].properties.label).toBe("cos(x)");
    expect(result.features[1].properties.color).toBe("#ff7f0e");
  });

  test("should handle expression aliasing in generateMultiple", () => {
    const parser = new ExpressionParser();
    const generator = new TimeSeriesGenerator(parser);
    
    const result = generator.generateMultiple("Sine Wave:sin(x),Cosine Wave:cos(x)", "x=0:pi:pi/2");
    
    expect(result.type).toBe("FeatureCollection");
    expect(result.features).toHaveLength(2);
    
    expect(result.features[0].properties.expression).toBe("sin(x)");
    expect(result.features[0].properties.label).toBe("Sine Wave");
    
    expect(result.features[1].properties.expression).toBe("cos(x)");
    expect(result.features[1].properties.label).toBe("Cosine Wave");
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

  test("should generate parametric curves", () => {
    const parser = new ExpressionParser();
    const generator = new TimeSeriesGenerator(parser);
    
    const result = generator.generateParametric("cos(t)", "sin(t)", "t=0:2*pi:pi/2");
    
    expect(result.type).toBe("Feature");
    expect(result.geometry.type).toBe("LineString");
    expect(result.properties.mode).toBe("parametric");
    expect(result.properties.xExpression).toBe("cos(t)");
    expect(result.properties.yExpression).toBe("sin(t)");
    
    // Should approximate a circle
    expect(result.geometry.coordinates).toHaveLength(5); // 0, pi/2, pi, 3pi/2, 2pi
    expect(result.geometry.coordinates[0][0]).toBeCloseTo(1, 10); // cos(0) = 1
    expect(result.geometry.coordinates[0][1]).toBeCloseTo(0, 10); // sin(0) = 0
  });
});

describe("PlotGenerator", () => {
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
    
    const svg = plotter.generateSVG(geoJson, { title: "Test Plot" });
    
    expect(svg).toContain('<svg');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('Test Plot');
    expect(svg).toContain('<path'); // Should contain the line path
  });

  test("should generate SVG with legend for multi-expression plots", () => {
    const plotter = new PlotGenerator();
    const geoJson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { expression: "sin(x)", label: "sin(x)", color: "#1f77b4" },
          geometry: {
            type: "LineString",
            coordinates: [[0, 0], [1, 0.84], [2, 0.91]]
          }
        },
        {
          type: "Feature",
          properties: { expression: "cos(x)", label: "cos(x)", color: "#ff7f0e" },
          geometry: {
            type: "LineString",
            coordinates: [[0, 1], [1, 0.54], [2, -0.42]]
          }
        }
      ]
    };
    
    const svg = plotter.generateSVG(geoJson, { title: "Multi-Expression Plot" });
    
    expect(svg).toContain('<svg');
    expect(svg).toContain('Multi-Expression Plot');
    expect(svg).toContain('class="legend"'); // Should contain legend
    expect(svg).toContain('sin(x)'); // Should contain legend text
    expect(svg).toContain('cos(x)'); // Should contain legend text
    expect(svg).toContain('#1f77b4'); // Should use specified colors
    expect(svg).toContain('#ff7f0e');
  });

  test("should suppress legend when noLegend option is true", () => {
    const plotter = new PlotGenerator();
    const geoJson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { expression: "sin(x)", label: "sin(x)" },
          geometry: {
            type: "LineString",
            coordinates: [[0, 0], [1, 0.84]]
          }
        },
        {
          type: "Feature",
          properties: { expression: "cos(x)", label: "cos(x)" },
          geometry: {
            type: "LineString",
            coordinates: [[0, 1], [1, 0.54]]
          }
        }
      ]
    };
    
    const svg = plotter.generateSVG(geoJson, { noLegend: true });
    
    expect(svg).toContain('<svg');
    expect(svg).not.toContain('class="legend"'); // Should not contain legend
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

  test("should set plot dimensions", () => {
    const plotter = new PlotGenerator();
    plotter.setDimensions(1200, 800);
    expect(plotter.width).toBe(1200);
    expect(plotter.height).toBe(800);
  });
});

describe("PlotCodeLib", () => {
  test("should instantiate without error", () => {
    expect(() => new PlotCodeLib()).not.toThrow();
  });

  test("should have export functionality", () => {
    const app = new PlotCodeLib();
    
    // Test that the exportData method exists
    expect(typeof app.exportData).toBe('function');
  });
});
