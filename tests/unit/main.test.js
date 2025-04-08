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

// Regular expression to validate ISO timestamp format
const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

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
    expect(consoleSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("Usage: node src/lib/main.js"));
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
    expect(consoleSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("Usage: node src/lib/main.js"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("--diagnostics: Check system diagnostics"));
    consoleSpy.mockRestore();
  });

  test("defaults to usage output when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(null);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("Usage: node src/lib/main.js"));
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
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 1): hello"));
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
      expect(output).toHaveProperty("timestamp");
      expect(typeof output.timestamp).toBe('string');
      expect(isoRegex.test(output.timestamp)).toBe(true);
      expect(output).toHaveProperty("version", "1.4.1-1");
      expect(output).toHaveProperty("executionDuration");
      expect(typeof output.executionDuration).toBe('number');
      expect(output).toHaveProperty("inputEcho");
      expect(output.inputEcho).toEqual(["--sum", "3", "4", "5"]);
      logSpy.mockRestore();
    });

    test("outputs error in JSON format for invalid sum inputs", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--json", "--sum", "NaN", "abc"]);
      const output = tryParseJSON(logSpy.mock.calls[0][0]);
      expect(output).toHaveProperty("command", "sum");
      expect(output).toHaveProperty("error", "Error: No valid numeric inputs provided.");
      expect(output).toHaveProperty("timestamp");
      expect(typeof output.timestamp).toBe('string');
      expect(isoRegex.test(output.timestamp)).toBe(true);
      expect(output).toHaveProperty("version", "1.4.1-1");
      expect(output).toHaveProperty("executionDuration");
      expect(typeof output.executionDuration).toBe('number');
      expect(output).toHaveProperty("inputEcho");
      expect(output.inputEcho).toEqual(["--sum", "NaN", "abc"]);
      logSpy.mockRestore();
    });

    test("outputs sum in pretty JSON format when --json-pretty is used", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--json-pretty", "--sum", "3", "4", "5"]);
      const outputStr = logSpy.mock.calls[0][0];
      expect(outputStr).toContain("\n");
      const output = JSON.parse(outputStr);
      expect(output).toHaveProperty("command", "sum");
      expect(output).toHaveProperty("result", 12);
      expect(output).toHaveProperty("warnings");
      expect(output.warnings).toEqual([]);
      expect(output).toHaveProperty("timestamp");
      expect(typeof output.timestamp).toBe('string');
      expect(isoRegex.test(output.timestamp)).toBe(true);
      expect(output).toHaveProperty("version", "1.4.1-1");
      expect(output).toHaveProperty("executionDuration");
      expect(typeof output.executionDuration).toBe('number');
      expect(output).toHaveProperty("inputEcho");
      expect(output.inputEcho).toEqual(["--sum", "3", "4", "5"]);
      logSpy.mockRestore();
    });
  });

  // New test for various casings of 'NaN' inputs
  test("handles various casings of 'NaN' inputs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main(["--sum", "nAn", "NaN", "NAN", "10"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("10"));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 0): nAn"));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 0): NaN"));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 0): NAN"));
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  // New test to verify configurable invalid tokens
  test("allows 'NaN' as valid input when not configured as invalid", async () => {
    const originalInvalid = process.env.INVALID_TOKENS;
    process.env.INVALID_TOKENS = "";
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "NaN", "5"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("NaN"));
    logSpy.mockRestore();
    process.env.INVALID_TOKENS = originalInvalid;
  });

  // Tests for the new --config command
  describe("CLI Config Command", () => {
    test("outputs configuration in plain text mode", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--config"]);
      const output = logSpy.mock.calls[0][0];
      expect(output).toContain("Configuration Settings:");
      expect(output).toContain("TOOL_VERSION: 1.4.1-1");
      expect(output).toContain("INVALID_TOKENS:");
      expect(output).toContain("DYNAMIC_WARNING_INDEX:");
      logSpy.mockRestore();
    });

    test("outputs configuration in JSON mode", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--json", "--config"]);
      const output = tryParseJSON(logSpy.mock.calls[0][0]);
      expect(output).toHaveProperty("command", "config");
      expect(output).toHaveProperty("config");
      expect(output.config).toHaveProperty("TOOL_VERSION", "1.4.1-1");
      expect(output.config).toHaveProperty("INVALID_TOKENS");
      expect(output.config).toHaveProperty("DYNAMIC_WARNING_INDEX");
      expect(output).toHaveProperty("timestamp");
      expect(typeof output.timestamp).toBe('string');
      expect(isoRegex.test(output.timestamp)).toBe(true);
      expect(output).toHaveProperty("version", "1.4.1-1");
      expect(output).toHaveProperty("executionDuration");
      expect(typeof output.executionDuration).toBe('number');
      expect(output).toHaveProperty("inputEcho");
      expect(output.inputEcho).toEqual(["--config"]);
      logSpy.mockRestore();
    });
  });

  // New tests for Dynamic Warning Index Option
  describe("Dynamic Warning Index Option", () => {
    test("uses dynamic index when enabled", async () => {
      process.env.DYNAMIC_WARNING_INDEX = "true";
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await main(["--sum", "foo", "bar", "5"]);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 0): foo"));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 1): bar"));
      warnSpy.mockRestore();
      delete process.env.DYNAMIC_WARNING_INDEX;
    });

    test("uses fixed index when dynamic flag is disabled", async () => {
      delete process.env.DYNAMIC_WARNING_INDEX;
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await main(["--sum", "foo", "bar", "5"]);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 0): foo"));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 0): bar"));
      warnSpy.mockRestore();
    });
  });
});
