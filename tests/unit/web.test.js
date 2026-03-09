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

  test("index.html contains fizzbuzz demo elements", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain('id="start"');
    expect(html).toContain('id="end"');
    expect(html).toContain('id="generate"');
    expect(html).toContain('id="results"');
  });

  test("index.html displays library identity elements", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("lib-name");
    expect(html).toContain("lib-version");
  });
});
