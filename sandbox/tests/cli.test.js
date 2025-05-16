import { spawnSync } from "child_process";
import { describe, test, expect } from "vitest";

describe("CLI Plot Subcommand", () => {
  test("plot quadratic outputs SVG", () => {
    const result = spawnSync(
      "node",
      ["sandbox/source/main.js", "plot", "quadratic"],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/^<svg/);
    expect(result.stdout).toMatch(/<polyline[^>]*id="quadratic"/);
  });

  test("plot sine outputs SVG", () => {
    const result = spawnSync(
      "node",
      ["sandbox/source/main.js", "plot", "sine"],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/^<svg/);
    expect(result.stdout).toMatch(/<polyline[^>]*id="sine"/);
  });
});
