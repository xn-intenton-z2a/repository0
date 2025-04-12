import { describe, test, expect } from "vitest";
import { main } from "@src/lib/main.js";

// Helper to capture console.log output
function captureOutput(fn) {
  let output = "";
  const originalLog = console.log;
  console.log = (msg) => { output += msg + "\n"; };
  try {
    fn();
  } catch (e) {
    // Catch errors thrown due to missing command arguments
  }
  console.log = originalLog;
  return output;
}

describe("CLI Commands", () => {
  test("diagnostics command", () => {
    const output = captureOutput(() => {
      main(["diagnostics"]);
    });
    expect(output).toContain("Diagnostics: running diagnostics");
  });

  test("version command", () => {
    const output = captureOutput(() => {
      main(["version"]);
    });
    expect(output).toContain("Version 1.4.1-13");
  });

  test("update command", () => {
    const output = captureOutput(() => {
      main(["update"]);
    });
    expect(output).toContain("Performing update...");
  });

  test("no command provided shows error/help", () => {
    const output = captureOutput(() => {
      try {
        main([]);
      } catch (e) {
        // Expected error due to demandCommand
      }
    });
    expect(output).toContain("You need to specify a valid command");
  });
});
