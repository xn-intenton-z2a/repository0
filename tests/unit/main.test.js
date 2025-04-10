import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";
import https from 'https';

// Helper to simulate package.json read error using the utils.readFileSyncWrapper
function simulatePkgError() {
  return vi.spyOn(mainModule.utils, "readFileSyncWrapper").mockImplementation(() => {
    throw new Error("Simulated read error");
  });
}

// Helper to simulate https.get responses
function mockHttpsGetSuccess(responseData) {
  return vi.spyOn(https, 'get').mockImplementation((url, callback) => {
    const res = {
      on: (event, handler) => {
        if (event === 'data') {
          handler(responseData);
        } else if (event === 'end') {
          handler();
        }
      }
    };
    callback(res);
    return { on: vi.fn() };
  });
}

function mockHttpsGetError(error) {
  return vi.spyOn(https, 'get').mockImplementation((url, callback) => {
    const req = {
      on: (event, handler) => {
        if (event === 'error') {
          handler(error);
        }
      }
    };
    // Callback not called in error simulation
    return req;
  });
}

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
        "  --pkg-version                Show package version\n" +
        "  --warning-index-mode <value> Set warning index mode (numeric value)\n" +
        "  --diagnostics                Show diagnostic information (Node version, package version, dependencies)\n" +
        "  --json-output                Output CLI response in JSON format with metadata\n" +
        "  --json-extended              Output CLI response in JSON format with extended metadata (includes current working directory and process uptime)\n" +
        "  --verbose, -v                Enable verbose logging for detailed debug information\n" +
        "  --diagnose-nan               Show NaN diagnostic information\n" +
        "  --check-update               Check if a new version is available from the npm registry\n\n" +
        "Note: All CLI flags related to NaN (e.g., --toggle-allow-nan, --allow-nan-inline, --diagnose-nan, --ignore-invalid) are intentionally non-operative per project guidelines and do not affect functionality."
    );
    consoleLogSpy.mockRestore();
  });
});

describe("CLI Package Version Flag", () => {
  test("should display package version when --pkg-version is passed", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["--pkg-version"]);
    const call = consoleLogSpy.mock.calls[0][0];
    expect(call.startsWith("Package version:"), call).toBe(true);
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
    const calls = consoleLogSpy.mock.calls.flat().join(" ");
    expect(calls.includes("Node version:")).toBe(true);
    expect(calls.includes("Package version:" )).toBe(true);
    expect(calls.includes("Dependencies:" )).toBe(true);
    expect(calls.includes("dotenv:" )).toBe(true);
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
    expect(calls.some(msg => typeof msg === 'string' && msg.includes("Verbose Mode Enabled:"))).toBe(true);
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

describe("CLI Package.json Error Handling", () => {
  let exitSpy;
  beforeEach(() => {
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit called'); });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should handle error in --pkg-version gracefully", () => {
    const readSpy = simulatePkgError();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => { main(["--pkg-version"]); }).toThrow("process.exit called");
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load package.json'));
    readSpy.mockRestore();
  });

  test("should output JSON error in --json-output when package.json read fails", () => {
    const readSpy = simulatePkgError();
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    try {
      main(["--json-output"]);
    } catch(e) {}
    const outputArg = consoleLogSpy.mock.calls[0][0];
    let parsed;
    expect(() => { parsed = JSON.parse(outputArg); }).not.toThrow();
    expect(parsed).toHaveProperty('error');
    expect(parsed.error).toContain('Failed to load package.json');
    readSpy.mockRestore();
  });
});

describe("CLI Diagnose NaN", () => {
  test("should output NaN diagnostic information when --diagnose-nan is provided", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["--diagnose-nan"]);
    const calls = consoleLogSpy.mock.calls.map(call => call[0]);
    expect(calls.some(msg => msg === "NaN Diagnostics:")).toBe(true);
    expect(calls.some(msg => msg.includes("NaN directives are intentionally treated as no-ops"))).toBe(true);
    consoleLogSpy.mockRestore();
  });
});

// New tests for --check-update functionality
describe("CLI Check Update", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should indicate up-to-date when current version equals latest version", () => {
    const pkg = { version: "1.4.1-13" };
    // Mock getPkgData to return our pkg
    vi.spyOn(mainModule, 'readFileSyncWrapper').mockReturnValue(JSON.stringify(pkg));
    const responseData = JSON.stringify({ "dist-tags": { latest: "1.4.1-13" } });
    const httpsGetSpy = mockHttpsGetSuccess(responseData);
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    main(["--check-update"]);
    expect(consoleLogSpy).toHaveBeenCalledWith("You are using the latest version: 1.4.1-13");

    httpsGetSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  test("should indicate update available when registry version is newer", () => {
    const pkg = { version: "1.4.1-13" };
    vi.spyOn(mainModule, 'readFileSyncWrapper').mockReturnValue(JSON.stringify(pkg));
    const responseData = JSON.stringify({ "dist-tags": { latest: "1.4.1-14" } });
    const httpsGetSpy = mockHttpsGetSuccess(responseData);
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    main(["--check-update"]);
    expect(consoleLogSpy).toHaveBeenCalledWith("An update is available: current version 1.4.1-13, latest version 1.4.1-14");

    httpsGetSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  test("should handle network error gracefully", () => {
    const pkg = { version: "1.4.1-13" };
    vi.spyOn(mainModule, 'readFileSyncWrapper').mockReturnValue(JSON.stringify(pkg));
    const error = new Error("Simulated network error");
    const httpsGetSpy = mockHttpsGetError(error);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit called'); });
    
    expect(() => { main(["--check-update"]); }).toThrow("process.exit called");
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Network error: Simulated network error"));

    httpsGetSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
