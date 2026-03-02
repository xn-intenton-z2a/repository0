// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect, vi } from "vitest";
import { main } from "../../src/lib/main.js";

// Mock console methods to avoid test output noise
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe("CLI Interface", () => {
  test("should display help when no command provided", async () => {
    await main([]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("🤖 Agentic Lib CLI"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("USAGE:"));
  });

  test("should display help when help command provided", async () => {
    await main(["help"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("🤖 Agentic Lib CLI"));
  });

  test("should display help with --help flag", async () => {
    await main(["--help"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("COMMANDS:"));
  });

  test("should handle unknown commands", async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    
    await main(["unknown-command"]);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Unknown command: unknown-command"));
    expect(exitSpy).toHaveBeenCalledWith(1);
    
    exitSpy.mockRestore();
  });

  test("should parse command line arguments correctly", async () => {
    // Mock the AgenticLib and its methods to avoid actual API calls in tests
    vi.mock("../../src/lib/agentic-lib.js", () => ({
      AgenticLib: vi.fn().mockImplementation(() => ({
        options: { owner: 'test', repository: 'test' },
        initialize: vi.fn().mockResolvedValue({}),
        orchestrator: { activeWorkflows: new Map(), workflowRegistry: new Map() }
      }))
    }));

    await main(["status", "--owner", "testowner", "--repository", "testrepo"]);
    
    // Should not error out and should attempt to show status
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("📊 Agentic System Status"));
  });

  test("should handle create-workflow command with missing type", async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    
    await main(["create-workflow"]);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Workflow type is required"));
    expect(exitSpy).toHaveBeenCalledWith(1);
    
    exitSpy.mockRestore();
  });

  test("should handle send-message command with missing content", async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    
    await main(["send-message"]);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Message content is required"));
    expect(exitSpy).toHaveBeenCalledWith(1);
    
    exitSpy.mockRestore();
  });
});
