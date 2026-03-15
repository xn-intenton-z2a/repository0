// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { writeFileSync, existsSync, readFileSync, unlinkSync } from "fs";
import { execSync } from "child_process";

import {
  parseExpression,
  sampleRange,
  sampleExpression,
  loadCSV,
  renderSVG,
  renderPNG,
  savePlot,
} from "../../src/lib/main.js";

describe("Plotting library", () => {
  test("parseExpression returns a function and evaluates Math functions", () => {
    const f = parseExpression("y=Math.sin(x)");
    expect(typeof f).toBe("function");
    expect(f(Math.PI / 2)).toBeCloseTo(1, 6);
  });

  test("sampleRange produces ~628 samples for -3.14:0.01:3.14", () => {
    const xs = sampleRange("-3.14:0.01:3.14");
    // Expect 628 samples (exclude endpoint)
    expect(xs.length).toBe(628);
  });

  test("sampleExpression returns x,y points", () => {
    const f = parseExpression("y=x*x");
    const pts = sampleExpression(f, "0:1:5");
    expect(pts.length).toBe(5);
    expect(pts[2].x).toBe(2);
    expect(pts[2].y).toBe(4);
  });

  test("loadCSV parses time,value CSV", async () => {
    const tmp = "tests/unit/sample.csv";
    writeFileSync(tmp, "time,value\n0,1\n1,2\n2,3\n", "utf8");
    const rows = await loadCSV(tmp);
    expect(rows.length).toBe(3);
    expect(rows[1].time).toBe(1);
    expect(rows[1].value).toBe(2);
    unlinkSync(tmp);
  });

  test("renderSVG contains polyline and viewBox", () => {
    const svg = renderSVG([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ]);
    expect(svg).toContain("<polyline");
    expect(svg).toContain("viewBox=");
  });

  test("renderPNG returns PNG buffer starting with PNG signature", async () => {
    const buf = await renderPNG([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ], { width: 120, height: 80 });
    expect(Buffer.isBuffer(buf)).toBe(true);
    const sig = buf.slice(0, 8);
    expect(sig.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(true);
  });

  test("CLI --help prints usage and CLI can produce an SVG file", () => {
    const help = execSync("node src/lib/main.js --help", { encoding: "utf8" });
    expect(help).toContain("Usage:");

    const out = "tests/unit/out.svg";
    try {
      execSync("node src/lib/main.js --expression \"y=Math.sin(x)\" --range \"-3.14:0.1:3.14\" --file " + out, { encoding: "utf8" });
      expect(existsSync(out)).toBe(true);
      const txt = readFileSync(out, "utf8");
      expect(txt).toContain("<svg");
      expect(txt).toContain("<polyline");
    } finally {
      if (existsSync(out)) unlinkSync(out);
    }
  });
});
