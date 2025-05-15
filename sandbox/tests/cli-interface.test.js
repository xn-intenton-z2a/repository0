import { describe, test, expect } from "vitest";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

describe("CLI Integration Tests", () => {
  const cliPath = path.resolve(process.cwd(), "sandbox/source/main.js");

  test("--help displays usage with help, version, mission", () => {
    const result = spawnSync("node", [cliPath, "--help"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Usage:.*--help.*--version.*--mission/s);
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
    expect(result.stdout).toMatch(/Usage:.*--help.*--version.*--mission/s);
  });
});
