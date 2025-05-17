import fs from "fs";
import { spawnSync } from "child_process";
import { describe, test, expect } from "vitest";

// Clean up any test output files before running tests
const cleanup = (file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
};

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

describe("CLI Plot Subcommand Optional Flags", () => {
  test("plot quadratic with custom samples outputs SVG", () => {
    const result = spawnSync(
      "node",
      [
        "sandbox/source/main.js",
        "plot",
        "quadratic",
        "--samples",
        "50"
      ],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/^<svg/);
    expect(result.stdout).toMatch(/<polyline[^>]*id="quadratic"/);
  });

  test("plot sine with custom xrange and samples outputs SVG", () => {
    const result = spawnSync(
      "node",
      [
        "sandbox/source/main.js",
        "plot",
        "sine",
        "--xmin",
        "-5",
        "--xmax",
        "5",
        "--samples",
        "50"
      ],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/^<svg/);
    expect(result.stdout).toMatch(/<polyline[^>]*id="sine"/);
  });

  test("plot quadratic writes SVG to file with --output", () => {
    const outFile = "test_output.svg";
    cleanup(outFile);
    const result = spawnSync(
      "node",
      [
        "sandbox/source/main.js",
        "plot",
        "quadratic",
        "--output",
        outFile
      ],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(fs.existsSync(outFile)).toBe(true);
    const content = fs.readFileSync(outFile, "utf-8");
    expect(content).toMatch(/^<svg/);
    expect(content).toMatch(/<polyline[^>]*id="quadratic"/);
    cleanup(outFile);
  });
});

describe("CLI Global Commands", () => {
  test("--help shows usage guide", () => {
    const result = spawnSync(
      "node",
      ["sandbox/source/main.js", "--help"],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/--help \(alias -h\)/);
    expect(result.stdout).toMatch(/--version \(alias -v\)/);
    expect(result.stdout).toMatch(/--mission/);
  });

  test("-h shows usage guide", () => {
    const result = spawnSync(
      "node",
      ["sandbox/source/main.js", "-h"],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/--help \(alias -h\)/);
  });

  test("--version shows version", () => {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    const result = spawnSync(
      "node",
      ["sandbox/source/main.js", "--version"],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(pkg.version);
  });

  test("-v shows version", () => {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    const result = spawnSync(
      "node",
      ["sandbox/source/main.js", "-v"],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(pkg.version);
  });

  test("--mission shows mission statement", () => {
    const mission = fs.readFileSync("MISSION.md", "utf-8");
    const result = spawnSync(
      "node",
      ["sandbox/source/main.js", "--mission"],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('# Mission Statement');
  });

  test("default echo behavior logs arguments", () => {
    const result = spawnSync(
      "node",
      ["sandbox/source/main.js", "foo", "bar"],
      { encoding: "utf-8" }
    );
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('Run with: ["foo","bar"]');
  });
});
