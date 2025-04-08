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
      "Usage: node src/lib/main.js [--diagnostics] [--help, -h] [--version] [--greet] [--info] [--sum, -s] [--multiply, -m] [--subtract] [--divide, -d] [--modulo] [--average, -a] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [--log] [--percentile] [--geomean, -g] [numbers...]"
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
      "Usage: node src/lib/main.js [--diagnostics] [--help, -h] [--version] [--greet] [--info] [--sum, -s] [--multiply, -m] [--subtract] [--divide, -d] [--modulo] [--average, -a] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [--log] [--percentile] [--geomean, -g] [numbers...]"
    );
    expect(consoleSpy).toHaveBeenCalledWith("  --diagnostics: Check system diagnostics");
    consoleSpy.mockRestore();
  });

  test("defaults to usage output when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(null);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "Usage: node src/lib/main.js [--diagnostics] [--help, -h] [--version] [--greet] [--info] [--sum, -s] [--multiply, -m] [--subtract] [--divide, -d] [--modulo] [--average, -a] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [--log] [--percentile] [--geomean, -g] [numbers...]()"
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
    expect(warnSpy).toHaveBeenCalledWith(
      "Warning: These inputs were not valid numbers and have been ignored: (position 0): NaN,(position 2): hello"
    );
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

  test("handles 'NaN' input for --sqrt", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sqrt", "NaN"]);
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

  test("computes natural logarithm when --log flag is provided with one valid input", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--log", "10"]);
    const expected = Math.log(10);
    expect(consoleSpy).toHaveBeenCalledWith("Log: " + expected);
    consoleSpy.mockRestore();
  });

  test("computes logarithm with base when --log flag is provided with two valid inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--log", "1000", "10"]);
    const expected = Math.log(1000) / Math.log(10);
    expect(consoleSpy).toHaveBeenCalledWith("Log: " + expected);
    consoleSpy.mockRestore();
  });

  test("returns error when --log is provided with no valid inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--log", "NaN", "abc"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("returns error for --log when input is non-positive", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--log", "-5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Log: Input must be greater than 0");
    consoleSpy.mockRestore();
  });

  test("returns error for --log when base is invalid (equal to 1)", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--log", "10", "1"]);
    expect(consoleSpy).toHaveBeenCalledWith("Log: Base must be greater than 0 and not equal to 1");
    consoleSpy.mockRestore();
  });

  test("returns error for --log when base is non-positive", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--log", "10", "-2"]);
    expect(consoleSpy).toHaveBeenCalledWith("Log: Base must be greater than 0 and not equal to 1");
    consoleSpy.mockRestore();
  });

  test("computes 0th percentile correctly", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--percentile", "0", "2", "4", "6", "8"]);
    expect(consoleSpy).toHaveBeenCalledWith("Percentile: 2");
    consoleSpy.mockRestore();
  });

  test("computes 50th percentile with interpolation correctly", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--percentile", "50", "1", "2", "3", "4"]);
    expect(consoleSpy).toHaveBeenCalledWith("Percentile: 2.5");
    consoleSpy.mockRestore();
  });

  test("computes 100th percentile correctly", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--percentile", "100", "5", "7", "9"]);
    expect(consoleSpy).toHaveBeenCalledWith("Percentile: 9");
    consoleSpy.mockRestore();
  });

  test("returns error when --percentile is provided with insufficient inputs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--percentile", "50"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("returns error when percentile value is out of range (negative)", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--percentile", "-10", "1", "2", "3"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: Percentile must be between 0 and 100.");
    consoleSpy.mockRestore();
  });

  test("returns error when percentile value is out of range (>100)", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--percentile", "110", "1", "2", "3"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: Percentile must be between 0 and 100.");
    consoleSpy.mockRestore();
  });

  test("computes sum using alias -s flag", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["-s", "3", "7"]);
    expect(logSpy).toHaveBeenCalledWith("Sum: 10");
    logSpy.mockRestore();
  });

  test("computes multiplication using alias -m flag", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["-m", "4", "5"]);
    expect(logSpy).toHaveBeenCalledWith("Multiply: 20");
    logSpy.mockRestore();
  });

  test("computes average using alias -a flag", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["-a", "10", "20", "30"]);
    expect(logSpy).toHaveBeenCalledWith("Average: 20");
    logSpy.mockRestore();
  });

  test("computes division using alias -d flag", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["-d", "100", "2"]);
    expect(logSpy).toHaveBeenCalledWith("Divide: 50");
    logSpy.mockRestore();
  });

  test("displays help using alias -h flag", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["-h"]);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "Usage: node src/lib/main.js [--diagnostics] [--help, -h] [--version] [--greet] [--info] [--sum, -s] [--multiply, -m] [--subtract] [--divide, -d] [--modulo] [--average, -a] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [--log] [--percentile] [--geomean, -g] [numbers...]"
    );
    expect(logSpy).toHaveBeenCalledWith("  --diagnostics: Check system diagnostics");
    logSpy.mockRestore();
  });

  test("computes geometric mean when --geomean flag is provided with valid positive numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const expected = Math.pow(36, 1/3);
    await main(["--geomean", "1", "4", "9"]);
    expect(consoleSpy).toHaveBeenCalledWith("Geomean: " + expected);
    consoleSpy.mockRestore();
  });

  test("returns error for --geomean when an input is non-positive", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--geomean", "5", "-3", "10"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: All inputs must be positive for geometric mean.");
    consoleSpy.mockRestore();
  });

  test("returns error for --geomean when no valid numeric inputs are provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--geomean", "NaN", "abc"]);
    expect(consoleSpy).toHaveBeenCalledWith("Error: No valid numeric inputs provided.");
    consoleSpy.mockRestore();
  });

  test("computes geometric mean using alias -g flag", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const expected = Math.pow(36, 1/3);
    await main(["-g", "1", "4", "9"]);
    expect(consoleSpy).toHaveBeenCalledWith("Geomean: " + expected);
    consoleSpy.mockRestore();
  });

  test("handles mixed-case NaN input for --sum", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main(["--sum", "nAn", "5"]);
    expect(logSpy).toHaveBeenCalledWith("Sum: 5");
    expect(warnSpy).toHaveBeenCalledWith(
      "Warning: These inputs were not valid numbers and have been ignored: (position 0): nAn"
    );
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
