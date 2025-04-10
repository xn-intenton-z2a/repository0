import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main([]);
  });
});

describe("CLI Help Message", () => {
  test("should display help information when --help is passed", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["--help"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Usage: node main.js [options]\n" +
      "Options:\n" +
      "  --help, -h                   Show help message\n" +
      "  --warning-index-mode <value> Set warning index mode (numeric value)\n" +
      "  --diagnostics                Show diagnostic information (Node version, package version, dependencies)\n\n" +
      "Note: Any NaN directives are intentionally treated as no-ops per project guidelines."
    );
    consoleLogSpy.mockRestore();
  });
});

describe("CLI Warning Index Mode", () => {
  test("should log warning index message when flag and valid number provided", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["--warning-index-mode", "5"]);
    expect(consoleLogSpy).toHaveBeenCalledWith("Warning index mode set to: 5");
    consoleLogSpy.mockRestore();
  });
});

describe("CLI Diagnostics", () => {
  test("should output diagnostic information when --diagnostics is provided", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["--diagnostics"]);
    const calls = consoleLogSpy.mock.calls.flat();
    // Check that diagnostics info includes Node version
    expect(calls.some(call => call.includes("Node version:"))).toBe(true);
    // Check that diagnostics info includes Package version
    expect(calls.some(call => call.includes("Package version:"))).toBe(true);
    // Check that diagnostics info includes Dependencies header
    expect(calls.some(call => call.includes("Dependencies:"))).toBe(true);
    // Optionally check for one known dependency (e.g., dotenv)
    expect(calls.some(call => call.includes("dotenv:"))).toBe(true);
    consoleLogSpy.mockRestore();
  });
});
