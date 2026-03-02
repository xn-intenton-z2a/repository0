// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect, vi } from "vitest";
import { main } from "../../src/lib/main.js";

// Mock the AgenticLib to avoid external dependencies in tests
vi.mock("../../src/lib/agentic-lib.js", () => ({
  AgenticLib: class MockAgenticLib {
    constructor() {
      this.options = {
        owner: "test-owner",
        repository: "test-repo"
      };
      this.communication = {
        sendMessage: vi.fn().mockResolvedValue(undefined)
      };
    }
    
    initialize = vi.fn().mockResolvedValue(undefined);
    
    createWorkflow = vi.fn().mockResolvedValue({
      id: "test-workflow-id", 
      type: "test",
      branch: { name: "agentic/test-branch" },
      issue: { number: 123 }
    });
  }
}));

describe("Agentic CLI", () => {
  test("should show help when no command provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await main([]);
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Agentic CLI"));
    consoleSpy.mockRestore();
  });

  test("should show help for help command", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await main(["help"]);
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Agentic CLI"));
    consoleSpy.mockRestore();
  });

  test("should handle init command", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await main(["init"]);
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Initializing agentic workflows"));
    consoleSpy.mockRestore();
  });

  test("should handle workflow create command", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await main(["workflow", "create", "review"]);
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Creating review workflow"));
    consoleSpy.mockRestore();
  });

  test("should handle message send command", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await main(["message", "send", "test message"]);
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Sending message"));
    consoleSpy.mockRestore();
  });

  test("should handle status command", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    
    await main(["status"]);
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Status Dashboard"));
    consoleSpy.mockRestore();
  });

  test("should handle unknown command", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const processExitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    
    await main(["unknown"]);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Unknown command"));
    expect(processExitSpy).toHaveBeenCalledWith(1);
    
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
