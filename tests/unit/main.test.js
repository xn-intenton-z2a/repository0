// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, getIdentity, name, version, description, parseExpression, generateSeries, produceSVG, producePNG } from "../../src/lib/main.js";
import { existsSync, readFileSync, mkdirSync } from "fs";

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
  });
});

describe("Library Identity", () => {
  test("exports name, version, and description", () => {
    expect(typeof name).toBe("string");
    expect(typeof version).toBe("string");
    expect(typeof description).toBe("string");
    expect(name.length).toBeGreaterThan(0);
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });

  test("getIdentity returns correct structure", () => {
    const identity = getIdentity();
    expect(identity).toEqual({ name, version, description });
  });
});

describe("Plotting API", () => {
  test("parseExpression returns a function and evaluates", () => {
    const fn = parseExpression("y=sin(x)");
    expect(typeof fn).toBe("function");
    const v = fn(0);
    expect(Math.abs(v - 0)).toBeLessThan(1e-9);
  });

  test("generateSeries produces correct number of points and values", () => {
    const series = generateSeries({ expression: "y=sin(x)", range: "x=0:3.1416", points: 5 });
    expect(series.length).toBe(5);
    expect(series[0].x).toBeCloseTo(0);
    expect(series[4].x).toBeCloseTo(3.1416);
    // middle value approx sin(pi/2) ~ 1
    expect(Math.abs(series[2].y - 1)).toBeLessThan(0.01);
  });

  test("produceSVG returns an SVG string", () => {
    const series = generateSeries({ expression: "y=x", range: "x=0:1", points: 3 });
    const svg = produceSVG(series, { width: 200, height: 100 });
    expect(typeof svg).toBe("string");
    expect(svg).toContain("<svg");
    expect(svg).toContain("<path");
  });

  test("producePNG returns a valid PNG buffer with signature", () => {
    const series = generateSeries({ expression: "y=sin(x)", range: "x=0:6.28", points: 20 });
    const png = producePNG(series, { width: 100, height: 50 });
    expect(Buffer.isBuffer(png)).toBe(true);
    // PNG signature
    expect(png.slice(0, 8).toString('binary')).toBe('\x89PNG\r\n\x1a\n');
  });

  test("CLI writes output files when --file provided", () => {
    const outDir = "tests/tmp";
    try { mkdirSync(outDir); } catch (e) {}
    const svgPath = `${outDir}/out.svg`;
    const pngPath = `${outDir}/out.png`;
    main(["--expression", "y=sin(x)", "--range", "x=0:6.28", "--points", "50", "--file", svgPath]);
    expect(existsSync(svgPath)).toBe(true);
    main(["--expression", "y=sin(x)", "--range", "x=0:6.28", "--points", "50", "--file", pngPath]);
    expect(existsSync(pngPath)).toBe(true);
  });
});
