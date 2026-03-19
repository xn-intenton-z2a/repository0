// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect, beforeAll, afterAll, vi } from "vitest";
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { 
  main, 
  getIdentity, 
  name, 
  version, 
  description,
  parseExpression,
  parseRange,
  evaluateRange,
  loadCSV,
  renderSVG,
  renderPNG,
  savePlot,
  printUsage
} from "../../src/lib/main.js";

// Test fixtures directory
const testDir = './test-fixtures';
const testCsvFile = `${testDir}/test-data.csv`;

beforeAll(async () => {
  // Create test fixtures directory
  if (!existsSync(testDir)) {
    await mkdir(testDir, { recursive: true });
  }
  
  // Create test CSV file
  const csvContent = `time,value
0,1
1,4
2,9
3,16
4,25`;
  await writeFile(testCsvFile, csvContent);
});

afterAll(async () => {
  // Clean up test files
  try {
    await unlink(testCsvFile);
    await unlink(`${testDir}/test.svg`);
    await unlink(`${testDir}/test.png`);
  } catch {
    // Ignore cleanup errors
  }
});

describe("Main Output", () => {
  test("should terminate without error", async () => {
    await main();
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

describe("Expression Parser", () => {
  test("parsing y=Math.sin(x) returns a callable function", () => {
    const func = parseExpression("y=Math.sin(x)");
    expect(typeof func).toBe("function");
    
    // Test the function works
    expect(func(0)).toBeCloseTo(0);
    expect(func(Math.PI / 2)).toBeCloseTo(1);
  });
  
  test("parses expressions without y= prefix", () => {
    const func = parseExpression("Math.cos(x)");
    expect(typeof func).toBe("function");
    expect(func(0)).toBeCloseTo(1);
  });
  
  test("parses polynomial expressions", () => {
    const func = parseExpression("x*x + 2*x - 1");
    expect(typeof func).toBe("function");
    expect(func(0)).toBe(-1);
    expect(func(1)).toBe(2);
  });
  
  test("throws error for invalid expressions", () => {
    expect(() => {
      const func = parseExpression("invalid");
      func(1); // Actually call the function to trigger the error
    }).toThrow();
  });
});

describe("Range Evaluation", () => {
  test("parseRange handles start:step:end format", () => {
    const range = parseRange("-3.14:0.01:3.14");
    expect(range).toEqual({ start: -3.14, step: 0.01, end: 3.14 });
  });
  
  test("evaluating range -3.14:0.01:3.14 returns ~628 data points", () => {
    const func = parseExpression("Math.sin(x)");
    const points = evaluateRange(func, "-3.14:0.01:3.14");
    
    // Expected: (3.14 - (-3.14)) / 0.01 + 1 = 629 points
    expect(points.length).toBeCloseTo(629, 0);
    expect(points[0]).toEqual({ x: -3.14, y: Math.sin(-3.14) });
    
    // Use toBeCloseTo for floating point comparison
    const lastPoint = points[points.length - 1];
    expect(lastPoint.x).toBeCloseTo(3.14, 2);
    expect(lastPoint.y).toBeCloseTo(Math.sin(3.14), 5);
  });
  
  test("evaluateRange accepts range object", () => {
    const func = parseExpression("x");
    const points = evaluateRange(func, { start: 0, step: 1, end: 2 });
    
    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ]);
  });
  
  test("throws error for invalid range format", () => {
    expect(() => parseRange("invalid")).toThrow("Range must be in format start:step:end");
    expect(() => parseRange("1:2")).toThrow("Range must be in format start:step:end");
    expect(() => parseRange("a:b:c")).toThrow("Range values must be numbers");
  });
});

describe("CSV Data Loader", () => {
  test("loads time,value CSV into a numeric series", async () => {
    const points = await loadCSV(testCsvFile);
    
    expect(points).toEqual([
      { x: 0, y: 1 },
      { x: 1, y: 4 },
      { x: 2, y: 9 },
      { x: 3, y: 16 },
      { x: 4, y: 25 }
    ]);
  });
  
  test("throws error for non-existent file", async () => {
    await expect(loadCSV('nonexistent.csv')).rejects.toThrow('CSV file not found');
  });
  
  test("throws error for CSV without required columns", async () => {
    const badCsvFile = `${testDir}/bad.csv`;
    await writeFile(badCsvFile, 'x,z\n1,2');
    
    await expect(loadCSV(badCsvFile)).rejects.toThrow('CSV must have "time" and "value" columns');
    
    await unlink(badCsvFile);
  });
});

describe("SVG Renderer", () => {
  test("generated SVG contains <polyline> element and has a viewBox attribute", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 4 }
    ];
    
    const svg = renderSVG(points);
    
    expect(svg).toContain('<polyline');
    expect(svg).toContain('viewBox="0 0 800 600"');
    expect(svg).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });
  
  test("accepts custom dimensions", () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const svg = renderSVG(points, { width: 400, height: 300 });
    
    expect(svg).toContain('viewBox="0 0 400 300"');
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="300"');
  });
  
  test("throws error for empty points", () => {
    expect(() => renderSVG([])).toThrow('No data points to render');
    expect(() => renderSVG(null)).toThrow('No data points to render');
  });
});

describe("PNG Renderer", () => {
  test("generated PNG files start with the PNG magic bytes", async () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 4 }
    ];
    
    const pngBuffer = await renderPNG(points);
    
    // PNG magic bytes: \x89PNG\r\n\x1a\n
    expect(pngBuffer[0]).toBe(0x89);
    expect(pngBuffer[1]).toBe(0x50); // P
    expect(pngBuffer[2]).toBe(0x4E); // N
    expect(pngBuffer[3]).toBe(0x47); // G
  });
  
  test("accepts custom dimensions", async () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const pngBuffer = await renderPNG(points, { width: 400, height: 300 });
    
    expect(pngBuffer.length).toBeGreaterThan(0);
    // Verify PNG magic bytes
    expect(pngBuffer.slice(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4E, 0x47]));
  });
  
  test("throws error for empty points", async () => {
    await expect(renderPNG([])).rejects.toThrow('No data points to render');
  });
});

describe("File Saving", () => {
  test("savePlot creates SVG file", async () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const filePath = `${testDir}/test.svg`;
    
    await savePlot(points, filePath);
    expect(existsSync(filePath)).toBe(true);
    
    // Verify file contains valid SVG
    const { readFile } = await import('fs/promises');
    const content = await readFile(filePath, 'utf8');
    expect(content).toContain('<svg');
    expect(content).toContain('<polyline');
  });
  
  test("savePlot creates PNG file", async () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const filePath = `${testDir}/test.png`;
    
    await savePlot(points, filePath);
    expect(existsSync(filePath)).toBe(true);
    
    // Verify PNG magic bytes
    const { readFile } = await import('fs/promises');
    const buffer = await readFile(filePath);
    expect(buffer.slice(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4E, 0x47]));
  });
  
  test("throws error for unsupported format", async () => {
    const points = [{ x: 0, y: 0 }];
    await expect(savePlot(points, 'test.txt')).rejects.toThrow('Unsupported file format');
  });
});

describe("CLI Interface", () => {
  test("--help prints usage examples", async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    await main(['--help']);
    
    expect(consoleSpy).toHaveBeenCalled();
    const output = consoleSpy.mock.calls.map(call => call[0]).join('\n');
    expect(output).toContain('--expression');
    expect(output).toContain('--range');
    expect(output).toContain('--csv');
    expect(output).toContain('--file');
    expect(output).toContain('Math.sin(x)');
    
    consoleSpy.mockRestore();
  });
  
  test("--version prints version", async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    await main(['--version']);
    
    expect(consoleSpy).toHaveBeenCalledWith(version);
    consoleSpy.mockRestore();
  });
  
  test("--identity prints library identity", async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    await main(['--identity']);
    
    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(getIdentity(), null, 2));
    consoleSpy.mockRestore();
  });
  
  test("--expression with --range produces SVG file", async () => {
    const outputFile = `${testDir}/cli-test.svg`;
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    await main(['--expression', 'Math.sin(x)', '--range', '0:0.5:3', '--file', outputFile]);
    
    expect(existsSync(outputFile)).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(`Plot saved to ${outputFile}`);
    
    await unlink(outputFile);
    consoleSpy.mockRestore();
  });
  
  test("--csv produces PNG file", async () => {
    const outputFile = `${testDir}/cli-csv-test.png`;
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    await main(['--csv', testCsvFile, '--file', outputFile]);
    
    expect(existsSync(outputFile)).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(`Plot saved to ${outputFile}`);
    
    await unlink(outputFile);
    consoleSpy.mockRestore();
  });
  
  test("missing required arguments produces error", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    
    await main(['--expression', 'x']);
    
    expect(consoleSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
    
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });
});