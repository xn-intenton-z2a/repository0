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

  test("index.html displays library identity elements and new demo IDs", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("lib-name");
    expect(html).toContain("lib-version");
    expect(html).toContain("hamming-bigint-result");
    expect(html).toContain("hamming-unicode-result");
    expect(html).toContain("mission-status");
    expect(html).toContain("mission-discrepancy");
    expect(html).toContain("Mission status mismatch detected");
  });
});
