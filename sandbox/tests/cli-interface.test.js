import { describe, test, expect, afterEach } from "vitest";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

describe("CLI Integration Tests", () => {
  const cliPath = path.resolve(process.cwd(), "sandbox/source/main.js");

  test("--help displays usage with help, version, mission", () => {
    const result = spawnSync("node", [cliPath, "--help"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Usage:.+--help.+--version.+--mission/s);
  });

  test("--version displays version from package.json", () => {
    const result = spawnSync("node", [cliPath, "--version"], { encoding: "utf8" });
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8")
    );
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(pkg.version);
  });

  test("--mission displays first header and paragraph from MISSION.md", () => {
    const result = spawnSync("node", [cliPath, "--mission"], { encoding: "utf8" });
    const content = fs.readFileSync(
      path.resolve(process.cwd(), "MISSION.md"),
      "utf8"
    );
    const lines = content.split(/\r?\n/);
    const header = lines.find((l) => l.startsWith("# "));
    const paragraph = lines
      .slice(lines.indexOf(header) + 1)
      .find((l) => l.trim() !== "");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(header);
    expect(result.stdout).toContain(paragraph);
  });

  test("default behavior echoes args in JSON array", () => {
    const args = ["foo", "bar"];
    const result = spawnSync("node", [cliPath, ...args], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(`Run with: ${JSON.stringify(args)}`);
  });

  test("flag precedence: help over version and mission", () => {
    const result = spawnSync("node", [cliPath, "--mission", "--help"], {
      encoding: "utf8"
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Usage:.+--help.+--version.+--mission/s);
  });

  test("--plot quadratic writes default plot.svg with SVG content", () => {
    const outfile = "plot.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--plot", "quadratic"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    expect(content).toMatch(/<svg[^>]*>/);
    expect(content).toMatch(/<polyline[^>]*>/);
    fs.unlinkSync(outPath);
  });

  // Custom range and output tests omitted for brevity...

  // New features flag test
  test("--features displays only feature list", () => {
    // setup: create dummy feature files in sandbox/features
    const featuresDir = path.resolve(process.cwd(), "sandbox/features");
    const featureFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.md'));
    const expected = [
      'MISSION',
      'MISSION-FULL',
      ...featureFiles.map(f => f.replace(/\.md$/, '').toUpperCase())
    ];

    const result = spawnSync("node", [cliPath, "--features"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const outLines = result.stdout.trim().split(/\r?\n/);
    expect(outLines).toEqual(expected);
  });

  // MULTI_PLOT tests
  test("--plots quadratic,sine writes two <polyline> elements", () => {
    const outfile = "plot.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--plots", "quadratic,sine"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    const count = (content.match(/<polyline/g) || []).length;
    expect(count).toBe(2);
    fs.unlinkSync(outPath);
  });

  test("--plots with unsupported function errors", () => {
    const result = spawnSync("node", [cliPath, "--plots", "quadratic,foo"], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/Unsupported function: foo/);
  });

  // further tests ...
});