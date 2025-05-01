import { describe, test, expect, beforeEach, afterAll } from "vitest";
import { main, diagnostics, version, update } from "@src/lib/main.js";

// Helper to capture console output
let consoleOutput = [];
const mockedLog = (output) => consoleOutput.push(output);

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

// New tests for plot command
describe("Plot command", () => {
  beforeEach(() => {
    consoleOutput = [];
    console.log = mockedLog;
  });

  test("valid data input", () => {
    main(["plot", "10,20,30"]);
    const expectedLine1 = "#".repeat(Math.floor((10 / 30) * 40));
    const expectedLine2 = "#".repeat(Math.floor((20 / 30) * 40));
    const expectedLine3 = "#".repeat(Math.floor((30 / 30) * 40));
    expect(consoleOutput).toContain(expectedLine1);
    expect(consoleOutput).toContain(expectedLine2);
    expect(consoleOutput).toContain(expectedLine3);
  });

  test("missing data input", () => {
    main(["plot"]);
    expect(consoleOutput.join(" ")).toContain("Usage: node src/lib/main.js plot");
  });

  test("invalid data input", () => {
    main(["plot", "a,20,30"]);
    expect(consoleOutput.join(" ")).toContain("Error: Invalid input");
  });
});

// Restore the original console.log after tests
afterAll(() => {
  console.log = originalLog;
});
