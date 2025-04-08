import { describe, test, expect, vi } from "vitest";
import { main, __test } from "../../src/lib/main.js";

// Helper function to parse JSON from output
function tryParseJSON(output) {
  try {
    return JSON.parse(output);
  } catch (e) {
    return null;
  }
}

// Note: The tests remain largely unchanged; the internal CLI handlers have been inlined in the main file.

describe("Main Module", () => {
  test("should not be null", () => {
    expect(main).not.toBeNull();
  });
});

// CLI Behavior tests

describe("CLI Behavior", () => {
  test("displays usage and demo output when no args provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main();
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("Usage: node src/lib/main.js")
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, expect.stringContaining("No CLI arguments provided. Exiting."));
    consoleSpy.mockRestore();
  });

  test("outputs provided arguments for diagnostics", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--diagnostics"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("All systems operational."));
    consoleSpy.mockRestore();
  });

  test("displays help message when --help flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--help"]);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("Usage: node src/lib/main.js")
    );
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("--diagnostics: Check system diagnostics"));
    consoleSpy.mockRestore();
  });

  test("defaults to usage output when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(null);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("Usage: node src/lib/main.js")
    );
    consoleSpy.mockRestore();
  });

  test("outputs generic run message for unknown flags", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--unknown"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Run with:"));
    consoleSpy.mockRestore();
  });

  test("displays greeting message when --greet flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--greet"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Hello, welcome to repository0!"));
    consoleSpy.mockRestore();
  });

  test("computes sum when --sum flag is provided", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "3", "4", "5"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("12"));
    logSpy.mockRestore();
  });

  test("handles non-numeric inputs for --sum flag and explicit NaN resulting in error", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main(["--sum", "NaN", "5", "hello"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("5"));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 0): NaN"));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 2): hello"));
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test("returns error when --sum is provided with only NaN inputs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "NaN", "abc"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Error: No valid numeric inputs provided."));
    logSpy.mockRestore();
  });

  // Additional tests for JSON output mode
  describe("CLI JSON Output Mode", () => {
    test("outputs sum in JSON format", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--json", "--sum", "3", "4", "5"]);
      const output = tryParseJSON(logSpy.mock.calls[0][0]);
      expect(output).toHaveProperty("command", "sum");
      expect(output).toHaveProperty("result", 12);
      expect(output).toHaveProperty("warnings");
      expect(output.warnings).toEqual([]);
      logSpy.mockRestore();
    });

    test("outputs error in JSON format for invalid sum inputs", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--json", "--sum", "NaN", "abc"]);
      const output = tryParseJSON(logSpy.mock.calls[0][0]);
      expect(output).toHaveProperty("command", "sum");
      expect(output).toHaveProperty("error", "Error: No valid numeric inputs provided.");
      logSpy.mockRestore();
    });
  });
});
