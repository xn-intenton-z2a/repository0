/* eslint-disable sonarjs/no-os-command-from-path */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import { readFileSync } from "fs";
import path from "path";
import os from "os";
import { spawnSync } from "child_process";
import { main } from "../source/main.js";

describe("CLI entrypoint", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("displays help with --help and -h alias", async () => {
    await main(["--help"]);
    // Ensure help includes commands list
    const helpOutput = logSpy.mock.calls.map((args) => args[0]).join("\n");
    expect(helpOutput).toContain("Commands:");
    logSpy.mockClear();
    await main(["-h"]);
    const aliasOutput = logSpy.mock.calls.map((args) => args[0]).join("\n");
    expect(aliasOutput).toContain("Commands:");
  });

  test("--version logs version with mocked fs", async () => {
    const fsReadSpy = vi.spyOn(fs, "readFile").mockResolvedValueOnce('{"version":"1.2.3"}');
    await main(["--version"]);
    expect(logSpy).toHaveBeenCalledWith("1.2.3");
    fsReadSpy.mockRestore();
  });

  test("--version logs version reading real package.json", async () => {
    const originalCwd = process.cwd();
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "repo-"));
    const pkgPath = path.join(tmpDir, "package.json");
    await fs.writeFile(pkgPath, JSON.stringify({ version: "9.9.9" }));
    process.chdir(tmpDir);
    await main(["--version"]);
    expect(logSpy).toHaveBeenCalledWith("9.9.9");
    process.chdir(originalCwd);
  });

  test("echo prints message", async () => {
    await main(["echo", "hello", "world"]);
    expect(logSpy).toHaveBeenCalledWith("hello world");
  });

  test("unknown command falls back to help", async () => {
    await main(["foobar"]);
    const fallback = logSpy.mock.calls[0][0];
    expect(fallback).toContain("Usage:");
  });

  describe("E2E via child_process", () => {
    test("node main --help outputs help header", () => {
      const result = spawnSync("node", ["sandbox/source/main.js", "--help"], { encoding: "utf-8" });
      expect(result.stdout).toContain("Usage:");
    });

    test("node main --version outputs version", () => {
      const rootPkg = JSON.parse(readFileSync(path.resolve("package.json"), "utf-8"));
      const result = spawnSync("node", ["sandbox/source/main.js", "--version"], { encoding: "utf-8" });
      expect(result.stdout.trim()).toBe(rootPkg.version);
    });
  });

  describe("plot command", () => {
    test("plot quadratic outputs correct points", () => {
      const result = spawnSync("node", ["sandbox/source/main.js", "plot", "quadratic"], { encoding: "utf-8" });
      expect(result.status).toBe(0);
      const parsed = JSON.parse(result.stdout);
      expect(parsed).toEqual([
        { x: -2, y: 4 },
        { x: -1, y: 1 },
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 4 }
      ]);
    });

    test("plot sine outputs correct points", () => {
      const result = spawnSync("node", ["sandbox/source/main.js", "plot", "sine"], { encoding: "utf-8" });
      expect(result.status).toBe(0);
      const parsed = JSON.parse(result.stdout);
      const expectedXs = [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI];
      expect(parsed).toHaveLength(5);
      parsed.forEach((point, idx) => {
        expect(point.x).toBeCloseTo(expectedXs[idx]);
        expect(point.y).toBeCloseTo(Math.sin(expectedXs[idx]));
      });
    });

    test("plot unknown outputs error and exit 1", () => {
      const result = spawnSync("node", ["sandbox/source/main.js", "plot", "foo"], { encoding: "utf-8" });
      expect(result.status).toBe(1);
      expect(result.stderr.trim()).toBe("Unknown function: foo");
    });
  });
});
