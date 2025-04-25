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
  test("should terminate without error when no arguments are provided", () => {
    // This test now expects the help message to be displayed
    const spy = vi.spyOn(console, "log");
    main([]);
    const output = spy.mock.calls.map(call => call.join(" ")).join("\n");
    expect(output).toContain("Available CLI Commands:");
    spy.mockRestore();
  });
});

describe("Help Message", () => {
  test("should display dynamic help message with no arguments", () => {
    const spy = vi.spyOn(console, "log");
    main([]);
    const output = spy.mock.calls.map(call => call.join(" ")).join("\n");
    expect(output).toContain("Available CLI Commands:");
    expect(output).toContain("--agentic:");
    expect(output).toContain("--cli-utils:");
    spy.mockRestore();
  });

  test("should display dynamic help message with --help flag", () => {
    const spy = vi.spyOn(console, "log");
    main(["--help"]);
    const output = spy.mock.calls.map(call => call.join(" ")).join("\n");
    expect(output).toContain("Available CLI Commands:");
    expect(output).toContain("--simulate-load <ms>:");
    spy.mockRestore();
  });
});

describe("CLI Utils Output (JSON)", () => {
  test("should output JSON formatted list of CLI commands when '--cli-utils' is provided", () => {
    const spy = vi.spyOn(console, "log");
    main(["--cli-utils"]);
    // Capture the JSON output
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
