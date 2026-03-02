// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { main } from "../../src/lib/main.js";

describe("Main CLI", () => {
  let consoleLogs = [];
  let consoleErrors = [];
  let originalConsoleLog;
  let originalConsoleError;
  let originalProcessExit;
  let exitCode;

  beforeEach(() => {
    // Capture console output
    consoleLogs = [];
    consoleErrors = [];
    exitCode = null;
    
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    originalProcessExit = process.exit;
    
    console.log = (...args) => consoleLogs.push(args.join(' '));
    console.error = (...args) => consoleErrors.push(args.join(' '));
    process.exit = (code) => { exitCode = code; };
  });

  afterEach(() => {
    // Restore original functions
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    process.exit = originalProcessExit;
  });

  test("should show help by default with no arguments", () => {
    main([]);
    expect(consoleLogs.some(log => log.includes("@xn-intenton-z2a/repo"))).toBe(true);
    expect(consoleLogs.some(log => log.includes("USAGE:"))).toBe(true);
  });

  test("should show version with --version flag", () => {
    main(["--version"]);
    expect(consoleLogs.some(log => log.includes("@xn-intenton-z2a/repo v"))).toBe(true);
  });

  test("should show version with -v flag", () => {
    main(["-v"]);
    expect(consoleLogs.some(log => log.includes("@xn-intenton-z2a/repo v"))).toBe(true);
  });

  test("should show help with --help flag", () => {
    main(["--help"]);
    expect(consoleLogs.some(log => log.includes("USAGE:"))).toBe(true);
    expect(consoleLogs.some(log => log.includes("COMMANDS:"))).toBe(true);
  });

  test("should show help with -h flag", () => {
    main(["-h"]);
    expect(consoleLogs.some(log => log.includes("USAGE:"))).toBe(true);
  });

  test("should show help with help command", () => {
    main(["help"]);
    expect(consoleLogs.some(log => log.includes("USAGE:"))).toBe(true);
  });

  test("should show version with version command", () => {
    main(["version"]);
    expect(consoleLogs.some(log => log.includes("@xn-intenton-z2a/repo v"))).toBe(true);
  });

  test("should handle start command", () => {
    main(["start"]);
    expect(consoleLogs.some(log => log.includes("🚀 Starting @xn-intenton-z2a/repo"))).toBe(true);
    expect(consoleLogs.some(log => log.includes("Application is running!"))).toBe(true);
  });

  test("should handle unknown command", () => {
    main(["unknown-command"]);
    expect(consoleErrors.some(log => log.includes("Unknown command: unknown-command"))).toBe(true);
    expect(exitCode).toBe(1);
  });

  test("should handle serve command (but not start server in test)", () => {
    // The serve command starts an async server, so we can't easily test it here
    // But we can test that it doesn't throw errors
    expect(() => main(["serve"])).not.toThrow();
  });

  test("should parse complex arguments", () => {
    // Test argument parsing without actually starting server
    main(["serve", "--port", "8080", "--host", "0.0.0.0"]);
    // If it doesn't throw, parsing worked
    expect(exitCode).toBe(null);
  });

  test("should handle mixed flags and commands", () => {
    main(["start", "--verbose"]);
    expect(consoleLogs.some(log => log.includes("🚀 Starting"))).toBe(true);
  });
});
