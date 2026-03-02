// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main } from "../../src/lib/main.js";
import { ExpressionParser } from "../../src/lib/expression-parser.js";
import { SVGPlotter } from "../../src/lib/plotter.js";
import fs from "fs";

describe("ExpressionParser", () => {
  const parser = new ExpressionParser();

  test("should parse simple expressions", () => {
    const result = parser.parse("sin(x)");
    expect(result.isValid).toBe(true);
    expect(result.expression).toBe("sin(x)");
    expect(result.variable).toBe("x");
  });

  test("should parse y = f(x) format", () => {
    const result = parser.parse("y = cos(x)");
    expect(result.isValid).toBe(true);
    expect(result.expression).toBe("cos(x)");
    expect(result.variable).toBe("x");
  });

  test("should handle invalid expressions", () => {
    const result = parser.parse("invalid syntax +++");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test("should evaluate expressions at specific points", () => {
    const parsed = parser.parse("x^2");
    const result = parser.evaluate(parsed, 3);
    expect(result).toBe(9);
  });

  test("should generate time series data", () => {
    const parsed = parser.parse("sin(x)");
    const data = parser.generateTimeSeries(parsed, { min: 0, max: Math.PI, steps: 10 });
    expect(data).toHaveLength(10);
    expect(data[0]).toHaveProperty('x');
    expect(data[0]).toHaveProperty('y');
  });

  test("should parse range strings", () => {
    const range1 = parser.parseRange("-10:10");
    expect(range1.min).toBe(-10);
    expect(range1.max).toBe(10);
    expect(range1.steps).toBe(100);

    const range2 = parser.parseRange("x=-5:5");
    expect(range2.min).toBe(-5);
    expect(range2.max).toBe(5);
  });
});

describe("SVGPlotter", () => {
  const plotter = new SVGPlotter();

  test("should create SVG plot", () => {
    const data = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 4 }
    ];
    
    const svg = plotter.plot(data);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('path');
  });

  test("should handle empty data", () => {
    expect(() => plotter.plot([])).toThrow('No data provided');
  });
});

describe("Main CLI", () => {
  test("should handle help flag", () => {
    // Help flag should not throw
    expect(() => main(['--help'])).not.toThrow();
  });

  test("should handle missing expression", () => {
    // Mock process.exit to prevent actual exit during test
    const originalExit = process.exit;
    let exitCode = null;
    process.exit = (code) => { exitCode = code; };

    main([]);
    expect(exitCode).toBe(1);

    // Restore original process.exit
    process.exit = originalExit;
  });

  test("should generate plot file", () => {
    const testFile = 'test-output.svg';
    
    // Clean up any existing test file
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }

    main(['--expression', 'sin(x)', '--range', '-1:1', '--file', testFile]);
    
    expect(fs.existsSync(testFile)).toBe(true);
    const content = fs.readFileSync(testFile, 'utf8');
    expect(content).toContain('<svg');
    
    // Clean up
    fs.unlinkSync(testFile);
  });
});
