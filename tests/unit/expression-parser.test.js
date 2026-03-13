// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { ExpressionParser } from "../../src/lib/main.js";

const isNode = typeof process !== "undefined" && !!process.versions?.node;

describe("Expression Parser", () => {
  test.skipIf(!isNode)("should parse basic expressions", () => {
    const parser = new ExpressionParser();
    const func = parser.parse("y=sin(x)");
    expect(typeof func).toBe("function");
    
    const result = func({ x: Math.PI/2 });
    expect(result).toBeCloseTo(1);
  });

  test.skipIf(!isNode)("should handle mathematical functions", () => {
    const parser = new ExpressionParser();
    const func = parser.parse("y=sin(x)*cos(x)");
    const result = func({ x: Math.PI/4 });
    expect(result).toBeCloseTo(0.5);
  });

  test.skipIf(!isNode)("should support arithmetic operators", () => {
    const parser = new ExpressionParser();
    const func = parser.parse("y=x^2 + 2*x + 1");
    const result = func({ x: 2 });
    expect(result).toBe(9);
  });

  test.skipIf(!isNode)("should support mathematical constants", () => {
    const parser = new ExpressionParser();
    const func = parser.parse("y=pi * x");
    const result = func({ x: 1 });
    expect(result).toBeCloseTo(Math.PI);
  });

  test.skipIf(!isNode)("should validate expression syntax", () => {
    const parser = new ExpressionParser();
    // Test with genuinely invalid syntax that Math.js will reject
    expect(() => parser.parse("y=sin(x")).toThrow(); // Missing closing parenthesis
    expect(() => parser.parse("y=x++")).toThrow(); // Invalid operator
  });

  test.skipIf(!isNode)("should handle expressions without y= prefix", () => {
    const parser = new ExpressionParser();
    const func = parser.parse("sin(x)");
    const result = func({ x: Math.PI/2 });
    expect(result).toBeCloseTo(1);
  });

  test.skipIf(!isNode)("should handle complex expressions", () => {
    const parser = new ExpressionParser();
    const func = parser.parse("y=sqrt(abs(x)) + log(x+1)");
    const result = func({ x: 3 });
    expect(result).toBeCloseTo(Math.sqrt(3) + Math.log(4));
  });

  test("should throw error when mathjs not available", () => {
    // In browser environments, this should throw
    if (!isNode) {
      expect(() => new ExpressionParser()).toThrow("ExpressionParser requires Math.js (Node.js environment)");
    }
  });
});