// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { JSDOM } from "jsdom";

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

  test("HTML structure contains required demo elements", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Check for essential elements
    expect(document.getElementById('lib-name')).toBeTruthy();
    expect(document.getElementById('lib-version')).toBeTruthy();
    expect(document.getElementById('lib-description')).toBeTruthy();
    
    // Check for demo sections
    expect(document.getElementById('string1')).toBeTruthy();
    expect(document.getElementById('string2')).toBeTruthy();
    expect(document.getElementById('string-result')).toBeTruthy();
    expect(document.getElementById('int1')).toBeTruthy();
    expect(document.getElementById('int2')).toBeTruthy();
    expect(document.getElementById('bits-result')).toBeTruthy();
  });

  test("HTML contains Hamming distance features", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("String Hamming Distance");
    expect(html).toContain("Bits Hamming Distance");
    expect(html).toContain("Input Validation");
    expect(html).toContain("Unicode Support");
    expect(html).toContain('hammingDistance("karolin", "kathrin")');
    expect(html).toContain('hammingDistanceBits(1, 4)');
  });

  test("HTML has proper meta tags for Hamming distance library", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    expect(document.querySelector('meta[charset="UTF-8"]')).toBeTruthy();
    expect(document.querySelector('meta[name="viewport"]')).toBeTruthy();
    expect(document.title).toBe('Hamming Distance Library');
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle.content).toBe('Hamming Distance Library');
  });
});
