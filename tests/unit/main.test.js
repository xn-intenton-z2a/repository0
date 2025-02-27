import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should terminate without error and output an empty array when no args provided", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main();
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: []`);
    consoleSpy.mockRestore();
  });

  test("should work with provided arguments", () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--diagnostics"];
    main(args);
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: ${JSON.stringify(args)}`);
    consoleSpy.mockRestore();
  });

  test("should display usage message when --help flag is provided", () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--help"];
    main(args);
    expect(consoleSpy).toHaveBeenCalledWith("Usage: node src/lib/main.js [--diagnostics] [--help]");
    consoleSpy.mockRestore();
  });

  test("should default to empty array when non-array argument is passed", () => {
    const consoleSpy = vi.spyOn(console, "log");
    // Passing null, which is not an array, should default to []
    main(null);
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: []`);
    consoleSpy.mockRestore();
  });
});
