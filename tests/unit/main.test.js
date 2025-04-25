import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

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
