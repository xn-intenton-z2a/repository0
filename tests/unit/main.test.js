import { describe, test, expect } from "vitest";
import { main } from "@src/lib/main.js";

// Helper to capture console.log and console.error output
function captureOutput(fn) {
  let output = "";
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (msg) => { output += msg + "\n"; };
  console.error = (msg) => { output += msg + "\n"; };
  try {
    fn();
  } catch (e) {
    // Catch errors thrown due to missing command arguments or invalid input
  }
  console.log = originalLog;
  console.error = originalError;
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

  test("config show command", () => {
    const output = captureOutput(() => {
      main(["config", "show"]);
    });
    expect(output).toContain("Configuration: using default settings");
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

  test("default parameter when no arguments provided", () => {
    const output = captureOutput(() => {
      try {
        // Call main with no arguments to rely on the default parameter
        main();
      } catch (e) {
        // Expected error due to missing command
      }
    });
    expect(output).toContain("Run with: []");
  });

  test("NaN input displays error message", () => {
    const output = captureOutput(() => {
      try {
        main([NaN]);
      } catch (e) {
        // Expected error due to invalid input
      }
    });
    expect(output).toContain("Invalid input: Expected a valid command, but received NaN");
  });
});
