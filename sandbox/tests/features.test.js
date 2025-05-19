import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import { main } from "../source/main.js";

describe("--features CLI option", () => {
  const featuresDir = path.resolve("sandbox/features");
  let logSpy;
  let errorSpy;
  let exitSpy;
  let fsReadSpy;
  let originalReadFile;

  beforeEach(async () => {
    // ensure features dir exists and is empty
    await fs.mkdir(featuresDir, { recursive: true });
    const existing = await fs.readdir(featuresDir);
    for (const file of existing) {
      await fs.unlink(path.join(featuresDir, file));
    }
    // Spy on console and process.exit
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    // Spy on fs.readFile to return mission text for MISSION.md
    originalReadFile = fs.readFile;
    fsReadSpy = vi.spyOn(fs, "readFile").mockImplementation(async (filePath, encoding) => {
      if (filePath.endsWith("MISSION.md")) {
        return "Dummy mission statement";
      }
      return originalReadFile(filePath, encoding);
    });
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
    fsReadSpy.mockRestore();
  });

  test("lists features from markdown files", async () => {
    await fs.writeFile(path.join(featuresDir, "feat1.md"), "# First Feature\nDetails");
    await fs.writeFile(path.join(featuresDir, "feat2.md"), "# Second Feature\nMore details");
    await main(["--features"]);
    const calls = logSpy.mock.calls.map((args) => args[0]);
    expect(calls[0]).toBe("Dummy mission statement");
    const expected = JSON.stringify([
      { title: "First Feature", description: "Details" },
      { title: "Second Feature", description: "More details" }
    ], null, 2);
    expect(calls[1]).toBe(expected);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("alias -f works the same", async () => {
    await fs.writeFile(path.join(featuresDir, "feat.md"), "# Only Feature");
    await main(["-f"]);
    const calls = logSpy.mock.calls.map((args) => args[0]);
    expect(calls[0]).toBe("Dummy mission statement");
    const expected = JSON.stringify([
      { title: "Only Feature", description: "" }
    ], null, 2);
    expect(calls[1]).toBe(expected);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("empty directory yields empty array", async () => {
    await main(["--features"]);
    const calls = logSpy.mock.calls.map((args) => args[0]);
    expect(calls[0]).toBe("Dummy mission statement");
    expect(calls[1]).toBe(JSON.stringify([], null, 2));
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("error handling on fs error", async () => {
    // mock readdir to throw
    vi.spyOn(fs, "readdir").mockRejectedValue(new Error("oops"));
    await main(["--features"]);
    expect(errorSpy).toHaveBeenCalledWith("Error: oops");
    expect(exitSpy).toHaveBeenCalledWith(1);
    fs.readdir.mockRestore();
  });
});
