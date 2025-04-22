import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { main } from "@src/lib/main.js";

// Helper to capture console.log output
function captureConsole(callback) {
  const originalLog = console.log;
  const logs = [];
  console.log = (...args) => logs.push(args.join(' '));
  try {
    callback();
  } finally {
    console.log = originalLog;
  }
  return logs;
}


describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(main).not.toBeNull();
  });
});


describe("Unit Tests for main() function output", () => {
  test("should output for empty arguments", () => {
    const logs = captureConsole(() => {
      main([]);
    });
    expect(logs[0]).toBe("Run with: []");
  });

  test("should output diagnostics mode for single argument 'diagnostics'", () => {
    const logs = captureConsole(() => {
      main(["diagnostics"]);
    });
    expect(logs[0]).toBe("Diagnostics: System check initiated.");
  });

  test("should output version for single argument 'version'", () => {
    const logs = captureConsole(() => {
      main(["version"]);
    });
    expect(logs[0]).toBe("Version: 2.1.0-0");
  });

  test("should output update check for single argument 'check-update'", () => {
    const logs = captureConsole(() => {
      main(["check-update"]);
    });
    expect(logs[0]).toBe("Update check in progress.");
  });

  test("should log all arguments for multiple arguments", () => {
    const args = ["arg1", "arg2", "arg3"];
    const logs = captureConsole(() => {
      main(args);
    });
    expect(logs[0]).toBe(`Run with: ${JSON.stringify(args)}`);
  });
});


describe("Integration Tests for CLI Invocation via process.argv", () => {
  let originalArgv;

  beforeEach(() => {
    originalArgv = process.argv;
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  test("npm run start (no args) should log usage info", () => {
    process.argv = ["node", "src/lib/main.js"];
    const logs = captureConsole(() => {
      // require the file logic by invoking main with process.argv.slice(2)
      main(process.argv.slice(2));
    });
    expect(logs[0]).toBe("Run with: []");
  });

  test("npm run diagnostics should log diagnostics message", () => {
    process.argv = ["node", "src/lib/main.js", "diagnostics"];
    const logs = captureConsole(() => {
      main(process.argv.slice(2));
    });
    expect(logs[0]).toBe("Diagnostics: System check initiated.");
  });

  test("npm run version should log version info", () => {
    process.argv = ["node", "src/lib/main.js", "version"];
    const logs = captureConsole(() => {
      main(process.argv.slice(2));
    });
    expect(logs[0]).toBe("Version: 2.1.0-0");
  });

  test("npm run check-update should log update check info", () => {
    process.argv = ["node", "src/lib/main.js", "check-update"];
    const logs = captureConsole(() => {
      main(process.argv.slice(2));
    });
    expect(logs[0]).toBe("Update check in progress.");
  });
});


describe("Feature Tests: Simulated real CLI usage scenarios", () => {
  test("Simulate multiple arguments usage via CLI", () => {
    const args = ["hello", "world"];
    const logs = captureConsole(() => {
      main(args);
    });
    expect(logs[0]).toBe(`Run with: ${JSON.stringify(args)}`);
  });
});
