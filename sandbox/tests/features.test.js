import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import { main } from "../source/main.js";

describe("--features CLI option", () => {
  const featuresDir = path.resolve("sandbox/features");
  let logSpy;
  let errorSpy;
  let exitSpy;

  beforeEach(async () => {
    // ensure features dir exists and is empty
    await fs.mkdir(featuresDir, { recursive: true });
    const existing = await fs.readdir(featuresDir);
    for (const file of existing) {
      await fs.unlink(path.join(featuresDir, file));
    }
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("lists features from markdown files", async () => {
    await fs.writeFile(path.join(featuresDir, "feat1.md"), "# First Feature\nDetails");
    await fs.writeFile(path.join(featuresDir, "feat2.md"), "# Second Feature\nMore details");
    await main(["--features"]);
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(["First Feature", "Second Feature"], null, 2));
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("alias -f works the same", async () => {
    await fs.writeFile(path.join(featuresDir, "feat.md"), "# Only Feature");
    await main(["-f"]);
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(["Only Feature"], null, 2));
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("empty directory yields empty array", async () => {
    await main(["--features"]);
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify([], null, 2));
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
