import { describe, test, expect } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";


describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should terminate without error", () => {
    // Pass an empty array to simulate no arguments
    main([]);
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
