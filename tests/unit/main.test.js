import { describe, test, expect } from "vitest";
import { main } from "@src/lib/main.js";

// Helper to capture console.log and console.error output
function captureOutput(fn) {
  let output = "";
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (msg) => {
    output += msg + "\n";
  };
  console.error = (msg) => {
    output += msg + "\n";
  };
  try {
    fn();
  } catch {
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
    expect(output).toContain("Node.js Version:");
    expect(output).toContain("Package: @xn-intenton-z2a/repository0");
    expect(output).toContain("Dependencies:");
  });

  test("version command", () => {
    const output = captureOutput(() => {
      main(["version"]);
    });
    // The version should match the one in package.json (see package.json for exact value)
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

  test("info command", () => {
    const output = captureOutput(() => {
      main(["info"]);
    });
    // Check for repository metadata: name, version, and description
    expect(output).toContain("Repository: @xn-intenton-z2a/repository0");
    expect(output).toContain("Version: 1.4.1-13");
    expect(output).toContain("Demo repository showcasing agentic‑lib workflows");
  });

  test("no command provided shows error/help", () => {
    const output = captureOutput(() => {
      try {
        main([]);
      } catch {
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
      } catch {
        // Expected error due to missing command
      }
    });
    expect(output).toContain("Run with: []");
  });

  test("NaN input displays error message", () => {
    const output = captureOutput(() => {
      try {
        main([NaN]);
      } catch {
        // Expected error due to invalid input
      }
    });
    expect(output).toContain("Invalid input: Expected a valid string command, but received NaN");
  });

  test("empty string input displays error message", () => {
    const output = captureOutput(() => {
      try {
        main([""]);
      } catch {
        // Expected error due to empty string input
      }
    });
    expect(output).toContain("Invalid input: Expected a non-empty string command, but received an empty string");
  });
});
