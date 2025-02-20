import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import fs from "fs";

// Basic import test
describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

// Exported API tests
describe("Exported API Functions", () => {
  test("plotToSvg returns string containing <svg>", () => {
    const svg = mainModule.plotToSvg({ formulas: ["quad:1,0,0,-10,10,1"] });
    expect(typeof svg).toBe("string");
    expect(svg).toContain("<svg");
  });

  test("plotToJson returns object with required keys", () => {
    const json = mainModule.plotToJson({ formulas: ["sine:1,1,0,0,360,30"] });
    expect(json).toHaveProperty("quadratic");
    expect(json).toHaveProperty("linear");
    expect(json).toHaveProperty("sine");
    expect(json).toHaveProperty("cosine");
    expect(json).toHaveProperty("polar");
    expect(json).toHaveProperty("exponential");
    expect(json).toHaveProperty("logarithmic");
  });

  test("plotToText returns non-empty string", () => {
    // Using algebraic linear formula with range
    const text = mainModule.plotToText({ formulas: ["y=2x+3:-10,10,1"] });
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  test("plotToCsv returns CSV formatted string", () => {
    const csv = mainModule.plotToCsv({ formulas: ["quad:1,0,0,-10,10,1"] });
    expect(csv).toContain(",");
    expect(csv).toContain("Quadratic");
  });

  test("plotToHtml returns HTML string", () => {
    const html = mainModule.plotToHtml({ formulas: ["y=2x+3:-10,10,1"], grid: true });
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
  });

  test("plotToMarkdown returns markdown formatted string", () => {
    const md = mainModule.plotToMarkdown({ formulas: ["sine:1,1,0,0,360,30"] });
    expect(md).toContain("# Plot Data");
  });

  test("main generates markdown file when output file ends with .md", () => {
    const writeFileSyncSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    const originalArgv = process.argv;
    process.argv = ["node", "src/lib/main.js", "output.md", "y=2x+3:-10,10,1"];
    if (mainModule.main) {
      mainModule.main();
    }
    const argsCall = writeFileSyncSpy.mock.calls[0];
    expect(argsCall[1]).toContain("# Plot Data");
    writeFileSyncSpy.mockRestore();
    process.argv = originalArgv;
  });
});
