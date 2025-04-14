import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";
import fs from "fs";

const chatHistoryFile = ".chat_history.json";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should terminate without error", () => {
    const consoleSpy = vi.spyOn(console, "log");
    // Passing empty args to get default behavior
    main([]);
    expect(consoleSpy).toHaveBeenCalledWith("Run with: []");
    consoleSpy.mockRestore();
  });
});

describe("Chat Command", () => {
  beforeEach(() => {
    // Remove chat history file if it exists
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
  });

  afterEach(() => {
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
  });

  test("should create chat history with default session when no title is provided", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat"]);
    expect(fs.existsSync(chatHistoryFile)).toBe(true);
    const data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.sessionTitle).toBe("Default Session");
    expect(data.messages.length).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith('Chat message received, session "Default Session" updated.');
    consoleSpy.mockRestore();
  });

  test("should update chat history with provided session title", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "My Session"]);
    expect(fs.existsSync(chatHistoryFile)).toBe(true);
    const data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.sessionTitle).toBe("My Session");
    expect(data.messages.length).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith('Chat message received, session "My Session" updated.');
    consoleSpy.mockRestore();
  });

  test("should append multiple chat messages", () => {
    main(["chat", "Session Test"]);
    main(["chat", "Session Test"]);
    const data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.sessionTitle).toBe("Session Test");
    expect(data.messages.length).toBe(2);
  });

  test("should export chat history in markdown format", () => {
    // First, create a chat history
    main(["chat", "Export Session"]);
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "export", "markdown"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Exporting chat history in markdown format"));
    consoleSpy.mockRestore();
  });

  test("should error on invalid export format", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    main(["chat", "export", "invalidformat"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid export format. Please use one of: markdown, html, pdf, csv.");
    consoleErrorSpy.mockRestore();
  });
});
