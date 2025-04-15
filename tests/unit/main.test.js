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
    main([]);
    expect(consoleSpy).toHaveBeenCalledWith("Run with: []");
    consoleSpy.mockRestore();
  });
});

describe("Chat Command", () => {
  beforeEach(() => {
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

  // Tests for the edit command
  test("should update a chat message with valid edit command", () => {
    main(["chat", "Edit Session"]);
    let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(1);

    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "edit", "0", "updated message content"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages[0].message).toBe("updated message content");
    expect(consoleSpy).toHaveBeenCalledWith("Message at index 0 updated.");
    consoleSpy.mockRestore();
  });

  test("should error when editing with invalid message index", () => {
    main(["chat", "Edit Invalid Index"]);
    const consoleErrorSpy = vi.spyOn(console, "error");
    main(["chat", "edit", "10", "new message"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid message index.");
    consoleErrorSpy.mockRestore();
  });

  test("should error when editing with no chat history available", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
    main(["chat", "edit", "0", "new message"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("No chat history available for editing.");
    consoleErrorSpy.mockRestore();
  });

  // Tests for the edit-last command
  test("should update the last chat message with valid edit-last command", () => {
    main(["chat", "Edit Last Session"]);
    main(["chat", "Edit Last Session"]);
    let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    const consoleSpy = vi.spyOn(console, "log");
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

  // Tests for the delete command
  test("should delete an existing chat message", () => {
    main(["chat", "Delete Session"]);
    main(["chat", "Delete Session"]);
    let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(2);

    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "delete", "0"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith("Message at index 0 deleted.");
    consoleSpy.mockRestore();
  });

  test("should error when deleting with invalid message index", () => {
    main(["chat", "Delete Invalid Index"]);
    const consoleErrorSpy = vi.spyOn(console, "error");
    main(["chat", "delete", "10"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid message index.");
    consoleErrorSpy.mockRestore();
  });

  test("should error when deleting with no chat history available", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
    main(["chat", "delete", "0"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("No chat history available for deletion.");
    consoleErrorSpy.mockRestore();
  });
});

// Tests for the undo command
describe("Undo Command", () => {
  beforeEach(() => {
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
  });

  afterEach(() => {
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
  });

  test("should revert an edit command", () => {
    // Create a session and edit a message
    main(["chat", "Undo Edit Session"]);
    main(["chat", "edit", "0", "edited message"]);
    let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages[0].message).toBe("edited message");
    // Perform undo
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "undo"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    // Should revert to state before edit: original simulated message
    expect(data.messages[0].message).toBe("Simulated chat message received.");
    expect(consoleSpy).toHaveBeenCalledWith("Undo successful.");
    consoleSpy.mockRestore();
  });

  test("should revert a delete command", () => {
    main(["chat", "Undo Delete Session"]);
    main(["chat", "Delete Undo Session"]);
    // Add second message to ensure deletion has effect
    main(["chat", "Delete Undo Session"]);
    let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    const initialCount = data.messages.length;
    // Delete first message
    main(["chat", "delete", "0"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(initialCount - 1);
    // Undo the deletion
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "undo"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(initialCount);
    expect(consoleSpy).toHaveBeenCalledWith("Undo successful.");
    consoleSpy.mockRestore();
  });

  test("should revert an addition (new message) command", () => {
    // Create initial session
    main(["chat", "Undo Addition Session"]);
    let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    const initialCount = data.messages.length;
    // Append new message
    main(["chat", "Undo Addition Session"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(initialCount + 1);
    // Undo the addition
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "undo"]);
    data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    expect(data.messages.length).toBe(initialCount);
    expect(consoleSpy).toHaveBeenCalledWith("Undo successful.");
    consoleSpy.mockRestore();
  });

  test("should error when no backup available for undo", () => {
    // Create a chat history without a backup by writing directly
    const data = { sessionTitle: "No Backup Session", messages: [{ timestamp: new Date().toISOString(), message: "Test message" }] };
    fs.writeFileSync(chatHistoryFile, JSON.stringify(data, null, 2));
    const consoleErrorSpy = vi.spyOn(console, "error");
    main(["chat", "undo"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("No backup available for undo.");
    consoleErrorSpy.mockRestore();
  });
});

// Tests for the search command
describe("Search Command", () => {
  beforeEach(() => {
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
  });

  afterEach(() => {
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
    }
  });

  test("should handle search when no chat history exists", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    main(["chat", "search", "test"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("No chat history available for search.");
    consoleErrorSpy.mockRestore();
  });

  test("should find matching messages with search command", () => {
    const sessionTitle = "Search Test";
    const historyData = {
      sessionTitle: sessionTitle,
      messages: [
        { timestamp: "2021-01-01T00:00:00.000Z", message: "hello world" },
        { timestamp: "2021-01-01T00:01:00.000Z", message: "another message" }
      ]
    };
    fs.writeFileSync(chatHistoryFile, JSON.stringify(historyData, null, 2));
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "search", "hello"]);
    expect(consoleSpy).toHaveBeenCalledWith("2021-01-01T00:00:00.000Z: hello world");
    consoleSpy.mockRestore();
  });

  test("should return no matching messages for search command", () => {
    const sessionTitle = "Search Test";
    const historyData = {
      sessionTitle: sessionTitle,
      messages: [
        { timestamp: "2021-01-01T00:00:00.000Z", message: "hello world" },
        { timestamp: "2021-01-01T00:01:00.000Z", message: "another message" }
      ]
    };
    fs.writeFileSync(chatHistoryFile, JSON.stringify(historyData, null, 2));
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "search", "notfound"]);
    expect(consoleSpy).toHaveBeenCalledWith("No matching messages found.");
    consoleSpy.mockRestore();
  });

  // Tests for the list command
  describe("List Command", () => {
    beforeEach(() => {
      if (fs.existsSync(chatHistoryFile)) {
        fs.unlinkSync(chatHistoryFile);
      }
    });

    afterEach(() => {
      if (fs.existsSync(chatHistoryFile)) {
        fs.unlinkSync(chatHistoryFile);
      }
    });

    test("should output no chat history available when listing and no history exists", () => {
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "list"]);
      expect(consoleSpy).toHaveBeenCalledWith("No chat history available for listing.");
      consoleSpy.mockRestore();
    });

    test("should list all chat messages with proper indexing", () => {
      const historyData = {
        sessionTitle: "List Test",
        messages: [
          { timestamp: "2021-01-01T00:00:00.000Z", message: "first message" },
          { timestamp: "2021-01-01T00:01:00.000Z", message: "second message" }
        ]
      };
      fs.writeFileSync(chatHistoryFile, JSON.stringify(historyData, null, 2));
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "list"]);
      expect(consoleSpy).toHaveBeenCalledWith("[0] 2021-01-01T00:00:00.000Z: first message");
      expect(consoleSpy).toHaveBeenCalledWith("[1] 2021-01-01T00:01:00.000Z: second message");
      consoleSpy.mockRestore();
    });
  });
});
