// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect, vi } from "vitest";
import { plotCLI, main } from "../../src/lib/main.js";

describe("CLI Interface", () => {
  test("should parse command line arguments", async () => {
    // Test help command
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await plotCLI(["--help"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("--expression"));
    consoleSpy.mockRestore();
  });

  test("should support help and version flags", async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    await plotCLI(["--help"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage:"));
    
    consoleSpy.mockRestore();
  });

  test("should validate required arguments", async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    await plotCLI(["--file", "output.svg"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: --expression is required");
    
    consoleErrorSpy.mockRestore();
  });

  test("should handle missing range argument", async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    await plotCLI(["--expression", "y=x", "--file", "output.svg"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: --range is required");
    
    consoleErrorSpy.mockRestore();
  });

  test("should handle missing file argument", async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    await plotCLI(["--expression", "y=x", "--range", "x=-1:1"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: --file is required");
    
    consoleErrorSpy.mockRestore();
  });

  test("should integrate with main function", () => {
    expect(() => main(["--version"])).not.toThrow();
    expect(() => main(["--identity"])).not.toThrow();
    expect(() => main()).not.toThrow();
  });

  test("should detect plotting commands", () => {
    const plotArgs = ["--expression", "y=x", "--range", "x=-1:1", "--file", "test.svg"];
    expect(() => main(plotArgs)).not.toThrow();
  });
});