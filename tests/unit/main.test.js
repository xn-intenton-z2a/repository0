import { describe, test, expect, vi } from "vitest";
import { main, __test } from "../../src/lib/main.js";

// Module existence test
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
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--info] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [numbers...]"
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
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--info] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [numbers...]"
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "  --diagnostics: Check system diagnostics");
    expect(consoleSpy).toHaveBeenNthCalledWith(3, "  --help       : Display this help message with flag descriptions");
    expect(consoleSpy).toHaveBeenNthCalledWith(4, "  --version    : Show current version of the application");
    expect(consoleSpy).toHaveBeenNthCalledWith(5, "  --greet      : Display a greeting message");
    expect(consoleSpy).toHaveBeenNthCalledWith(6, "  --info       : Display tool version and current date/time");
    expect(consoleSpy).toHaveBeenNthCalledWith(7, "  --sum        : Compute the sum of provided numbers (arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(8, "  --multiply   : Compute the product of provided numbers (arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(9, "  --subtract   : Subtract each subsequent number from the first provided number (arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(10, "  --divide     : Divide the first number by each of the subsequent numbers sequentially (arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(11, "  --modulo     : Compute the modulo of provided numbers (first % second % ... ) (arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(12, "  --average    : Compute the arithmetic average of provided numbers (arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(13, "  --power      : Compute exponentiation; first number raised to the power of the second, and chain if more numbers provided (arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(14, "  --factorial  : Compute the factorial of a provided non-negative integer (arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(15, "  --sqrt       : Compute the square root of the provided number (arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(16, "  --median     : Compute the median of the provided numbers (extended arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(17, "  --mode       : Compute the mode of the provided numbers (extended arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(18, "  --stddev     : Compute the standard deviation of the provided numbers (extended arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(19, "  --range      : Compute the range (max - min) of the provided numbers (extended arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(20, "  --factors    : List all factors of a provided non-negative integer (extended arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(21, "  --variance   : Compute the variance of provided numbers (extended arithmetic demonstration)");
    expect(consoleSpy).toHaveBeenNthCalledWith(22, "  --demo       : Run in demo mode to output sample data without making a network call");
    expect(consoleSpy).toHaveBeenNthCalledWith(23, "  --real       : Run the real call simulation (feature not implemented over the wire)");
    expect(consoleSpy).toHaveBeenNthCalledWith(24, "  --fibonacci  : Compute the nth Fibonacci number (demonstrates sequence generation)");
    consoleSpy.mockRestore();
  });

  test("defaults to usage output when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(null);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--info] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [numbers...]()"
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
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "3", "4", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Sum: 12");
    consoleSpy.mockRestore();
  });

  test("handles non-numeric inputs for --sum flag", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--sum", "a", "5", "hello"]);
    expect(consoleSpy).toHaveBeenCalledWith("Sum: 5");
    consoleSpy.mockRestore();
  });

  test("computes multiplication when --multiply flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--multiply", "3", "4"]);
    expect(consoleSpy).toHaveBeenCalledWith("Multiply: 12");
    consoleSpy.mockRestore();
  });

  test("handles multiply with no numbers provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--multiply"]);
    expect(consoleSpy).toHaveBeenCalledWith("Multiply: 1");
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

  test("handles subtract with no numbers provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--subtract"]);
    expect(consoleSpy).toHaveBeenCalledWith("Subtract: No numbers provided");
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

  test("handles non-numeric input for --divide flag", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--divide", "10", "b", "2"]);
    expect(consoleSpy).toHaveBeenCalledWith("Divide: 5");
    consoleSpy.mockRestore();
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
    expect(consoleSpy).toHaveBeenCalledWith("Divide: No numbers provided");
    consoleSpy.mockRestore();
  });

  test("computes modulo when --modulo flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--modulo", "20", "7", "4"]);
    expect(consoleSpy).toHaveBeenCalledWith("Modulo: 2");
    consoleSpy.mockRestore();
  });

  test("handles modulo with less than two numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--modulo", "10"]);
    expect(consoleSpy).toHaveBeenCalledWith("Modulo: Provide at least two numbers");
    consoleSpy.mockRestore();
  });

  test("handles modulo division by zero error", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--modulo", "20", "0", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Modulo: Division by zero error");
    consoleSpy.mockRestore();
  });

  test("handles non-numeric input for --modulo flag", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--modulo", "10", "b", "3"]);
    expect(consoleSpy).toHaveBeenCalledWith("Modulo: 1");
    consoleSpy.mockRestore();
  });

  test("computes average when --average flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--average", "4", "8", "12"]);
    expect(consoleSpy).toHaveBeenCalledWith("Average: 8");
    consoleSpy.mockRestore();
  });

  test("handles average with no numbers provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--average"]);
    expect(consoleSpy).toHaveBeenCalledWith("Average: No numbers provided");
    consoleSpy.mockRestore();
  });

  test("handles average with non-numeric inputs while ignoring invalid ones", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--average", "5", "abc", "15"]);
    expect(consoleSpy).toHaveBeenCalledWith("Average: 10");
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

  test("handles --power flag with insufficient numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--power", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Power: Provide at least two numbers (base and exponent)");
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

  // Extended operation tests for range
  test("computes range when --range flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--range", "3", "10", "6"]);
    expect(consoleSpy).toHaveBeenCalledWith("Range: 7");
    consoleSpy.mockRestore();
  });

  test("handles range with no numbers provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--range"]);
    expect(consoleSpy).toHaveBeenCalledWith("Range: No numbers provided");
    consoleSpy.mockRestore();
  });

  // Extended operation test for info command
  test("displays info message when --info flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--info"]);
    const loggedMessage = consoleSpy.mock.calls[0][0];
    expect(loggedMessage).toMatch(/^Repository0 CLI Tool version .+ - .*/);
    consoleSpy.mockRestore();
  });

  // Extended operation tests for factors
  test("computes factors when --factors flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    // For number 12, factors should be 1,2,3,4,6,12
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

  // New extended operation tests for variance
  test("computes variance when --variance flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    // For numbers 2, 4, 6: mean = 4; variance = ((2-4)^2 + (4-4)^2 + (6-4)^2) / 3 = (4+0+4)/3
    await main(["--variance", "2", "4", "6"]);
    expect(consoleSpy).toHaveBeenCalledWith("Variance: 2.6666666666666665");
    consoleSpy.mockRestore();
  });

  test("handles variance with no numbers provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--variance"]);
    expect(consoleSpy).toHaveBeenCalledWith("Variance: No numbers provided");
    consoleSpy.mockRestore();
  });

  // New extended operation tests for Fibonacci
  test("computes Fibonacci when --fibonacci flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    // For input 10, Fibonacci should be 55 (F(0)=0, F(1)=1, ..., F(10)=55)
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
});

// Additional tests for internal helper functions and edge cases (__test)

describe("Internal test helpers and edge cases (__test)", () => {
  test("getNumbers returns valid numbers even if zero is provided as string", () => {
    const { getNumbers } = __test;
    const args = ["--sum", "0", "5"];
    const result = getNumbers(args, "--sum");
    expect(result).toEqual([0, 5]);
  });

  test("printUsage prints usage message with non-array flag correctly", () => {
    const { printUsage } = __test;
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    printUsage(true);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage: node src/lib/main.js"));
    expect(consoleSpy).toHaveBeenCalledWith("No CLI arguments provided. Exiting.");
    consoleSpy.mockRestore();
  });

  test("getVersion returns the correct version", () => {
    const { getVersion } = __test;
    const version = getVersion();
    // Assuming package.json version is as defined in the dependencies file
    expect(version).toEqual("1.3.1-11");
  });
});
