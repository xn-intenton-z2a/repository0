// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { parseExpression } from "../../src/lib/expression-parser.js";

describe("Expression Parser", () => {
  test("should parse simple cartesian expression", () => {
    const result = parseExpression("y=sin(x)");
    expect(result.type).toBe("cartesian");
    expect(result.formula).toBe("y=sin(x)");
    expect(result.independentVariable).toBe("x");
    expect(result.expressions).toHaveLength(1);
    expect(result.expressions[0].variable).toBe("y");
  });

  test("should parse implicit expression", () => {
    const result = parseExpression("sin(x)");
    expect(result.type).toBe("cartesian");
    expect(result.expressions[0].variable).toBe("y");
    expect(result.expressions[0].expression).toBe("sin(x)");
  });

  test("should parse parametric expression", () => {
    const result = parseExpression("x=t*cos(t),y=t*sin(t)");
    expect(result.type).toBe("parametric");
    expect(result.independentVariable).toBe("t");
    expect(result.expressions).toHaveLength(2);
  });

  test("should parse polar expression", () => {
    const result = parseExpression("r=1+cos(theta)");
    expect(result.type).toBe("polar");
    expect(result.independentVariable).toBe("theta");
  });

  test("should evaluate expressions correctly", () => {
    const expr = parseExpression("y=x^2");
    const result = expr.evaluate({ x: 3 });
    expect(result.y).toBe(9);
  });

  test("should handle multiple expressions", () => {
    const result = parseExpression("y=sin(x),y=cos(x)");
    expect(result.expressions).toHaveLength(2);
  });

  test("should throw error for empty expression", () => {
    expect(() => parseExpression("")).toThrow("Expression must be a non-empty string");
  });
});