// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { 
  main, 
  getIdentity, 
  name, 
  version, 
  description,
  ExpressionParser,
  TimeSeriesGenerator,
  PlotRenderer
} from "../../src/lib/main.js";

const isNode = typeof process !== "undefined" && !!process.versions?.node;

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
  });

  test("should handle CLI arguments", () => {
    expect(() => main(["--version"])).not.toThrow();
    expect(() => main(["--identity"])).not.toThrow();
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

describe("Core Library Classes", () => {
  test.skipIf(!isNode)("ExpressionParser should be instantiable in Node.js", () => {
    expect(() => new ExpressionParser()).not.toThrow();
  });

  test("TimeSeriesGenerator should be instantiable", () => {
    expect(() => new TimeSeriesGenerator()).not.toThrow();
  });

  test.skipIf(!isNode)("PlotRenderer should be instantiable in Node.js", () => {
    expect(() => new PlotRenderer()).not.toThrow();
  });

  test("ExpressionParser should throw error when not in Node.js", () => {
    if (!isNode) {
      expect(() => new ExpressionParser()).toThrow("ExpressionParser requires Math.js (Node.js environment)");
    }
  });

  test("PlotRenderer should throw error when not in Node.js", () => {
    if (!isNode) {
      expect(() => new PlotRenderer()).toThrow("PlotRenderer requires D3.js and Sharp (Node.js environment)");
    }
  });
});
