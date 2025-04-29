import { describe, test, expect, beforeEach } from "vitest";
import { main, diagnostics, version, update } from "@src/lib/main.js";

// Helper to capture console output
let consoleOutput = [];
const mockedLog = output => consoleOutput.push(output);

// Backup the original console.log
const originalLog = console.log;

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(main).not.toBeNull();
  });
});

describe("CLI Commands via main()", () => {
  beforeEach(() => {
    consoleOutput = [];
    console.log = mockedLog;
  });

  test("diagnostics command", () => {
    main(["diagnostics"]);
    expect(consoleOutput.join(" ")).toContain("Diagnostics: System check passed");
  });

  test("version command", () => {
    main(["version"]);
    expect(consoleOutput.join(" ")).toContain("Version:");
  });

  test("update command", () => {
    main(["update"]);
    expect(consoleOutput.join(" ")).toContain("Update initiated");
  });

  test("invalid command", () => {
    main(["foo"]);
    expect(consoleOutput.join(" ")).toContain("Invalid command.");
    expect(consoleOutput.join(" ")).toContain("Usage:");
  });

  test("no command provided", () => {
    main([]);
    expect(consoleOutput.join(" ")).toContain("Usage:");
  });
});

describe("Individual CLI exported functions", () => {
  beforeEach(() => {
    consoleOutput = [];
    console.log = mockedLog;
  });

  test("diagnostics function", () => {
    diagnostics();
    expect(consoleOutput.join(" ")).toContain("Diagnostics: System check passed");
  });

  test("version function", () => {
    version();
    expect(consoleOutput.join(" ")).toContain("Version:");
  });

  test("update function", () => {
    update();
    expect(consoleOutput.join(" ")).toContain("Update initiated");
  });
});

// Restore the original console.log after tests
afterAll(() => {
  console.log = originalLog;
});
