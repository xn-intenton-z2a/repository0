import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { cli } from "../source/main.js";
import fs from "fs/promises";
import path from "path";

describe("CLI Mission Option", () => {
  let readFileSpy;
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    readFileSpy = vi.spyOn(fs, "readFile").mockResolvedValue("Mock Mission");
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    readFileSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test("prints mission statement with --mission", async () => {
    await cli(["--mission"]);
    expect(readFileSpy).toHaveBeenCalledWith(path.resolve(process.cwd(), "MISSION.md"), "utf8");
    expect(consoleLogSpy).toHaveBeenCalledWith("Mock Mission");
  });

  test("prints mission statement with -m alias", async () => {
    await cli(["-m"]);
    expect(readFileSpy).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith("Mock Mission");
  });

  test("fallback to default behavior when no mission flag", async () => {
    readFileSpy.mockClear();
    await cli(["arg1", "arg2"]);
    expect(readFileSpy).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(`Run with: ${JSON.stringify(["arg1","arg2"])}`);
  });
});
