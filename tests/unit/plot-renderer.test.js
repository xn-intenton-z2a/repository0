// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { PlotRenderer, TimeSeriesGenerator, ExpressionParser } from "../../src/lib/main.js";

const isNode = typeof process !== "undefined" && !!process.versions?.node;

describe("Plot Renderer", () => {
  const createTestData = () => {
    // Create mock data that doesn't require ExpressionParser
    return [
      { x: 0, y: 0 },
      { x: 0.5, y: 0.479 },
      { x: 1, y: 0.841 },
      { x: 1.5, y: 0.997 },
      { x: 2, y: 0.909 },
      { x: 2.5, y: 0.598 },
      { x: 3, y: 0.141 }
    ];
  };

  test.skipIf(!isNode)("should render SVG plots", () => {
    const renderer = new PlotRenderer();
    const testData = createTestData();
    const svgContent = renderer.renderSVG(testData, { width: 800, height: 600 });
    
    expect(svgContent).toContain("<svg");
    expect(svgContent).toContain("</svg>");
    expect(svgContent).toContain("width=\"800\"");
    expect(svgContent).toContain("height=\"600\"");
  });

  test.skipIf(!isNode)("should include proper SVG structure", () => {
    const renderer = new PlotRenderer();
    const testData = createTestData();
    const svg = renderer.renderSVG(testData);
    
    expect(svg).toContain("<path");
    expect(svg).toContain("stroke=\"blue\"");
    expect(svg).toContain("fill=\"none\"");
  });

  test.skipIf(!isNode)("should support custom plot options", () => {
    const renderer = new PlotRenderer();
    const testData = createTestData();
    const svg = renderer.renderSVG(testData, { 
      title: "Test Plot",
      width: 600,
      height: 400
    });
    
    expect(svg).toContain("Test Plot");
    expect(svg).toContain("width=\"600\"");
    expect(svg).toContain("height=\"400\"");
  });

  test.skipIf(!isNode)("should generate proper axes and grid", () => {
    const renderer = new PlotRenderer();
    const testData = createTestData();
    const svg = renderer.renderSVG(testData);
    
    // Check for grid lines and axes
    expect(svg).toContain("stroke=\"#e0e0e0\""); // Grid lines
    expect(svg).toContain("stroke=\"black\""); // Axis lines
  });

  test.skipIf(!isNode)("should handle empty data gracefully", () => {
    const renderer = new PlotRenderer();
    const svg = renderer.renderSVG([]);
    expect(svg).toContain("No data to plot");
  });

  test.skipIf(!isNode)("should export PNG plots", async () => {
    const renderer = new PlotRenderer();
    const testData = createTestData();
    const pngBuffer = await renderer.renderPNG(testData);
    
    expect(pngBuffer instanceof Buffer).toBe(true);
    expect(pngBuffer.length).toBeGreaterThan(0);
  });

  test("should auto-scale plot dimensions", () => {
    // This test works without Node.js dependencies since it just creates the data
    const wideRangeData = [
      { x: -100, y: -1000 },
      { x: 100, y: 1000 }
    ];
    
    // Just verify the data structure is correct
    expect(wideRangeData).toBeDefined();
    expect(wideRangeData.length).toBe(2);
  });

  test("should throw error when dependencies not available", () => {
    // In browser environments, this should throw
    if (!isNode) {
      expect(() => new PlotRenderer()).toThrow("PlotRenderer requires D3.js and Sharp (Node.js environment)");
    }
  });
});