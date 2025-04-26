import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

const expectedHelpKeywords = ["Available commands:", "version", "diagnostics", "help"];

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Main Output", () => {
  test("should print version when version command provided", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main(["version"]);
    expect(consoleSpy).toHaveBeenCalledWith("2.1.0-0");
    consoleSpy.mockRestore();
  });

  test("should print diagnostics JSON when diagnostics command provided", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main(["diagnostics"]);
    const output = consoleSpy.mock.calls[0][0];
    let diagnostics;
    expect(() => {
      diagnostics = JSON.parse(output);
    }).not.toThrow();
    expect(diagnostics).toHaveProperty("nodeVersion");
    expect(diagnostics).toHaveProperty("message", "Diagnostics info: all systems operational");
    consoleSpy.mockRestore();
  });

  test("should print help message when help command provided", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main(["help"]);
    const output = consoleSpy.mock.calls[0][0];
    expectedHelpKeywords.forEach((keyword) => {
      expect(output).toContain(keyword);
    });
    consoleSpy.mockRestore();
  });

  test("should print help message for unrecognized command", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main(["unknown"]);
    const output = consoleSpy.mock.calls[0][0];
    expectedHelpKeywords.forEach((keyword) => {
      expect(output).toContain(keyword);
    });
    consoleSpy.mockRestore();
  });

  test("should print help message when no args provided", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main([]);
    const output = consoleSpy.mock.calls[0][0];
    expectedHelpKeywords.forEach((keyword) => {
      expect(output).toContain(keyword);
    });
    consoleSpy.mockRestore();
  });
});
