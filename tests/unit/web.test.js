// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { fizzBuzz } from '../../src/lib/main.js';

describe("Website", () => {
  test("src/web/index.html exists", () => {
    expect(existsSync("src/web/index.html")).toBe(true);
  });

  test("index.html contains valid HTML structure", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  test("index.html imports the library via lib-meta.js", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("lib-meta.js");
  });

  test("index.html displays library identity elements", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("lib-name");
    expect(html).toContain("lib-version");
  });

  test("fizzbuzz demo exists and has output element", () => {
    expect(existsSync('src/web/fizzbuzz.html')).toBe(true);
    const demo = readFileSync('src/web/fizzbuzz.html', 'utf8');
    expect(demo).toContain('id="fizzbuzz-output"');
    expect(existsSync('src/web/fizzbuzz.js')).toBe(true);
  });

  test('library wiring spot-check', () => {
    // ensure library function exists and works
    expect(typeof fizzBuzz).toBe('function');
    expect(fizzBuzz(3)).toEqual(['1','2','fizz']);
  });
});
