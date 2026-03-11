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

  test("index.html contains string hamming distance feature section", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("String Hamming Distance");
    expect(html).toContain("string1");
    expect(html).toContain("string2");
    expect(html).toContain("calculateStringDistance");
    expect(html).toContain("string-demo");
  });

  test("index.html contains bit hamming distance feature section", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("Bit Hamming Distance");
    expect(html).toContain("int1");
    expect(html).toContain("int2");
    expect(html).toContain("calculateBitDistance");
    expect(html).toContain("bit-demo");
  });

  test("TODO: test interactive functionality when library is implemented", () => {
    // TODO: Add JSDOM-based tests that verify the interactive demo functions work correctly
    // When the library functions are implemented, test that:
    // - calculateStringDistance() displays correct results
    // - calculateBitDistance() displays correct results
    // - Error cases are handled properly in the UI
    expect(true).toBe(true); // Placeholder passing test
  });
});
