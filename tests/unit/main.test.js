import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should terminate without error and output an empty array when no args provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main();
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: []`);
    consoleSpy.mockRestore();
  });

  test("should work with provided arguments", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--diagnostics"];
    await main(args);
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: ${JSON.stringify(args)}`);
    consoleSpy.mockRestore();
  });

  test("should display usage message when --help flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--help"];
    await main(args);
    expect(consoleSpy).toHaveBeenCalledWith("Usage: node src/lib/main.js [--diagnostics] [--help] [--version]");
    consoleSpy.mockRestore();
  });

  test("should default to empty array when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    // Passing null, which is not an array, should default to []
    await main(null);
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: []`);
    consoleSpy.mockRestore();
  });

  test("should display version when --version flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--version"]);
    expect(consoleSpy).toHaveBeenCalledWith("Version: 1.3.1-1");
    consoleSpy.mockRestore();
  });
});
