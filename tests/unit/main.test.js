import { describe, test, expect, vi } from "vitest";
import { main } from "@src/lib/main.js";

describe("Main Module", () => {
  test("should not be null", () => {
    expect(main).not.toBeNull();
  });
});

describe("CLI Behavior", () => {
  test("outputs empty array when no args provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main();
    expect(consoleSpy).toHaveBeenCalledWith("Run with: []");
    consoleSpy.mockRestore();
  });

  test("outputs provided arguments", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--diagnostics"];
    await main(args);
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: ${JSON.stringify(args)}`);
    consoleSpy.mockRestore();
  });

  test("displays help message when --help flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--help"];
    await main(args);
    expect(consoleSpy).toHaveBeenCalledWith("Usage: node src/lib/main.js [--diagnostics] [--help] [--version]");
    consoleSpy.mockRestore();
  });

  test("defaults to empty array when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(null);
    expect(consoleSpy).toHaveBeenCalledWith("Run with: []");
    consoleSpy.mockRestore();
  });

  test("displays version when --version flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--version"]);
    expect(consoleSpy).toHaveBeenCalledWith("Version: 1.3.1-1");
    consoleSpy.mockRestore();
  });
});
