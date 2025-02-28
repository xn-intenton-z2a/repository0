import { describe, test, expect, vi } from "vitest";
import { main } from "@src/lib/main.js";

describe("Main Module", () => {
  test("should not be null", () => {
    expect(main).not.toBeNull();
  });
});

describe("CLI Behavior", () => {
  test("displays usage and demo output when no args provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main();
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [numbers...]`);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, `Demo: No arguments provided. Exiting.`);
    consoleSpy.mockRestore();
  });

  test("outputs provided arguments for diagnostics", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--diagnostics"];
    await main(args);
    expect(consoleSpy).toHaveBeenCalledWith("Diagnostics: All systems operational.");
    consoleSpy.mockRestore();
  });

  test("displays help message when --help flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--help"];
    await main(args);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [numbers...]`);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, `  --diagnostics: Check system diagnostics`);
    expect(consoleSpy).toHaveBeenNthCalledWith(3, `  --help       : Display this help message with flag descriptions`);
    expect(consoleSpy).toHaveBeenNthCalledWith(4, `  --version    : Show current version of the application`);
    expect(consoleSpy).toHaveBeenNthCalledWith(5, `  --greet      : Display a greeting message`);
    expect(consoleSpy).toHaveBeenNthCalledWith(6, `  --sum        : Compute the sum of provided numbers`);
    expect(consoleSpy).toHaveBeenNthCalledWith(7, `  --multiply   : Compute the product of provided numbers`);
    expect(consoleSpy).toHaveBeenNthCalledWith(8, `  --subtract   : Subtract each subsequent number from the first provided number`);
    expect(consoleSpy).toHaveBeenNthCalledWith(9, `  --divide     : Divide the first number by each of the subsequent numbers sequentially`);
    expect(consoleSpy).toHaveBeenNthCalledWith(10, `  --modulo     : Compute the modulo of provided numbers (first % second % ...)`);
    consoleSpy.mockRestore();
  });

  test("defaults to usage output when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(null);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [numbers...]`);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, `Demo: No arguments provided. Exiting.`);
    consoleSpy.mockRestore();
  });

  test("outputs generic run message for unknown flags", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--unknown"];
    await main(args);
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: ${JSON.stringify(args)}`);
    consoleSpy.mockRestore();
  });

  test("displays greeting message when --greet flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--greet"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Hello, welcome to repository0!`);
    consoleSpy.mockRestore();
  });

  test("computes sum when --sum flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--sum", "3", "4", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Sum: 12`);
    consoleSpy.mockRestore();
  });

  test("handles non-numeric inputs for --sum flag", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--sum", "a", "5", "hello"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Sum: 5`);
    consoleSpy.mockRestore();
  });

  test("computes multiplication when --multiply flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--multiply", "3", "4"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Multiply: 12`);
    consoleSpy.mockRestore();
  });

  test("handles multiply with no numbers provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--multiply"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Multiply: 1`);
    consoleSpy.mockRestore();
  });

  test("computes subtraction when --subtract flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--subtract", "10", "3", "2"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Subtract: 5`);
    consoleSpy.mockRestore();
  });

  test("computes subtraction when --subtract flag is provided with a single number", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--subtract", "10"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Subtract: 10`);
    consoleSpy.mockRestore();
  });

  test("handles subtract with no numbers provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--subtract"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Subtract: No numbers provided`);
    consoleSpy.mockRestore();
  });

  test("computes division when --divide flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--divide", "100", "2", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Divide: 10`);
    consoleSpy.mockRestore();
  });

  test("computes division when --divide flag is provided with a single number", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--divide", "42"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Divide: 42`);
    consoleSpy.mockRestore();
  });

  test("handles non-numeric input for --divide flag", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--divide", "10", "b", "2"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Divide: 5`);
    consoleSpy.mockRestore();
  });

  test("handles division by zero with --divide flag", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--divide", "100", "0", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Divide: Division by zero error`);
    consoleSpy.mockRestore();
  });

  test("handles division with no numbers provided for --divide flag", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--divide"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Divide: No numbers provided`);
    consoleSpy.mockRestore();
  });

  test("displays version message when --version flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--version"];
    await main(args);
    expect(consoleSpy).toHaveBeenCalledWith(`Version: 1.3.1-5`);
    consoleSpy.mockRestore();
  });

  test("computes modulo when --modulo flag is provided with multiple numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--modulo", "20", "7", "4"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Modulo: 2`);
    consoleSpy.mockRestore();
  });

  test("handles modulo with less than two numbers", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--modulo", "10"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Modulo: Provide at least two numbers`);
    consoleSpy.mockRestore();
  });

  test("handles modulo division by zero error", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--modulo", "20", "0", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Modulo: Division by zero error`);
    consoleSpy.mockRestore();
  });

  test("handles non-numeric input for --modulo flag", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--modulo", "10", "b", "3"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Modulo: 1`);
    consoleSpy.mockRestore();
  });
});
