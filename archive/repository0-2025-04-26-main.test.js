import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";
import inquirer from "inquirer";


describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Main Output", () => {
  test("should terminate without error when no arguments are provided", async () => {
    const spy = vi.spyOn(console, "log");
    await main([]);
    const output = spy.mock.calls.map(call => call.join(" ")).join("\n");
    expect(output).toContain("Available CLI Commands:");
    spy.mockRestore();
  });
});

describe("Help Message", () => {
  test("should display dynamic help message with no arguments", async () => {
    const spy = vi.spyOn(console, "log");
    await main([]);
    const output = spy.mock.calls.map(call => call.join(" ")).join("\n");
    expect(output).toContain("Available CLI Commands:");
    expect(output).toContain("--agentic:");
    expect(output).toContain("--cli-utils:");
    spy.mockRestore();
  });

  test("should display dynamic help message with --help flag", async () => {
    const spy = vi.spyOn(console, "log");
    await main(["--help"]);
    const output = spy.mock.calls.map(call => call.join(" ")).join("\n");
    expect(output).toContain("Available CLI Commands:");
    expect(output).toContain("--simulate-load <ms>:");
    spy.mockRestore();
  });
});

describe("CLI Utils Output (JSON)", () => {
  test("should output JSON formatted list of CLI commands when '--cli-utils' is provided", async () => {
    const spy = vi.spyOn(console, "log");
    await main(["--cli-utils"]);
    const jsonOutput = spy.mock.calls[0][0];
    let parsed;
    try {
      parsed = JSON.parse(jsonOutput);
    } catch (e) {
      parsed = null;
    }
    expect(parsed).not.toBeNull();
    expect(parsed).toHaveProperty("--agentic");
    expect(parsed).toHaveProperty("--cli-utils");
    spy.mockRestore();
  });
});

describe("Interactive Mode", () => {
  test("should output confirmation message after selecting a command via interactive prompt", async () => {
    const promptMock = vi.spyOn(inquirer, "prompt").mockResolvedValue({ selectedCommand: "--agentic" });
    const spyLog = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--interactive"]);
    expect(promptMock).toHaveBeenCalled();
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining("You selected: --agentic"));
    promptMock.mockRestore();
    spyLog.mockRestore();
  });
});

describe("Version and Diagnostics Flags", () => {
  test("should output version info in correct format with --version flag", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--version"]);
    // Expect one call with output like "Version: x.y.z, Timestamp: ISO8601"
    const output = spy.mock.calls[0][0];
    const versionRegex = /^Version: (\d+\.\d+\.\d+(?:-[\w.]+)?), Timestamp: (.+)$/;
    expect(output).toMatch(versionRegex);
    spy.mockRestore();
  });

  test("should output diagnostics info with --diagnostics flag", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--diagnostics"]);
    // There should be multiple log calls
    const calls = spy.mock.calls.map(call => call[0]);
    expect(calls.some(line => line.startsWith("Version:"))).toBe(true);
    expect(calls.some(line => line.startsWith("Timestamp:"))).toBe(true);
    expect(calls.some(line => line.startsWith("Node.js Version:"))).toBe(true);
    expect(calls.some(line => line.startsWith("Platform:"))).toBe(true);
    spy.mockRestore();
  });
});
