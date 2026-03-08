// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Website", () => {
  test("src/web/index.html exists", () => {
    expect(existsSync("src/web/index.html")).toBe(true);
  });

  test("index.html contains valid HTML structure and controls", () => {
    const html = readFileSync("src/web/index.html", "utf8");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("id=\"input-n\"");
    expect(html).toContain("id=\"btn-run\"");
    expect(html).toContain("lib-fizz.js");
  });
});
