// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { 
  main, 
  parseExpression, 
  evaluateExpression, 
  generateTimeSeries 
} from "../../src/lib/main.js";

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main([]);
  });

  test("should handle --expr argument", () => {
    process.argv = ["node", "src/lib/main.js"];
    main(["--expr", "x^2"]);
  });
});

describe("Expression Parser", () => {
  test("should parse simple numbers", () => {
    expect(evaluateExpression("42")).toBe(42);
    expect(evaluateExpression("3.14")).toBe(3.14);
  });

  test("should parse basic arithmetic", () => {
    expect(evaluateExpression("2 + 3")).toBe(5);
    expect(evaluateExpression("10 - 4")).toBe(6);
    expect(evaluateExpression("3 * 4")).toBe(12);
    expect(evaluateExpression("15 / 3")).toBe(5);
  });

  test("should handle operator precedence", () => {
    expect(evaluateExpression("2 + 3 * 4")).toBe(14);
    expect(evaluateExpression("(2 + 3) * 4")).toBe(20);
    expect(evaluateExpression("2 * 3 + 4")).toBe(10);
    expect(evaluateExpression("2 * (3 + 4)")).toBe(14);
  });

  test("should handle exponentiation", () => {
    expect(evaluateExpression("2 ^ 3")).toBe(8);
    expect(evaluateExpression("2 ^ 3 ^ 2")).toBe(512); // Right associative: 2^(3^2) = 2^9
    expect(evaluateExpression("(2 ^ 3) ^ 2")).toBe(64);
  });

  test("should handle unary operators", () => {
    expect(evaluateExpression("-5")).toBe(-5);
    expect(evaluateExpression("+5")).toBe(5);
    expect(evaluateExpression("-(2 + 3)")).toBe(-5);
  });

  test("should evaluate variables", () => {
    expect(evaluateExpression("x", { x: 5 })).toBe(5);
    expect(evaluateExpression("x + y", { x: 3, y: 7 })).toBe(10);
    expect(evaluateExpression("x * y - 1", { x: 4, y: 2 })).toBe(7);
  });

  test("should handle mathematical functions", () => {
    expect(evaluateExpression("sin(0)")).toBeCloseTo(0);
    expect(evaluateExpression("cos(0)")).toBeCloseTo(1);
    expect(evaluateExpression("sqrt(16)")).toBe(4);
    expect(evaluateExpression("abs(-5)")).toBe(5);
    expect(evaluateExpression("log(1)")).toBe(0);
    expect(evaluateExpression("exp(0)")).toBe(1);
  });

  test("should handle complex expressions", () => {
    expect(evaluateExpression("sin(x) + cos(x)", { x: 0 })).toBeCloseTo(1);
    expect(evaluateExpression("sqrt(x^2 + y^2)", { x: 3, y: 4 })).toBe(5);
    expect(evaluateExpression("2 * sin(x) + 3", { x: Math.PI / 2 })).toBeCloseTo(5);
  });

  test("should handle nested functions", () => {
    expect(evaluateExpression("sin(cos(0))")).toBeCloseTo(Math.sin(1));
    expect(evaluateExpression("sqrt(abs(-16))")).toBe(4);
  });

  test("should throw errors for invalid expressions", () => {
    expect(() => evaluateExpression("")).toThrow();
    expect(() => evaluateExpression("x", {})).toThrow();
    expect(() => evaluateExpression("unknown_func(5)")).toThrow();
    expect(() => evaluateExpression("5 /")).toThrow();
    expect(() => evaluateExpression("(5 + 3")).toThrow();
  });

  test("should handle division by zero", () => {
    expect(() => evaluateExpression("1 / 0")).toThrow("Division by zero");
  });
});

describe("Time Series Generation", () => {
  test("should generate points for linear function", () => {
    const points = generateTimeSeries("x", -1, 1, 5);
    expect(points).toHaveLength(5);
    expect(points[0]).toEqual({ x: -1, y: -1 });
    expect(points[4]).toEqual({ x: 1, y: 1 });
  });

  test("should generate points for quadratic function", () => {
    const points = generateTimeSeries("x^2", -2, 2, 5);
    expect(points).toHaveLength(5);
    expect(points[0]).toEqual({ x: -2, y: 4 });
    expect(points[2]).toEqual({ x: 0, y: 0 });
    expect(points[4]).toEqual({ x: 2, y: 4 });
  });

  test("should handle trigonometric functions", () => {
    const points = generateTimeSeries("sin(x)", 0, Math.PI, 3);
    expect(points).toHaveLength(3);
    expect(points[0].y).toBeCloseTo(0);
    expect(points[1].y).toBeCloseTo(1);
    expect(points[2].y).toBeCloseTo(0);
  });

  test("should skip invalid points", () => {
    const points = generateTimeSeries("1/x", -1, 1, 21); // Includes x=0 which causes division by zero
    expect(points.length).toBeLessThan(21); // Should skip the point where x=0
  });

  test("should handle complex expressions", () => {
    const points = generateTimeSeries("x^2 + 2*x + 1", -1, 1, 3);
    expect(points).toHaveLength(3);
    expect(points[1]).toEqual({ x: 0, y: 1 }); // (0)^2 + 2*(0) + 1 = 1
  });
});
