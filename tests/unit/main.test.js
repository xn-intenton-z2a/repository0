import { describe, test, expect, beforeEach } from "vitest";
import { main } from "@src/lib/main.js";

// Helper to capture console output
let consoleOutput = [];
const mockedLog = output => consoleOutput.push(output);

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(main).not.toBeNull();
  });
});

describe("CLI Commands", () => {
  beforeEach(() => {
    consoleOutput = [];
    console.log = mockedLog;
  });

  test("diagnostics command", () => {
    main(["diagnostics"]);
    expect(consoleOutput.join(" ")).toContain("Diagnostics: System check passed");
  });

  test("version command", () => {
    // Assuming package.json version is set to something
    main(["version"]);
    expect(consoleOutput.join(" ")).toContain("Version:");
  });

  test("update command", () => {
    main(["update"]);
    expect(consoleOutput.join(" ")).toContain("Update initiated");
  });

  test("invalid command", () => {
    main(["foo"]);
    expect(consoleOutput.join(" ")).toContain("Invalid command");
    expect(consoleOutput.join(" ")).toContain("Usage:");
  });

  test("no command provided", () => {
    main([]);
    expect(consoleOutput.join(" ")).toContain("Usage:");
  });
});
