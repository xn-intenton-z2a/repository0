import { describe, test, expect, beforeEach, afterEach } from "vitest";
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

  test("should log generic help for unrecognized single argument command", () => {
    const logs = captureConsole(() => {
      main(["unknown"]);
    });
    // Help message should contain valid commands info
    expect(logs[0]).toContain("Valid commands:");
  });

  test("should log all arguments for multiple arguments not matching arithmetic commands", () => {
    const args = ["arg1", "arg2", "arg3"];
    const logs = captureConsole(() => {
      main(args);
    });
    expect(logs[0]).toBe(`Run with: ${JSON.stringify(args)}`);
  });
});


describe("Arithmetic Utility Commands", () => {
  test("gcd: should compute the greatest common divisor correctly (48, 180 => 12)", () => {
    const logs = captureConsole(() => {
      main(["gcd", "48", "180"]);
    });
    expect(logs[0]).toBe("12");
  });

  test("lcm: should compute the least common multiple correctly (12, 15 => 60)", () => {
    const logs = captureConsole(() => {
      main(["lcm", "12", "15"]);
    });
    expect(logs[0]).toBe("60");
  });

  test("isprime: should return true for a prime number (17)", () => {
    const logs = captureConsole(() => {
      main(["isprime", "17"]);
    });
    expect(logs[0]).toBe("true");
  });

  test("isprime: should return false for a non-prime number (18)", () => {
    const logs = captureConsole(() => {
      main(["isprime", "18"]);
    });
    expect(logs[0]).toBe("false");
  });

  test("gcd: should display help message when given incorrect number of arguments", () => {
    const logs = captureConsole(() => {
      main(["gcd", "48"]);
    });
    expect(logs[0]).toContain("Valid commands:");
  });

  test("lcm: should display help message when given non-numeric arguments", () => {
    const logs = captureConsole(() => {
      main(["lcm", "a", "b"]);
    });
    expect(logs[0]).toContain("Valid commands:");
  });

  test("isprime: should display help message when given incorrect number of arguments", () => {
    const logs = captureConsole(() => {
      main(["isprime", "17", "extra"]);
    });
    expect(logs[0]).toContain("Valid commands:");
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

  test("Simulate multiple arguments usage via CLI", () => {
    const args = ["hello", "world"];
    const logs = captureConsole(() => {
      main(args);
    });
    expect(logs[0]).toBe(`Run with: ${JSON.stringify(args)}`);
  });
});
