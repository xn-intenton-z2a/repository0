import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";
import https from "https";

// Helper to simulate package.json read error using the utils.readFileSyncWrapper
function simulatePkgError() {
  return vi.spyOn(mainModule.utils, "readFileSyncWrapper").mockImplementation(() => {
    throw new Error("Simulated read error");
  });
}

// Helper to simulate https.get responses
function mockHttpsGetSuccess(responseData) {
  return vi.spyOn(https, "get").mockImplementation((url, callback) => {
    const res = {
      on: (event, handler) => {
        if (event === "data") {
          handler(responseData);
        } else if (event === "end") {
          handler();
        }
      },
    };
    callback(res);
    return { on: vi.fn() };
  });
}

function mockHttpsGetError(error) {
  return vi.spyOn(https, "get").mockImplementation((url, callback) => {
    const req = {
      on: (event, handler) => {
        if (event === "error") {
          handler(error);
        }
      },
    };
    return req;
  });
}

// Tests for subcommand architecture

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Legacy Flags Deprecation", () => {
  test("should display help message with deprecation warning when --help is passed", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--help"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Deprecation Warning: Legacy flag --help is deprecated"),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Usage:"));
    consoleLogSpy.mockRestore();
  });

  test("should display package version with deprecation warning when --pkg-version is passed", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--pkg-version"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Deprecation Warning: Legacy flag --pkg-version is deprecated"),
    );
    const call = consoleLogSpy.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].startsWith("Package version:"),
    );
    expect(call[0]).toMatch(/^Package version:/);
    consoleLogSpy.mockRestore();
  });

  test("should log warning index mode with deprecation warning when --warning-index-mode is provided", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--warning-index-mode", "5"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Deprecation Warning: Legacy flag --warning-index-mode is deprecated"),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith("Warning index mode set to: 5");
    consoleLogSpy.mockRestore();
  });

  test("should keep --diagnose-nan flag non-operative and informational", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--diagnose-nan"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Deprecation Warning: Legacy flag --diagnose-nan is deprecated"),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith("NaN Informational Output:");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "This command is for informational purposes only. Refer to MISSION.md and CONTRIBUTING.md for guidelines.",
    );
    consoleLogSpy.mockRestore();
  });
});

describe("Subcommand: version", () => {
  test("should display package version when subcommand version is used", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["version"]);
    const call = consoleLogSpy.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].startsWith("Package version:"),
    );
    expect(call[0]).toMatch(/^Package version:/);
    consoleLogSpy.mockRestore();
  });
});

describe("Subcommand: diagnostics", () => {
  test("should output diagnostic information", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["diagnostics"]);
    const calls = consoleLogSpy.mock.calls.flat().join(" ");
    expect(calls.includes("Node version:")).toBe(true);
    expect(calls.includes("Package version:")).toBe(true);
    expect(calls.includes("Dependencies:")).toBe(true);
    consoleLogSpy.mockRestore();
  });
});

describe("Subcommand: json", () => {
  test("should output valid JSON with standard metadata", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["json", "extraArg"]);
    expect(consoleLogSpy).toHaveBeenCalled();
    const outputArg = consoleLogSpy.mock.calls[0][0];
    let parsed;
    expect(() => {
      parsed = JSON.parse(outputArg);
    }).not.toThrow();
    expect(parsed).toHaveProperty("arguments");
    expect(parsed).toHaveProperty("metadata");
    expect(parsed.metadata).toHaveProperty("timestamp");
    expect(parsed.metadata).toHaveProperty("nodeVersion");
    expect(parsed.metadata).toHaveProperty("packageVersion");
    expect(parsed.arguments).toContain("json");
    expect(parsed.arguments).toContain("extraArg");
    consoleLogSpy.mockRestore();
  });

  test("should output valid JSON with extended metadata when --extended flag is used", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["json", "--extended", "extraArg"]);
    expect(consoleLogSpy).toHaveBeenCalled();
    const outputArg = consoleLogSpy.mock.calls[0][0];
    let parsed;
    expect(() => {
      parsed = JSON.parse(outputArg);
    }).not.toThrow();
    expect(parsed).toHaveProperty("arguments");
    expect(parsed).toHaveProperty("metadata");
    const meta = parsed.metadata;
    expect(meta).toHaveProperty("timestamp");
    expect(meta).toHaveProperty("nodeVersion");
    expect(meta).toHaveProperty("packageVersion");
    expect(meta).toHaveProperty("cwd");
    expect(meta).toHaveProperty("uptime");
    expect(parsed.arguments).toContain("json");
    expect(parsed.arguments).toContain("--extended");
    expect(parsed.arguments).toContain("extraArg");
    consoleLogSpy.mockRestore();
  });
});

describe("Subcommand: verbose", () => {
  test("should display verbose logging info when verbose subcommand is used without warning", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["verbose"]);
    const calls = consoleLogSpy.mock.calls.map((call) => call[0]);
    expect(calls.some((msg) => typeof msg === "string" && msg.includes("Verbose Mode Enabled:"))).toBe(true);
    expect(calls.some((msg) => typeof msg === "string" && msg.includes("Parsed Arguments:"))).toBe(true);
    consoleLogSpy.mockRestore();
  });

  test("should set warning index when verbose subcommand is used with --warning", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["verbose", "--warning", "3"]);
    expect(consoleLogSpy).toHaveBeenCalledWith("Warning index mode set to: 3");
    consoleLogSpy.mockRestore();
  });
});

describe("Subcommand: warn", () => {
  test("should set warning index mode when warn subcommand is used", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["warn", "--value", "7"]);
    expect(consoleLogSpy).toHaveBeenCalledWith("Warning index mode set to: 7");
    consoleLogSpy.mockRestore();
  });
});

describe("Subcommand: nan", () => {
  test("should output informational message for nan subcommand", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["nan"]);
    const calls = consoleLogSpy.mock.calls.map((call) => call[0]);
    expect(calls).toContain("NaN Informational Output:");
    expect(calls.some((msg) => msg.includes("informational purposes"))).toBe(true);
    consoleLogSpy.mockRestore();
  });
});

// New tests for subcommand update functionality

describe("Subcommand: update", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should indicate up-to-date when current version equals latest version", async () => {
    const pkg = { version: "1.4.1-13" };
    vi.spyOn(mainModule, "readFileSyncWrapper").mockReturnValue(JSON.stringify(pkg));
    const responseData = JSON.stringify({ "dist-tags": { latest: "1.4.1-13" } });
    const httpsGetSpy = mockHttpsGetSuccess(responseData);
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await main(["update"]);
    expect(consoleLogSpy).toHaveBeenCalledWith("You are using the latest version: 1.4.1-13");

    httpsGetSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  test("should indicate update available when registry version is newer", async () => {
    const pkg = { version: "1.4.1-13" };
    vi.spyOn(mainModule, "readFileSyncWrapper").mockReturnValue(JSON.stringify(pkg));
    const responseData = JSON.stringify({ "dist-tags": { latest: "1.4.1-14" } });
    const httpsGetSpy = mockHttpsGetSuccess(responseData);
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await main(["update"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "An update is available: current version 1.4.1-13, latest version 1.4.1-14",
    );

    httpsGetSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  test("should handle network error gracefully in update subcommand", async () => {
    const pkg = { version: "1.4.1-13" };
    vi.spyOn(mainModule, "readFileSyncWrapper").mockReturnValue(JSON.stringify(pkg));
    const error = new Error("Simulated network error");
    const httpsGetSpy = mockHttpsGetError(error);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(main(["update"])).rejects.toThrow("process.exit called");
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Network error: Simulated network error"));

    httpsGetSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
