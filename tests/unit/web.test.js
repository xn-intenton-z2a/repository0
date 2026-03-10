// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

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

  test("index.html contains Hamming distance demo sections", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("String Hamming Distance");
    expect(html).toContain("Bit Hamming Distance");
    expect(html).toContain("hammingDistance");
    expect(html).toContain("hammingDistanceBits");
  });

  test("index.html has interactive elements for testing", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain('id="str1"');
    expect(html).toContain('id="str2"');
    expect(html).toContain('id="num1"');
    expect(html).toContain('id="num2"');
    expect(html).toContain("calculateStringDistance");
    expect(html).toContain("calculateBitsDistance");
  });
});
