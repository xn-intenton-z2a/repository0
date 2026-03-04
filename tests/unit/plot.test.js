// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { parseRange, prepareExpression, generateSeries, createSVG } from "../../src/lib/plot.js";

describe("plot.js utilities", () => {
  test("parseRange: defaults and custom", () => {
    expect(parseRange()).toEqual({ start: -1, end: 1, count: 200 });
    expect(parseRange("x=0:6.283:5")).toEqual({ start: 0, end: 6.283, count: 5 });
  });

  test("prepareExpression: strips left-hand side", () => {
    expect(prepareExpression("y=sin(x)")).toBe("sin(x)");
    expect(prepareExpression("sin(x)")).toBe("sin(x)");
  });

  test("generateSeries: produces expected length and numeric y values", () => {
    const range = parseRange("x=0:3.14159:5");
    const pts = generateSeries("sin(x)", range);
    expect(pts).toHaveLength(5);
    // first and last x match range
    expect(pts[0].x).toBeCloseTo(0);
    expect(pts[pts.length - 1].x).toBeCloseTo(3.14159);
    // y values are numbers (may be 0 at endpoints)
    expect(typeof pts[0].y).toBe("number");
    expect(typeof pts[2].y).toBe("number");
  });

  test("createSVG: returns an SVG string containing path and svg root", () => {
    const range = { start: -1, end: 1, count: 10 };
    const pts = generateSeries("x", range); // y=x
    const svg = createSVG(pts, { width: 300, height: 150, padding: 10 });
    expect(svg).toMatch(/<svg[^>]*>/);
    expect(svg).toMatch(/<path[^>]*d="[^"]+"/);
    expect(svg.startsWith("<?xml")).toBe(true);
  });
});
