import { describe, test, expect } from "vitest";
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
  test("--features displays mission header and feature list", () => {
    const result = spawnSync("node", [cliPath, "--features"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    // verify header and feature indicators
    expect(result.stdout).toContain("# Mission Statement");
    // verify mission summary appears on second line
    const missionContent = fs.readFileSync(path.resolve(process.cwd(), "MISSION.md"), "utf8");
    const missionLines = missionContent.split(/\r?\n/);
    const headerLine = missionLines.find((l) => l.startsWith("# "));
    const summaryParagraph = missionLines
      .slice(missionLines.indexOf(headerLine) + 1)
      .find((l) => l.trim() !== "");
    const outLines = result.stdout.trim().split(/\r?\n/);
    expect(outLines[1]).toBe(summaryParagraph);
    // still lists expected features
    expect(result.stdout).toMatch(/LOG_SCALE/);
    expect(result.stdout).toMatch(/MULTI_PLOT/);
  });

  // further tests ...
});
