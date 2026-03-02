// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect, beforeEach, vi } from "vitest";
import { main } from "../../src/lib/main.js";

// Mock console methods to capture output
let consoleMock;

beforeEach(() => {
  consoleMock = {
    log: vi.spyOn(console, "log").mockImplementation(() => {}),
    error: vi.spyOn(console, "error").mockImplementation(() => {}),
  };
  
  // Mock process.exit to prevent tests from actually exiting
  vi.spyOn(process, "exit").mockImplementation(() => {});
});

describe("Main CLI", () => {
  test("should terminate without error", async () => {
    await main([]);
    expect(consoleMock.log).toHaveBeenCalled();
  });

  test("should display help when --help is passed", async () => {
    await main(["--help"]);
    
    expect(consoleMock.log).toHaveBeenCalledWith(
      expect.stringContaining("Agentic Library CLI")
    );
    expect(consoleMock.log).toHaveBeenCalledWith(
      expect.stringContaining("USAGE:")
    );
  });

  test("should display help when -h is passed", async () => {
    await main(["-h"]);
    
    expect(consoleMock.log).toHaveBeenCalledWith(
      expect.stringContaining("Agentic Library CLI")
    );
  });

  test("should show basic info when no arguments", async () => {
    await main([]);
    
    expect(consoleMock.log).toHaveBeenCalledWith("🤖 Agentic Library CLI");
    expect(consoleMock.log).toHaveBeenCalledWith("Use --help for usage information");
    expect(consoleMock.log).toHaveBeenCalledWith("Use --serve to start HTTP server mode");
  });

  test("should handle invalid command", async () => {
    await main(["invalid-command"]);
    
    expect(consoleMock.error).toHaveBeenCalledWith(
      expect.stringContaining("Unknown command: invalid-command")
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test("should handle init command", async () => {
    await main(["init"]);
    
    expect(consoleMock.log).toHaveBeenCalledWith("🔧 Initializing agentic workflows...");
  });

  test("should handle status command", async () => {
    await main(["status"]);
    
    expect(consoleMock.log).toHaveBeenCalledWith("📊 Workflow Status:");
  });

  test("should handle list command", async () => {
    await main(["list"]);
    
    expect(consoleMock.log).toHaveBeenCalledWith("📋 Available Workflow Types:");
  });

  test("should handle create command with argument", async () => {
    await main(["create", "test-workflow"]);
    
    expect(consoleMock.log).toHaveBeenCalledWith("🔨 Creating test-workflow workflow...");
  });

  test("should error on create command without argument", async () => {
    await main(["create"]);
    
    expect(consoleMock.error).toHaveBeenCalledWith(
      expect.stringContaining("create command requires a workflow type")
    );
  });

  test("should handle send command with message", async () => {
    await main(["send", "test", "message"]);
    
    expect(consoleMock.log).toHaveBeenCalledWith('📤 Sending message: "test message"');
  });

  test("should error on send command without message", async () => {
    await main(["send"]);
    
    expect(consoleMock.error).toHaveBeenCalledWith(
      expect.stringContaining("send command requires a message")
    );
  });

  test("should parse port option correctly", async () => {
    // This will fail to start server but should parse the port
    await main(["--serve", "--port", "8080"]);
    
    // Check that it attempts to start server (will show in logs)
    expect(consoleMock.log).toHaveBeenCalledWith("🔧 Initializing agentic workflows...");
  });

  test("should error on invalid port", async () => {
    await main(["--port", "invalid"]);
    
    expect(consoleMock.error).toHaveBeenCalledWith(
      expect.stringContaining("Port must be a number between 1 and 65535")
    );
  });

  test("should error on port out of range", async () => {
    await main(["--port", "99999"]);
    
    expect(consoleMock.error).toHaveBeenCalledWith(
      expect.stringContaining("Port must be a number between 1 and 65535")
    );
  });

  test("should parse host option correctly", async () => {
    await main(["--host", "0.0.0.0", "status"]);
    
    expect(consoleMock.log).toHaveBeenCalledWith("📊 Workflow Status:");
  });

  test("should handle verbose flag", async () => {
    await main(["--verbose", "status"]);
    
    expect(consoleMock.log).toHaveBeenCalledWith("📊 Workflow Status:");
  });

  test("should handle unknown option", async () => {
    await main(["--unknown-option"]);
    
    expect(consoleMock.error).toHaveBeenCalledWith(
      expect.stringContaining("Unknown option: --unknown-option")
    );
  });
});
