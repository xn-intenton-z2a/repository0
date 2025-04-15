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

describe("Main Output", () => {
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
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Exporting chat history in markdown format:"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("# Chat History: Export Session"));
    consoleSpy.mockRestore();
  });

  test("should export chat history in html format", () => {
    main(["chat", "HTML Session"]);
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "export", "html"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Exporting chat history in html format:"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("<h1>HTML Session</h1>"));
    consoleSpy.mockRestore();
  });

  test("should export chat history in csv format", () => {
    main(["chat", "CSV Session"]);
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "export", "csv"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Exporting chat history in csv format:"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("timestamp,message"));
    consoleSpy.mockRestore();
  });

  test("should export chat history in pdf format", () => {
    main(["chat", "PDF Session"]);
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "export", "pdf"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Exporting chat history in pdf format:"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("PDF Export"));
    consoleSpy.mockRestore();
  });

  test("should export chat history in json format", () => {
    // First, establish a chat session
    main(["chat", "JSON Session"]);
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "export", "json"]);
    const output = consoleSpy.mock.calls.map(call => call.join(" ")).join(" ");
    expect(output).toContain("Exporting chat history in json format:");
    const jsonStart = output.indexOf('{');
    expect(jsonStart).toBeGreaterThan(-1);
    const jsonString = output.slice(jsonStart);
    const history = JSON.parse(jsonString);
    expect(history).toHaveProperty("sessionTitle", "JSON Session");
    expect(history).toHaveProperty("messages");
    consoleSpy.mockRestore();
  });

  test("should error on invalid export format", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    main(["chat", "export", "invalidformat"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid export format. Please use one of: markdown, html, pdf, csv, json.");
    consoleErrorSpy.mockRestore();
  });

  test("should output no chat history available when stats command is used and no history exists", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "stats"]);
    expect(consoleSpy).toHaveBeenCalledWith("No chat history available.");
    consoleSpy.mockRestore();
  });

  test("should output stats correctly when chat history exists", () => {
    main(["chat", "Stats Session"]);
    const data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "stats"]);
    expect(consoleSpy).toHaveBeenCalledWith(`Session '${data.sessionTitle}' contains ${data.messages.length} messages.`);
    consoleSpy.mockRestore();
  });

  // New tests for the edit command
  test("should update a chat message with valid edit command", () => {
    // Create a session with one message
    main(["chat", "Edit Session"]);
    let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(1);

    const consoleSpy = vi.spyOn(console, "log");
    // Edit the first message
    main(["chat", "edit", "0", "updated message content"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages[0].message).toBe("updated message content");
    expect(consoleSpy).toHaveBeenCalledWith("Message at index 0 updated.");
    consoleSpy.mockRestore();
  });

  test("should error when editing with invalid message index", () => {
    // Create a session with one message
    main(["chat", "Edit Invalid Index"]);
    const consoleErrorSpy = vi.spyOn(console, "error");
    // Attempt to edit non-existent index
    main(["chat", "edit", "10", "new message"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid message index.");
    consoleErrorSpy.mockRestore();
  });

  test("should error when editing with no chat history available", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    // Ensure chat history does not exist
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
    main(["chat", "edit", "0", "new message"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("No chat history available for editing.");
    consoleErrorSpy.mockRestore();
  });

  // New tests for the edit-last command
  test("should update the last chat message with valid edit-last command", () => {
    main(["chat", "Edit Last Session"]);
    // Append another message to ensure there is a last message to edit
    main(["chat", "Edit Last Session"]);
    let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    const lastIndex = data.messages.length - 1;
    const originalMessage = data.messages[lastIndex].message;
    const consoleSpy = vi.spyOn(console, "log");
    // Edit the last message
    main(["chat", "edit-last", "updated last message"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages[data.messages.length - 1].message).toBe("updated last message");
    expect(consoleSpy).toHaveBeenCalledWith("Last message updated.");
    consoleSpy.mockRestore();
  });

  test("should error when editing last message with no chat history available", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
    main(["chat", "edit-last", "new message"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("No chat history available for editing.");
    consoleErrorSpy.mockRestore();
  });

  // New tests for the delete command
  test("should delete an existing chat message", () => {
    // Create a session with two messages
    main(["chat", "Delete Session"]);
    main(["chat", "Delete Session"]);
    let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(2);
    
    const consoleSpy = vi.spyOn(console, "log");
    // Delete the first message (index 0)
    main(["chat", "delete", "0"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith("Message at index 0 deleted.");
    consoleSpy.mockRestore();
  });

  test("should error when deleting with invalid message index", () => {
    main(["chat", "Delete Invalid Index"]);
    const consoleErrorSpy = vi.spyOn(console, "error");
    // Attempt to delete non-existent index
    main(["chat", "delete", "10"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid message index.");
    consoleErrorSpy.mockRestore();
  });

  test("should error when deleting with no chat history available", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    // Ensure chat history does not exist
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
    main(["chat", "delete", "0"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("No chat history available for deletion.");
    consoleErrorSpy.mockRestore();
  });
});
