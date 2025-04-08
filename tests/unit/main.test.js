import { describe, test, expect, vi } from "vitest";
import { main, __test } from "../../src/lib/main.js";

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
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--info] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [numbers...]"
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "No CLI arguments provided. Exiting.");
    consoleSpy.mockRestore();
  });

  test("outputs provided arguments for diagnostics", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--diagnostics"]);
    expect(consoleSpy).toHaveBeenCalledWith("Diagnostics: All systems operational.");
    consoleSpy.mockRestore();
  });

  test("displays help message when --help flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--help"]);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--info] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [numbers...]"
    );
    expect(consoleSpy).toHaveBeenCalledWith("  --diagnostics: Check system diagnostics");
    consoleSpy.mockRestore();
  });

  test("defaults to usage output when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(null);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--info] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [numbers...]()"
    );
    consoleSpy.mockRestore();
  });

  test("outputs generic run message for unknown flags", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--unknown"]);
    expect(consoleSpy).toHaveBeenCalledWith("Run with: " + JSON.stringify(["--unknown"]));
    consoleSpy.mockRestore();
  });

  test("displays greeting message when --greet flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--greet"]);
    expect(consoleSpy).toHaveBeenCalledWith("Hello, welcome to repository0!");
    consoleSpy.mockRestore();
  });

  test("computes sum when --sum flag is provided", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "3", "4", "5"]);
    expect(logSpy).toHaveBeenCalledWith("Sum: 12");
    logSpy.mockRestore();
  });

  test("handles non-numeric inputs for --sum flag and explicit NaN resulting in error", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main(["--sum", "NaN", "5", "hello"]);
    expect(logSpy).toHaveBeenCalledWith("Sum: 5");
    expect(warnSpy).toHaveBeenCalledWith("Warning: These inputs were not valid numbers and have been ignored: NaN,hello");
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test("returns error when --sum is provided with only NaN inputs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "NaN", "abc"]);
    expect(logSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    logSpy.mockRestore();
  });

  test("computes multiplication when --multiply flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--multiply", "3", "4"]);
    expect(consoleSpy).toHaveBeenCalledWith("Multiply: 12");
    consoleSpy.mockRestore();
  });

  test("returns error for --multiply with only invalid inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--multiply", "NaN"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("computes subtraction when --subtract flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--subtract", "10", "3", "2"]);
    expect(consoleSpy).toHaveBeenCalledWith("Subtract: 5");
    consoleSpy.mockRestore();
  });

  test("computes subtraction when --subtract flag is provided with a single number", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--subtract", "10"]);
    expect(consoleSpy).toHaveBeenCalledWith("Subtract: 10");
    consoleSpy.mockRestore();
  });

  test("returns error for --subtract with only invalid inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--subtract", "NaN"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("computes division when --divide flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--divide", "100", "2", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Divide: 10");
    consoleSpy.mockRestore();
  });

  test("computes division when --divide flag is provided with a single number", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--divide", "42"]);
    expect(consoleSpy).toHaveBeenCalledWith("Divide: 42");
    consoleSpy.mockRestore();
  });

  test("handles non-numeric input for --divide flag and returns error if no valid inputs remain", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main(["--divide", "NaN", "b"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test("handles division by zero with --divide flag", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--divide", "100", "0", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Divide: Division by zero error");
    consoleSpy.mockRestore();
  });

  test("handles division with no numbers provided for --divide flag", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--divide"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("computes modulo when --modulo flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--modulo", "20", "7", "4"]);
    expect(consoleSpy).toHaveBeenCalledWith("Modulo: 2");
    consoleSpy.mockRestore();
  });

  test("returns error for --modulo with less than two valid numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--modulo", "NaN"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("handles modulo division by zero error", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--modulo", "20", "0", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Modulo: Division by zero error");
    consoleSpy.mockRestore();
  });

  test("computes average when --average flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--average", "4", "8", "12"]);
    expect(consoleSpy).toHaveBeenCalledWith("Average: 8");
    consoleSpy.mockRestore();
  });

  test("returns error for --average with no valid inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--average", "NaN", "abc"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("displays version when --version flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--version"]);
    const calls = consoleSpy.mock.calls.map((call) => call[0]);
    const versionCall = calls.find((msg) => msg.startsWith("Version:"));
    expect(versionCall).toBeDefined();
    consoleSpy.mockRestore();
  });

  test("handles version error when package.json cannot be loaded", async () => {
    process.env.FORCE_VERSION_ERROR = "true";
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await main(["--version"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Could not retrieve version: unknown error");
    delete process.env.FORCE_VERSION_ERROR;
    consoleErrorSpy.mockRestore();
  });

  test("executes only the first recognized flag when multiple flags are provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "2", "3", "--greet"]);
    expect(consoleSpy).toHaveBeenCalledWith("Sum: 5");
    expect(consoleSpy).not.toHaveBeenCalledWith("Hello, welcome to repository0!");
    consoleSpy.mockRestore();
  });

  test("computes exponentiation when --power flag is provided with two numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--power", "2", "3"]);
    expect(consoleSpy).toHaveBeenCalledWith("Power: 8");
    consoleSpy.mockRestore();
  });

  test("computes chained exponentiation when --power flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--power", "2", "3", "2"]);
    expect(consoleSpy).toHaveBeenCalledWith("Power: 64");
    consoleSpy.mockRestore();
  });

  test("returns error for --power flag with insufficient valid numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--power", "NaN"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("computes factorial when --factorial flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--factorial", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Factorial: 120");
    consoleSpy.mockRestore();
  });

  test("handles factorial with invalid input (negative number)", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--factorial", "-3"]);
    expect(consoleSpy).toHaveBeenCalledWith("Factorial: Input must be a non-negative integer");
    consoleSpy.mockRestore();
  });

  test("computes factorial correctly for 0", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--factorial", "0"]);
    expect(consoleSpy).toHaveBeenCalledWith("Factorial: 1");
    consoleSpy.mockRestore();
  });

  test("handles factorial with no input", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--factorial"]);
    expect(consoleSpy).toHaveBeenCalledWith("Factorial: Provide a number");
    consoleSpy.mockRestore();
  });

  test("computes square root when --sqrt flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sqrt", "16"]);
    expect(consoleSpy).toHaveBeenCalledWith("Square Root: 4");
    consoleSpy.mockRestore();
  });

  test("computes square root correctly for 0", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sqrt", "0"]);
    expect(consoleSpy).toHaveBeenCalledWith("Square Root: 0");
    consoleSpy.mockRestore();
  });

  test("handles square root with negative input", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sqrt", "-16"]);
    expect(consoleSpy).toHaveBeenCalledWith("Square Root: Negative input error");
    consoleSpy.mockRestore();
  });

  test("handles square root with no input", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sqrt"]);
    expect(consoleSpy).toHaveBeenCalledWith("Square Root: Provide a number");
    consoleSpy.mockRestore();
  });

  test("displays demo output when --demo flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--demo"]);
    expect(consoleSpy).toHaveBeenCalledWith("Demo output: This is a demo execution without network calls.");
    consoleSpy.mockRestore();
  });

  test("displays real call simulation output when --real flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--real"]);
    expect(consoleSpy).toHaveBeenCalledWith("Real call: This feature is not implemented over the wire yet.");
    consoleSpy.mockRestore();
  });

  test("computes range when --range flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--range", "3", "10", "6"]);
    expect(consoleSpy).toHaveBeenCalledWith("Range: 7");
    consoleSpy.mockRestore();
  });

  test("returns error for --range with no valid inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--range", "NaN"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("displays info message when --info flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--info"]);
    const loggedMessage = consoleSpy.mock.calls[0][0];
    expect(loggedMessage).toMatch(/^Repository0 CLI Tool version .+ - .*/);
    consoleSpy.mockRestore();
  });

  test("computes factors when --factors flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--factors", "12"]);
    expect(consoleSpy).toHaveBeenCalledWith("Factors: 1,2,3,4,6,12");
    consoleSpy.mockRestore();
  });

  test("handles factors with no numbers provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--factors"]);
    expect(consoleSpy).toHaveBeenCalledWith("Factors: Provide a non-negative integer");
    consoleSpy.mockRestore();
  });

  test("computes variance when --variance flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--variance", "2", "4", "6"]);
    expect(consoleSpy).toHaveBeenCalledWith("Variance: 2.6666666666666665");
    consoleSpy.mockRestore();
  });

  test("computes variance correctly with a single number (zero variance)", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--variance", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Variance: 0");
    consoleSpy.mockRestore();
  });

  test("computes Fibonacci when --fibonacci flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--fibonacci", "10"]);
    expect(consoleSpy).toHaveBeenCalledWith("Fibonacci: 55");
    consoleSpy.mockRestore();
  });

  test("handles Fibonacci with no input", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--fibonacci"]);
    expect(consoleSpy).toHaveBeenCalledWith("Fibonacci: Provide a non-negative integer");
    consoleSpy.mockRestore();
  });

  test("computes Fibonacci edge case for 0", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--fibonacci", "0"]);
    expect(consoleSpy).toHaveBeenCalledWith("Fibonacci: 0");
    consoleSpy.mockRestore();
  });

  test("computes Fibonacci edge case for 1", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--fibonacci", "1"]);
    expect(consoleSpy).toHaveBeenCalledWith("Fibonacci: 1");
    consoleSpy.mockRestore();
  });

  // New tests for statistical commands
  test("computes median for odd number of elements", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--median", "3", "5", "7"]);
    expect(consoleSpy).toHaveBeenCalledWith("Median: 5");
    consoleSpy.mockRestore();
  });

  test("computes median for even number of elements", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--median", "3", "5", "7", "9"]);
    expect(consoleSpy).toHaveBeenCalledWith("Median: 6");
    consoleSpy.mockRestore();
  });

  test("returns error for --median with no valid inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--median", "NaN", "abc"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("computes mode for a single mode", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--mode", "1", "2", "2", "3"]);
    expect(consoleSpy).toHaveBeenCalledWith("Mode: 2");
    consoleSpy.mockRestore();
  });

  test("computes mode for multiple modes (tie)", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--mode", "1", "1", "2", "2", "3"]);
    const output = consoleSpy.mock.calls[0][0];
    expect(output).toMatch(/1/);
    expect(output).toMatch(/2/);
    consoleSpy.mockRestore();
  });

  test("returns error for --mode with no valid inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--mode", "NaN", "abc"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("computes stddev for given numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    // For numbers [2,4,4,4,5,5,7,9], stddev should be 2
    await main(["--stddev", "2", "4", "4", "4", "5", "5", "7", "9"]);
    expect(consoleSpy).toHaveBeenCalledWith("Stddev: 2");
    consoleSpy.mockRestore();
  });

  test("returns error for --stddev with no valid inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--stddev", "NaN", "xyz"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  // Direct Function Invocation Tests
  describe("Direct Function Invocation", () => {
    test("printUsage should output usage message", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      __test.printUsage(false);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage: node src/lib/main.js"));
      expect(consoleSpy).toHaveBeenCalledWith("No CLI arguments provided. Exiting.");
      consoleSpy.mockRestore();
    });

    test("printHelp should output help message", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      __test.printHelp();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage: node src/lib/main.js"));
      consoleSpy.mockRestore();
    });

    test("gcd helper function from __test works as expected", () => {
      const { gcd } = __test;
      expect(gcd(21, 7)).toBe(7);
    });

    test("lcm helper function from __test works as expected", () => {
      const { lcm } = __test;
      expect(lcm(3, 4)).toBe(12);
    });
  });
});
