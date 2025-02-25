import { describe, test, expect } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

// Ensure that process.exit does not terminate tests
process.env.NODE_ENV = "test";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should display usage and demo output when no arguments are provided", () => {
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (msg) => { output += msg + "\n"; };
    main([]);
    console.log = originalConsoleLog;
    expect(output).toContain("Usage: node src/lib/main.js [options]");
    expect(output).toContain("Demo Output: Run with: []");
  });
});

describe("Help Functionality", () => {
  test("should display help message when --help is passed", () => {
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (msg) => { output += msg; };
    main(["--help"]);
    console.log = originalConsoleLog;
    expect(output).toContain("Usage: node src/lib/main.js [options]");
  });
});

describe("Version Functionality", () => {
  test("should display version info when --version is passed", () => {
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (msg) => { output += msg; };
    main(["--version"]);
    console.log = originalConsoleLog;
    expect(output).toMatch(/Version: \d+\.\d+\.\d+/);
  });
});
