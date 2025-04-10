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
        "  --version                    Show package version\n" +
        "  --warning-index-mode <value> Set warning index mode (numeric value)\n" +
        "  --diagnostics                Show diagnostic information (Node version, package version, dependencies)\n" +
        "  --json-output                Output CLI response in JSON format with metadata\n" +
        "  --json-extended              Output CLI response in JSON format with extended metadata (includes current working directory and process uptime)\n" +
        "  --verbose                    Enable verbose logging for detailed debug information\n\n" +
        "Note: Any NaN directives are intentionally treated as no-ops per project guidelines."
    );
    consoleLogSpy.mockRestore();
  });
});

describe("CLI Version Flag", () => {
  test("should display package version when --version is passed", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["--version"]);
    const call = consoleLogSpy.mock.calls[0][0];
    expect(call.startsWith("Package version:"));
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
    expect(calls.some(call => call.includes("Node version:"))).toBe(true);
    expect(calls.some(call => call.includes("Package version:"))).toBe(true);
    expect(calls.some(call => call.includes("Dependencies:"))).toBe(true);
    // Optionally check for one known dependency
    expect(calls.some(call => call.includes("dotenv:"))).toBe(true);
    consoleLogSpy.mockRestore();
  });
});

describe("CLI JSON Output", () => {
  test("should output valid JSON with arguments and metadata when --json-output is provided", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["--json-output", "extraArg"]);
    expect(consoleLogSpy).toHaveBeenCalled();
    const outputArg = consoleLogSpy.mock.calls[0][0];
    let parsed;
    expect(() => { parsed = JSON.parse(outputArg); }).not.toThrow();
    expect(parsed).toHaveProperty('arguments');
    expect(parsed).toHaveProperty('metadata');
    expect(parsed.metadata).toHaveProperty('timestamp');
    expect(parsed.metadata).toHaveProperty('nodeVersion');
    expect(parsed.metadata).toHaveProperty('packageVersion');
    expect(parsed.arguments).toContain("--json-output");
    expect(parsed.arguments).toContain("extraArg");
    consoleLogSpy.mockRestore();
  });
});

describe("CLI Extended JSON Output", () => {
  test("should output valid JSON with extended metadata when --json-extended flag is provided", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["--json-extended", "extraArg"]);
    expect(consoleLogSpy).toHaveBeenCalled();
    const outputArg = consoleLogSpy.mock.calls[0][0];
    let parsed;
    expect(() => { parsed = JSON.parse(outputArg); }).not.toThrow();
    expect(parsed).toHaveProperty('arguments');
    expect(parsed).toHaveProperty('metadata');
    const meta = parsed.metadata;
    expect(meta).toHaveProperty('timestamp');
    expect(meta).toHaveProperty('nodeVersion');
    expect(meta).toHaveProperty('packageVersion');
    expect(meta).toHaveProperty('cwd');
    expect(meta).toHaveProperty('uptime');
    expect(parsed.arguments).toContain("--json-extended");
    expect(parsed.arguments).toContain("extraArg");
    consoleLogSpy.mockRestore();
  });
});

describe("CLI Verbose Logging", () => {
  test("should display verbose debug information when --verbose flag is provided", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["--verbose", "--warning-index-mode", "3"]);
    const calls = consoleLogSpy.mock.calls.map(call => call[0]);
    expect(calls.some(msg => msg === "Verbose Mode Enabled:" || (typeof msg === 'string' && msg.includes("Verbose Mode Enabled:")))).toBe(true);
    expect(calls.some(msg => typeof msg === 'string' && msg.includes("Parsed Arguments:"))).toBe(true);
    expect(calls.some(msg => typeof msg === 'string' && msg.includes("Internal State:"))).toBe(true);
    consoleLogSpy.mockRestore();
  });
});

describe("CLI Environment Variable", () => {
  test("should log CLI_MODE from environment variable if set", () => {
    process.env.CLI_MODE = "TEST_MODE";
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main([]);
    const found = consoleLogSpy.mock.calls.some(call => call[0].includes("Environment CLI_MODE: TEST_MODE"));
    expect(found).toBe(true);
    delete process.env.CLI_MODE;
    consoleLogSpy.mockRestore();
  });
});
