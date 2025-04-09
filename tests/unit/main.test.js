import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main, escapeRegex, generateWarning, parseNumbers } from "../../src/lib/main.js";

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
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 0): hello"));
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test("returns error when --sum is provided with only NaN inputs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "NaN", "abc"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Error: No valid numeric inputs provided."));
    logSpy.mockRestore();
  });

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
      expect(output).toHaveProperty("version", "1.4.1-13");
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
      expect(output).toHaveProperty("version", "1.4.1-13");
      expect(output).toHaveProperty("executionDuration");
      expect(typeof output.executionDuration).toBe('number');
      expect(output).toHaveProperty("inputEcho");
      expect(output.inputEcho).toEqual(["--sum", "NaN", "abc"]);
      logSpy.mockRestore();
    });
  });

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

  test("allows 'NaN' as valid input when not configured as invalid", async () => {
    const originalInvalid = process.env.INVALID_TOKENS;
    const originalAllowNan = process.env.ALLOW_NAN;
    process.env.ALLOW_NAN = "true";
    process.env.INVALID_TOKENS = "";
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "NaN", "5"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("NaN"));
    logSpy.mockRestore();
    process.env.INVALID_TOKENS = originalInvalid;
    process.env.ALLOW_NAN = originalAllowNan;
  });

  describe("CLI Config Command", () => {
    test("outputs configuration in plain text mode", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--config"]);
      const output = logSpy.mock.calls[0][0];
      expect(output).toContain("Configuration Settings:");
      expect(output).toContain("TOOL_VERSION: 1.4.1-13");
      expect(output).toContain("INVALID_TOKENS:");
      expect(output).toContain("DYNAMIC_WARNING_INDEX:");
      expect(output).toContain("TOKEN_PUNCTUATION_CONFIG:");
      expect(output).toContain("DISABLE_NAN_SUGGESTION:");
      expect(output).toContain("ALLOW_NAN:");
      expect(output).toContain("inlineAllowNan:");
      logSpy.mockRestore();
    });

    test("outputs configuration in JSON mode", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--json", "--config"]);
      const output = tryParseJSON(logSpy.mock.calls[0][0]);
      expect(output).toHaveProperty("command", "config");
      expect(output).toHaveProperty("config");
      expect(output.config).toHaveProperty("TOOL_VERSION", "1.4.1-13");
      expect(output.config).toHaveProperty("INVALID_TOKENS");
      expect(output.config).toHaveProperty("DYNAMIC_WARNING_INDEX");
      expect(output.config).toHaveProperty("TOKEN_PUNCTUATION_CONFIG");
      expect(output.config).toHaveProperty("DISABLE_NAN_SUGGESTION");
      expect(output.config).toHaveProperty("ALLOW_NAN");
      expect(output.config).toHaveProperty("inlineAllowNan");
      expect(output).toHaveProperty("timestamp");
      expect(typeof output.timestamp).toBe('string');
      expect(isoRegex.test(output.timestamp)).toBe(true);
      expect(output).toHaveProperty("version", "1.4.1-13");
      expect(output).toHaveProperty("executionDuration");
      expect(typeof output.executionDuration).toBe('number');
      expect(output).toHaveProperty("inputEcho");
      expect(output.inputEcho).toEqual(["--config"]);
      logSpy.mockRestore();
    });
  });

  describe("Dynamic Warning Index Option", () => {
    test("uses dynamic index when enabled", async () => {
      process.env.DYNAMIC_WARNING_INDEX = "true";
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await main(["--sum", "foo", "bar", "5"]);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 1): foo"));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(position 2): bar"));
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

  describe("Aggregated Warnings", () => {
    let originalInvalid;
    beforeEach(() => {
      originalInvalid = process.env.INVALID_TOKENS;
      process.env.INVALID_TOKENS = "nan";
    });
    afterEach(() => {
      process.env.INVALID_TOKENS = originalInvalid;
    });
    test("aggregates warnings when --summarize-warnings flag is provided", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await main(["--summarize-warnings", "--sum", "NaN", "NaN", "abc", "abc", "abc", "5"]);
      expect(warnSpy).toHaveBeenCalledTimes(0);
      logSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });

  describe("Configurable Punctuation Stripping", () => {
    let originalTokenPunctuation;
    beforeEach(() => {
      originalTokenPunctuation = process.env.TOKEN_PUNCTUATION_CONFIG;
    });
    afterEach(() => {
      process.env.TOKEN_PUNCTUATION_CONFIG = originalTokenPunctuation;
    });
    test("trims using custom punctuation when TOKEN_PUNCTUATION_CONFIG is set", async () => {
      process.env.TOKEN_PUNCTUATION_CONFIG = "!,?,";
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--sum", "!!10??", "5"]);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("15"));
      logSpy.mockRestore();
    });
    test("applies no trimming when TOKEN_PUNCTUATION_CONFIG is empty string", async () => {
      process.env.TOKEN_PUNCTUATION_CONFIG = "";
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--sum", "  5, ", "5"]);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("5"));
      expect(warnSpy).toHaveBeenCalled();
      logSpy.mockRestore();
      warnSpy.mockRestore();
    });
    test("handles multiple punctuation marks around 'NaN'", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--sum", "!!NaN??", "5"]);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("5"));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("NaN"));
      logSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });

  test("handles edge-case variants of 'NaN' with punctuation and whitespace", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main(["--sum", " NaN ", "NaN,", "NaN?", "5"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("5"));
    expect(warnSpy).toHaveBeenCalledTimes(3);
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  test("rejects 'N aN' with internal whitespace", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main(["--sum", "N aN", "5"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("5"));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("N aN"));
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  test("includes correction suggestion in warning for NaN tokens", async () => {
    const originalDynamic = process.env.DYNAMIC_WARNING_INDEX;
    process.env.DYNAMIC_WARNING_INDEX = "true";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main(["--sum", "NaN", "5"]);
    const warningCall = warnSpy.mock.calls.find(call => call[0].includes("Did you mean to allow NaN values?"));
    expect(warningCall[0]).toContain("Did you mean to allow NaN values?");
    process.env.DYNAMIC_WARNING_INDEX = originalDynamic;
    warnSpy.mockRestore();
  });

  test("suppresses correction suggestion with DISABLE_NAN_SUGGESTION true", async () => {
    const original = process.env.DISABLE_NAN_SUGGESTION;
    process.env.DISABLE_NAN_SUGGESTION = "true";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main(["--sum", "NaN", "5"]);
    const warnings = warnSpy.mock.calls.map(call => call[0]);
    expect(warnings.some(w => w.includes("Did you mean to allow NaN"))).toBe(false);
    process.env.DISABLE_NAN_SUGGESTION = original;
    warnSpy.mockRestore();
  });

  describe("Toggle ALLOW_NAN Command", () => {
    test("toggles ALLOW_NAN from false to true and back", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      process.env.ALLOW_NAN = "false";
      await main(["--toggle-allow-nan"]);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("ALLOW_NAN toggled to true"));
      await main(["--toggle-allow-nan"]);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("ALLOW_NAN toggled to false"));
      logSpy.mockRestore();
    });

    test("affects numeric parsing for NaN tokens appropriately", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      process.env.ALLOW_NAN = "false";
      await main(["--sum", "NaN", "5"]);
      expect(warnSpy).toHaveBeenCalled();
      await main(["--toggle-allow-nan"]);
      await main(["--sum", "NaN", "5"]);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("NaN"));
      logSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });

  describe("Inline Allow NaN Flag", () => {
    test("allows NaN tokens when --allow-nan-inline flag is provided", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await main(["--allow-nan-inline", "--sum", "NaN", "5"]);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("NaN"));
      expect(warnSpy).not.toHaveBeenCalled();
      logSpy.mockRestore();
      warnSpy.mockRestore();
    });

    test("inline flag does not persist across commands", async () => {
      process.env.ALLOW_NAN = "false";
      process.env.INVALID_TOKENS = "nan";
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await main(["--allow-nan-inline", "--sum", "NaN", "5"]);
      await main(["--sum", "NaN", "5"]);
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe("Ignore Invalid Flag", () => {
    test("processes mixed valid and invalid tokens when --ignore-invalid is provided", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--ignore-invalid", "--sum", "10", "abc", "20", "NaN"]);
      // valid tokens: 10 and 20 => sum = 30
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("30"));
      logSpy.mockRestore();
    });

    test("returns warning message (not error) when all tokens are invalid with --ignore-invalid", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--ignore-invalid", "--sum", "abc", "NaN"]);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Warning: All tokens ignored, no valid numeric inputs provided."));
      logSpy.mockRestore();
    });
  });

  describe("CLI Diagnose NaN Command", () => {
    test("outputs diagnostic report in plain text mode with trim indices", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--diagnose-nan", "  NaN ", "10", "abc", "!!NaN??", "N aN"]);
      const output = logSpy.mock.calls[0][0];
      expect(output).toContain("NaN Diagnostic Report:");
      expect(output).toContain("Original:  NaN ");
      expect(output).toContain("TrimStart:");
      expect(output).toContain("TrimEnd:");
      logSpy.mockRestore();
    });

    test("outputs diagnostic report in JSON mode with trim indices", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await main(["--json", "--diagnose-nan", "NaN", "20", "bad token"]);
      const output = tryParseJSON(logSpy.mock.calls[0][0]);
      expect(output).toHaveProperty("command", "diagnose-nan");
      expect(output).toHaveProperty("diagnostics");
      expect(Array.isArray(output.diagnostics)).toBe(true);
      output.diagnostics.forEach(diag => {
        expect(diag).toHaveProperty("trimStart");
        expect(diag).toHaveProperty("trimEnd");
        expect(typeof diag.trimStart).toBe('number');
        expect(typeof diag.trimEnd).toBe('number');
      });
      expect(output).toHaveProperty("timestamp");
      expect(typeof output.timestamp).toBe('string');
      expect(isoRegex.test(output.timestamp)).toBe(true);
      expect(output).toHaveProperty("version", "1.4.1-13");
      expect(output).toHaveProperty("executionDuration");
      expect(typeof output.executionDuration).toBe('number');
      expect(output).toHaveProperty("inputEcho");
      expect(output.inputEcho).toEqual(["--diagnose-nan", "NaN", "20", "bad token"]);
      logSpy.mockRestore();
    });
  });
});

describe("Number Utilities", () => {
  test("escapeRegex escapes special characters", () => {
    const input = "[test]*.?";
    const escaped = escapeRegex(input);
    expect(escaped).toBe("\\[test\\]\\*\\.\\?");
  });

  test("generateWarning returns expected warning for NaN token with suggestion", () => {
    process.env.DISABLE_NAN_SUGGESTION = "false";
    process.env.ALLOW_NAN = "false";
    process.env.DYNAMIC_WARNING_INDEX = "true";
    const warning = generateWarning(1, "NaN");
    expect(warning).toContain("(position 1): NaN");
    expect(warning).toContain("Did you mean to allow NaN values?");
    delete process.env.DYNAMIC_WARNING_INDEX;
  });

  test("parseNumbers handles punctuation and NaN input correctly", () => {
    process.env.ALLOW_NAN = "false";
    process.env.INVALID_TOKENS = "nan";
    const originalTokenPunctuation = process.env.TOKEN_PUNCTUATION_CONFIG;
    process.env.TOKEN_PUNCTUATION_CONFIG = ",.;?!";
    const input = ["  ,10, ", "!!NaN??", "abc"]; 
    const result = parseNumbers(input);
    expect(result.valid).toEqual([10]);
    expect(result.invalid.length).toBeGreaterThan(0);
    process.env.TOKEN_PUNCTUATION_CONFIG = originalTokenPunctuation;
  });
});
