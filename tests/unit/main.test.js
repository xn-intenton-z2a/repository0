import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import fs from "fs";
import readline from "readline";

// Added greeting for Christo
console.log("Hello Christo");

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

// Interactive CLI Mode test
describe("Interactive CLI Mode", () => {
  test("should prompt for input when --interactive flag is provided", () => {
    const rlMock = {
      question: vi.fn((prompt, callback) => { callback("y=2x+3:-10,10,1"); }),
      close: vi.fn(),
    };
    vi.spyOn(readline, "createInterface").mockReturnValue(rlMock);
    const originalArgv = process.argv;
    process.argv = ["node", "src/lib/main.js", "--interactive"];
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    mainModule.main();
    expect(rlMock.question).toHaveBeenCalled();
    exitSpy.mockRestore();
    process.argv = originalArgv;
  });
});

// Error Handling Tests
describe("Error Handling", () => {
  test("parseGenericQuadratic throws error for invalid input", () => {
    expect(() => mainModule.parseGenericQuadratic("invalid formula")).toThrow();
  });
  
  test("plotFromString returns empty array for unrecognized formula", () => {
    const result = mainModule.plotFromString("unknown:parameter");
    expect(result).toEqual([]);
  });
  
  test("parseSine throws error for invalid sine formula string", () => {
    expect(() => mainModule.parseSine("sine:invalid")).toThrow();
  });
});
