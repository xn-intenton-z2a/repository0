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

  test("custom range: --plot sine --range -3.14,3.14 produces correct span", () => {
    const outfile = "plot.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--plot", "sine", "--range", "-3.14,3.14"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    expect(content).toMatch(/-3\.14,/);
    expect(content).toMatch(/3\.14,/);
    fs.unlinkSync(outPath);
  });

  test("custom output: --plot quadratic --output out.svg writes to specified file", () => {
    const outfile = "out.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--plot", "quadratic", "--output", outfile], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    expect(content).toMatch(/<svg[^>]*>/);
    expect(content).toMatch(/<polyline[^>]*>/);
    fs.unlinkSync(outPath);
  });

  test("error for unsupported function", () => {
    const result = spawnSync("node", [cliPath, "--plot", "unknown"], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unsupported function: unknown");
  });

  // Polar CLI tests
  test("--polar spiral writes default polar.svg with SVG content", () => {
    const outfile = "polar.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--polar", "spiral"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    expect(content).toMatch(/<svg[^>]*>/);
    expect(content).toMatch(/<polyline[^>]*>/);
    fs.unlinkSync(outPath);
  });

  test("custom resolution: --polar spiral --resolution 50", () => {
    const outfile = "polar.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--polar", "spiral", "--resolution", "50"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    const commaCount = (content.match(/,/g) || []).length;
    expect(commaCount).toBe(50);
    fs.unlinkSync(outPath);
  });

  test("custom output: --polar rose --output custom.svg writes to specified file", () => {
    const outfile = "custom.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--polar", "rose", "--output", outfile], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    expect(content).toMatch(/<svg[^>]*>/);
    expect(content).toMatch(/<polyline[^>]*>/);
    fs.unlinkSync(outPath);
  });

  test("error for unsupported polar function", () => {
    const result = spawnSync("node", [cliPath, "--polar", "foo"], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unsupported polar function: foo");
  });

  // mission-full tests
  test("--mission-full displays entire mission statement", () => {
    const result = spawnSync("node", [cliPath, "--mission-full"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(path.resolve(process.cwd(), "MISSION.md"), "utf8");
    expect(result.stdout).toBe(content + "\n");
  });

  test("flag precedence: help over mission-full", () => {
    const result = spawnSync("node", [cliPath, "--mission-full", "--help"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Usage:.+--help.+--version.+--mission/s);
  });

  // New features flag test
  test("--features displays mission header and feature list", () => {
    const result = spawnSync("node", [cliPath, "--features"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("# Mission Statement");
    expect(result.stdout).toMatch(/LOG_SCALE/);
    expect(result.stdout).toMatch(/MULTI_PLOT/);
  });

  // Log-scale CLI tests
  test("--plot sine --range 1,100 --log-scale x transforms x-axis values", () => {
    const outfile = "plot.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--plot", "sine", "--range", "1,100", "--log-scale", "x"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    // x at 1 -> log10(1)=0, y at 1 -> sin(1)
    expect(content).toMatch(/points="0,\s*-?\d+(\.\d+)?/);
    fs.unlinkSync(outPath);
  });

  test("--plot quadratic --range 1,100 --log-scale both transforms both axes", () => {
    const outfile = "plot.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--plot", "quadratic", "--range", "1,100", "--log-scale", "both"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    // both x and y at start = 1 -> log10(1)=0
    expect(content).toMatch(/points="0,0/);
    fs.unlinkSync(outPath);
  });

  test("error for log-scale with non-positive range", () => {
    const result = spawnSync("node", [cliPath, "--plot", "sine", "--range", "0,10", "--log-scale", "x"], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/log-scale values must be positive/);
  });

  // Width and height CLI tests
  test("--plot sine --range 0,1 --width 500 --height 400 produces correct dimensions and viewBox", () => {
    const outfile = "plot.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--plot", "sine", "--range", "0,1", "--width", "500", "--height", "400"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    expect(content).toMatch(/width="500"/);
    expect(content).toMatch(/height="400"/);
    expect(content).toMatch(/viewBox="0 0 1 [0-9\.]+"/);
    fs.unlinkSync(outPath);
  });

  test("default --plot quadratic yields default dimensions and viewBox", () => {
    const outfile = "plot.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--plot", "quadratic"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    expect(content).toMatch(/width="800"/);
    expect(content).toMatch(/height="600"/);
    expect(content).toMatch(/viewBox="0 0 10 100"/);
    fs.unlinkSync(outPath);
  });

  test("--polar spiral --resolution 50 --width 300 --height 300 produces correct dimensions", () => {
    const outfile = "polar.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--polar", "spiral", "--resolution", "50", "--width", "300", "--height", "300"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    expect(content).toMatch(/width="300"/);
    expect(content).toMatch(/height="300"/);
    expect(content).toMatch(/viewBox="[-0-9\.]+ [-0-9\.]+ [0-9\.]+ [0-9\.]+"/);
    fs.unlinkSync(outPath);
  });

  test("default --polar rose yields default dimensions", () => {
    const outfile = "polar.svg";
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync("node", [cliPath, "--polar", "rose"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, "utf8");
    expect(content).toMatch(/width="800"/);
    expect(content).toMatch(/height="600"/);
    fs.unlinkSync(outPath);
  });
});