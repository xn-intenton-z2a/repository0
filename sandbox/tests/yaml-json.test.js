import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { main } from "../source/main.js";

describe("--yaml2json CLI option", () => {
  let logSpy;
  let errorSpy;
  let exitSpy;
  let tmpDir;

  beforeEach(async () => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "yaml2json-"));
  });

  afterEach(async () => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  test("converts YAML to JSON on stdout", async () => {
    const yamlPath = path.join(tmpDir, "data.yaml");
    await fs.writeFile(yamlPath, "foo: bar\nbaz:\n  - 1\n  - 2");
    await main(["--yaml2json", yamlPath]);
    const expected = JSON.stringify({ foo: "bar", baz: [1, 2] }, null, 2);
    expect(logSpy).toHaveBeenCalledWith(expected);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("writes JSON to output file when --output provided", async () => {
    const yamlPath = path.join(tmpDir, "in.yaml");
    const outPath = path.join(tmpDir, "out.json");
    await fs.writeFile(yamlPath, "alpha: beta");
    await main(["--yaml2json", yamlPath, "--output", outPath]);
    const content = await fs.readFile(outPath, "utf-8");
    expect(content).toBe(JSON.stringify({ alpha: "beta" }, null, 2));
    expect(logSpy).not.toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("error on missing input file", async () => {
    const yamlPath = path.join(tmpDir, "nofile.yaml");
    await main(["--yaml2json", yamlPath]);
    expect(errorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test("error on invalid YAML", async () => {
    const yamlPath = path.join(tmpDir, "bad.yaml");
    await fs.writeFile(yamlPath, "foo: [unclosed");
    await main(["--yaml2json", yamlPath]);
    expect(errorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test("alias -y works same as --yaml2json", async () => {
    const yamlPath = path.join(tmpDir, "alias.yaml");
    await fs.writeFile(yamlPath, "x: y");
    await main(["-y", yamlPath]);
    const expected = JSON.stringify({ x: "y" }, null, 2);
    expect(logSpy).toHaveBeenCalledWith(expected);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
