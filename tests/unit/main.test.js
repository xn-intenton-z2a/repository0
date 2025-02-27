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
    expect(consoleSpy).toHaveBeenNthCalledWith(1, "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [numbers...]");
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "Demo: No arguments provided. Exiting.");
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
    expect(consoleSpy).toHaveBeenCalledWith(
      "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [numbers...]"
    );
    consoleSpy.mockRestore();
  });

  test("defaults to usage output when non-array argument is passed", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(null);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--sum] [--multiply] [--subtract] [numbers...]");
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "Demo: No arguments provided. Exiting.");
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
    expect(consoleSpy).toHaveBeenCalledWith("Hello, welcome to repository0!");
    consoleSpy.mockRestore();
  });

  test("computes sum when --sum flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--sum", "3", "4", "5"]);
    expect(consoleSpy).toHaveBeenCalledWith("Sum: 12");
    consoleSpy.mockRestore();
  });

  test("computes multiplication when --multiply flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--multiply", "3", "4"]);
    expect(consoleSpy).toHaveBeenCalledWith("Multiply: 12");
    consoleSpy.mockRestore();
  });

  test("computes subtraction when --subtract flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await main(["--subtract", "10", "3", "2"]);
    expect(consoleSpy).toHaveBeenCalledWith("Subtract: 5");
    consoleSpy.mockRestore();
  });

  test("displays version message when --version flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--version"];
    await main(args);
    // Assumes package.json version is "1.3.1-4"
    expect(consoleSpy).toHaveBeenCalledWith("Version: 1.3.1-4");
    consoleSpy.mockRestore();
  });
});
