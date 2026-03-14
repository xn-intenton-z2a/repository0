// SPDX-License-Identifier: MIT
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

  test("index.html imports the library via lib.js", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("lib.js");
  });

  test("src/web/lib.js re-exports from the library", () => {
    expect(existsSync("src/web/lib.js")).toBe(true);
    const lib = readFileSync("src/web/lib.js", "utf8");
    expect(lib).toContain("../lib/main.js");
  });

  test("index.html contains feature sections for the mission", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("id=\"classes-section\"");
    expect(html).toContain("id=\"properties-section\"");
    expect(html).toContain("id=\"individuals-section\"");
    expect(html).toContain("id=\"query-section\"");
    expect(html).toContain("id=\"persistence-section\"");
    expect(html).toContain("id=\"stats-section\"");
  });

  test("index.html contains demo action buttons", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("id=\"btn-seed\"");
    expect(html).toContain("id=\"btn-load\"");
    expect(html).toContain("id=\"btn-reset\"");
    expect(html).toContain("id=\"btn-query\"");
    expect(html).toContain("id=\"btn-save\"");
  });

  test("index.html displays library identity elements", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("lib-name");
    expect(html).toContain("lib-version");
  });
});
