// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { main, generateTimeSeries, generateSVG } from "../../src/lib/main.js";

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
  });

  test("generateTimeSeries produces points for sin(x)", () => {
    const pts = generateTimeSeries("sin(x)", "x=0:6.283", 100);
    expect(pts.length).toBeGreaterThan(0);
    expect(typeof pts[0].x).toBe("number");
    expect(typeof pts[0].y).toBe("number");
  });

  test("generateSVG returns svg string", () => {
    const pts = generateTimeSeries("sin(x)", "x=0:6.283", 50);
    const svg = generateSVG(pts);
    expect(svg.startsWith("<?xml")).toBe(true);
    expect(svg).toContain("<svg");
    expect(svg).toContain("<path");
  });
});
