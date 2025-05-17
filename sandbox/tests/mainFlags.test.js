import { describe, test, expect } from "vitest";
import { spawnSync } from "child_process";
import path from "path";

// Resolve the CLI entrypoint
const cliPath = path.resolve(__dirname, "../source/main.js");
const node = process.execPath;

describe("CLI Flags", () => {
  test.each([
    { args: ["--help"], match: /^Usage:/ },
    { args: ["-h"], match: /^Usage:/ },
  ])("help flag %p", ({ args, match }) => {
    const result = spawnSync(node, [cliPath, ...args], { encoding: "utf-8" });
    expect(result.stdout).toMatch(match);
    expect(result.status).toBe(0);
  });

  test.each([
    { args: ["--version"], match: /^2\.1\.0-0$/ },
    { args: ["-v"], match: /^2\.1\.0-0$/ },
  ])("version flag %p", ({ args, match }) => {
    const result = spawnSync(node, [cliPath, ...args], { encoding: "utf-8" });
    expect(result.stdout.trim()).toMatch(match);
    expect(result.status).toBe(0);
  });

  test("echo arguments", () => {
    const result = spawnSync(node, [cliPath, "foo", "bar"], { encoding: "utf-8" });
    expect(result.stdout.trim()).toBe('Run with: ["foo","bar"]');
    expect(result.status).toBe(0);
  });
});