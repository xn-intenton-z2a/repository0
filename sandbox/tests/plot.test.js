// sandbox/tests/plot.test.js
import { describe, test, expect } from "vitest";
import { plotQuadratic, plotSine } from "../source/plot.js";

describe("plotQuadratic", () => {
  test("returns an SVG string with a <polyline>", () => {
    const svg = plotQuadratic(1, 0, 0);
    expect(typeof svg).toBe("string");
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg.includes("<polyline")).toBe(true);
    expect(svg.endsWith("</svg>")).toBe(true);
  });
});

describe("plotSine", () => {
  test("returns an SVG string with a <path>", () => {
    const svg = plotSine(1, 1);
    expect(typeof svg).toBe("string");
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg.includes("<path")).toBe(true);
    expect(svg.endsWith("</svg>")).toBe(true);
  });
});
