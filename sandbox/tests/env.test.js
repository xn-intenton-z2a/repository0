import { describe, test, expect } from "vitest";
import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

const cliPath = path.resolve(__dirname, "../source/main.js");
const node = process.execPath;

describe("env flag", () => {
  test("valid .env file prints sorted KEY=VALUE pairs", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "envtest-"));
    fs.writeFileSync(
      path.join(tmp, ".env"),
      `B=2
A=1`
    );
    const result = spawnSync(node, [cliPath, "--env"], { cwd: tmp, encoding: "utf-8" });
    expect(result.status).toBe(0);
    const lines = result.stdout.trim().split("\n");
    expect(lines).toEqual(["A=1", "B=2"]);
  });

  test("missing .env file returns error", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "envtest-"));
    const result = spawnSync(node, [cliPath, "--env"], { cwd: tmp, encoding: "utf-8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/^Failed to load .env:/);
  });

  test("invalid .env syntax returns error", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "envtest-"));
    fs.writeFileSync(path.join(tmp, ".env"), `INVALID LINE`);
    const result = spawnSync(node, [cliPath, "--env"], { cwd: tmp, encoding: "utf-8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/^Failed to load .env: Invalid syntax/);
  });
});
