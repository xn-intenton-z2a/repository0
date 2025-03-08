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
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--demo] [--real] [numbers...]",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "Demo: No arguments provided. Exiting.");
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
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--demo] [--real] [numbers...]",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "  --diagnostics: Check system diagnostics");
    expect(consoleSpy).toHaveBeenNthCalledWith(3, "  --help       : Display this help message with flag descriptions");
    expect(consoleSpy).toHaveBeenNthCalledWith(4, "  --version    : Show current version of the application");
    expect(consoleSpy).toHaveBeenNthCalledWith(5, "  --greet      : Display a greeting message");
    expect(consoleSpy).toHaveBeenNthCalledWith(
      6,
      "  --sum        : Compute the sum of provided numbers (arithmetic demonstration)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      7,
      "  --multiply   : Compute the product of provided numbers (arithmetic demonstration)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      8,
      "  --subtract   : Subtract each subsequent number from the first provided number (arithmetic demonstration)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      9,
      "  --divide     : Divide the first number by each of the subsequent numbers sequentially (arithmetic demonstration)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      10,
      "  --modulo     : Compute the modulo of provided numbers (first % second % ... ) (arithmetic demonstration)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      11,
      "  --average    : Compute the arithmetic average of provided numbers (arithmetic demonstration)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      12,
      "  --power      : Compute exponentiation; first number raised to the power of the second, and chain if more numbers provided (arithmetic demonstration)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      13,
      "  --factorial  : Compute the factorial of a provided non-negative integer (arithmetic demonstration)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      14,
      "  --sqrt       : Compute the square root of the provided number (arithmetic demonstration)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      15,
      "  --demo       : Run in demo mode to output sample data without making a network call",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      16,
      "  --real       : Run the real call simulation (feature not implemented over the wire)",
    );
    consoleSpy.mockRestore();
  });

  test("defaults to usage output when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(null);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--demo] [--real] [numbers...]()",
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
    // (2^3) = 8, then 8^2 = 64
    await main(["--power", "2", "3", "2"]);
    expect(consoleSpy).toHaveBeenCalledWith("Power: 64");
    consoleSpy.mockRestore();
  });

  // New tests for factorial and square root
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

  // New tests for demo and real flags
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
});

// Additional tests for internal helper functions to improve test coverage
describe("Internal test helpers (__test)", () => {
  test("getNumbers returns valid numbers", () => {
    const { getNumbers } = __test;
    const args = ["--sum", "3", "foo", "4", "--other"];
    const result = getNumbers(args, "--sum");
    expect(result).toEqual([3, 4]);
  });

  test("printUsage prints usage message", () => {
    const { printUsage } = __test;
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    printUsage(true);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage: node src/lib/main.js"));
    expect(consoleSpy).toHaveBeenCalledWith("Demo: No arguments provided. Exiting.");
    consoleSpy.mockRestore();
  });
});
