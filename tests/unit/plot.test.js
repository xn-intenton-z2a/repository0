// SPDX-License-Identifier: MIT
// Unit tests for plotting library
import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";
import { parseExpression, generateSeriesFromRange, renderSVG, renderPNG, main } from "../../src/lib/main.js";

describe("Plotting Library", () => {
  test("parseExpression returns a callable function for 'y=Math.sin(x)'", () => {
    const fn = parseExpression("y=Math.sin(x)");
    expect(typeof fn).toBe("function");
    expect(Math.abs(fn(0))).toBeLessThan(1e-9);
  });

  test("generateSeriesFromRange returns approximately 628 points for -3.14:0.01:3.14", () => {
    const fn = parseExpression("y=Math.sin(x)");
    const series = generateSeriesFromRange("-3.14:0.01:3.14", fn);
    // Allow small off-by-one floating point differences
    expect(series.length).toBeGreaterThanOrEqual(627);
    expect(series.length).toBeLessThanOrEqual(629);
  });

  test("renderSVG output contains <polyline> and viewBox attributes", () => {
    const fn = parseExpression("y=x");
    const series = generateSeriesFromRange("0:1:10", fn);
    const svg = renderSVG(series);
    expect(svg).toContain("<polyline");
    expect(svg).toContain("viewBox");
  });

  test("renderPNG returns a Buffer starting with PNG magic bytes", async () => {
    const fn = parseExpression("y=Math.sin(x)");
    const series = generateSeriesFromRange("0:0.5:6.28", fn);
    const buf = await renderPNG(series, { width: 120, height: 60 });
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  });

  test("CLI --help prints usage examples", () => {
    const logs = [];
    const oldLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));
    // call main synchronously for help
    main(["--help"]);
    console.log = oldLog;
    expect(logs.join('\n')).toContain('Usage:');
    expect(logs.join('\n')).toContain('--expression');
  });

  test("CLI --expression + --range + --file writes an SVG file", async () => {
    const out = path.join("tests", "unit", "tmp_plot.svg");
    try {
      // ensure file doesn't exist
      if (fs.existsSync(out)) fs.unlinkSync(out);
      await main(["--expression", "y=Math.sin(x)", "--range", "0:0.1:1", "--file", out]);
      expect(fs.existsSync(out)).toBe(true);
      const content = fs.readFileSync(out, "utf8");
      expect(content).toContain("<svg");
    } finally {
      try { if (fs.existsSync(out)) fs.unlinkSync(out); } catch (e) {}
    }
  });
});
