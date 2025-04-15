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
    const output = consoleSpy.mock.calls.map((call) => call.join(" ")).join(" ");
    expect(output).toContain("Exporting chat history in json format:");
    const jsonStart = output.indexOf("{");
    expect(jsonStart).toBeGreaterThan(-1);
    const jsonString = output.slice(jsonStart);
    const history = JSON.parse(jsonString);
    expect(history).toHaveProperty("sessionTitle", "JSON Session");
    expect(history).toHaveProperty("messages");
    consoleSpy.mockRestore();
  });

  test("should export chat history in xml format", () => {
    main(["chat", "XML Session"]);
    const consoleSpy = vi.spyOn(console, "log");
    main(["chat", "export", "xml"]);
    const output = consoleSpy.mock.calls.map((call) => call.join(" ")).join(" ");
    expect(output).toContain("<chatHistory>");
    expect(output).toContain("<sessionTitle>XML Session</sessionTitle>");
    expect(output).toContain("<messages>");
    expect(output).toContain("<message>");
    expect(output).toContain("<timestamp>");
    expect(output).toContain("<content>Simulated chat message received.</content>");
    consoleSpy.mockRestore();
  });

  test("should error on invalid export format", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");
    main(["chat", "export", "invalidformat"]);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Invalid export format. Please use one of: markdown, html, pdf, csv, json, xml."
    );
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
    expect(consoleSpy).toHaveBeenCalledWith(
      `Session '${data.sessionTitle}' contains ${data.messages.length} messages.`
    );
    consoleSpy.mockRestore();
  });

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

  describe("Clear Command", () => {
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
    
    test("should clear the chat history file if it exists", () => {
      const dummyData = {
        sessionTitle: "Dummy Session",
        messages: [{ timestamp: new Date().toISOString(), message: "dummy" }]
      };
      fs.writeFileSync(chatHistoryFile, JSON.stringify(dummyData, null, 2));
      expect(fs.existsSync(chatHistoryFile)).toBe(true);
      
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "clear"]);
      expect(fs.existsSync(chatHistoryFile)).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith("Chat history cleared.");
      consoleSpy.mockRestore();
    });
    
    test("should inform when no chat history exists to clear", () => {
      if (fs.existsSync(chatHistoryFile)) {
        fs.unlinkSync(chatHistoryFile);
      }
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "clear"]);
      expect(consoleSpy).toHaveBeenCalledWith("No chat history to clear.");
      consoleSpy.mockRestore();
    });
  });

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
      main(["chat", "Undo Edit Session"]);
      main(["chat", "edit", "0", "edited message"]);
      let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages[0].message).toBe("edited message");
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "undo"]);
      data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages[0].message).toBe("Simulated chat message received.");
      expect(consoleSpy).toHaveBeenCalledWith("Undo successful.");
      consoleSpy.mockRestore();
    });

    test("should revert a delete command", () => {
      main(["chat", "Undo Delete Session"]);
      main(["chat", "Delete Undo Session"]);
      main(["chat", "Delete Undo Session"]);
      let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      const initialCount = data.messages.length;
      main(["chat", "delete", "0"]);
      data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages.length).toBe(initialCount - 1);
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "undo"]);
      data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages.length).toBe(initialCount);
      expect(consoleSpy).toHaveBeenCalledWith("Undo successful.");
      consoleSpy.mockRestore();
    });

    test("should revert an addition (new message) command", () => {
      main(["chat", "Undo Addition Session"]);
      let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      const initialCount = data.messages.length;
      main(["chat", "Undo Addition Session"]);
      data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages.length).toBe(initialCount + 1);
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "undo"]);
      data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages.length).toBe(initialCount);
      expect(consoleSpy).toHaveBeenCalledWith("Undo successful.");
      consoleSpy.mockRestore();
    });

    test("should error when no backup available for undo", () => {
      const data = {
        sessionTitle: "No Backup Session",
        messages: [{ timestamp: new Date().toISOString(), message: "Test message" }]
      };
      fs.writeFileSync(chatHistoryFile, JSON.stringify(data, null, 2));
      const consoleErrorSpy = vi.spyOn(console, "error");
      main(["chat", "undo"]);
      expect(consoleErrorSpy).toHaveBeenCalledWith("No more actions to undo.");
      consoleErrorSpy.mockRestore();
    });
  });

  describe("Redo Command", () => {
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

    test("should redo an undone edit command", () => {
      main(["chat", "Redo Session"]);
      main(["chat", "edit", "0", "edited message"]);
      let data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages[0].message).toBe("edited message");
      
      main(["chat", "undo"]);
      data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages[0].message).toBe("Simulated chat message received.");

      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "redo"]);
      data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages[0].message).toBe("edited message");
      expect(consoleSpy).toHaveBeenCalledWith("Redo successful.");
      consoleSpy.mockRestore();
    });

    test("should error when no redo action is available", () => {
      main(["chat", "Redo No Action Session"]);
      const consoleErrorSpy = vi.spyOn(console, "error");
      main(["chat", "redo"]);
      expect(consoleErrorSpy).toHaveBeenCalledWith("No actions to redo.");
      consoleErrorSpy.mockRestore();
    });
  });

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

    test("should find matching messages regardless of case", () => {
      const sessionTitle = "Search Test Case";
      const historyData = {
        sessionTitle: sessionTitle,
        messages: [
          { timestamp: "2021-01-01T00:00:00.000Z", message: "Hello World" }
        ]
      };
      fs.writeFileSync(chatHistoryFile, JSON.stringify(historyData, null, 2));
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "search", "hello"]);
      main(["chat", "search", "WORLD"]);
      expect(consoleSpy).toHaveBeenCalledWith("2021-01-01T00:00:00.000Z: Hello World");
      consoleSpy.mockRestore();
    });

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

  // New tests for edit-by-timestamp (edit-ts) subcommand
  describe("Edit-By-Timestamp Command", () => {
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

    test("should update a chat message with valid edit-ts command", () => {
      const historyData = {
        sessionTitle: "Timestamp Test",
        messages: [{ timestamp: "2021-01-01T00:00:00.000Z", message: "Original message" }]
      };
      fs.writeFileSync(chatHistoryFile, JSON.stringify(historyData, null, 2));
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "edit-ts", "2021-01-01T00:00:00.000Z", "Updated by timestamp"]);
      const data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.messages[0].message).toBe("Updated by timestamp");
      expect(consoleSpy).toHaveBeenCalledWith('Message with timestamp 2021-01-01T00:00:00.000Z updated.');
      consoleSpy.mockRestore();
    });

    test("should log error when no matching timestamp is found", () => {
      const historyData = {
        sessionTitle: "Timestamp Test",
        messages: [{ timestamp: "2021-01-01T00:00:00.000Z", message: "Original message" }]
      };
      fs.writeFileSync(chatHistoryFile, JSON.stringify(historyData, null, 2));
      const consoleErrorSpy = vi.spyOn(console, "error");
      main(["chat", "edit-ts", "2022-01-01T00:00:00.000Z", "Updated message"]);
      expect(consoleErrorSpy).toHaveBeenCalledWith("No message found with the provided timestamp.");
      consoleErrorSpy.mockRestore();
    });

    test("should log error when timestamp is missing", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      main(["chat", "edit-ts"]);
      expect(consoleErrorSpy).toHaveBeenCalledWith("No timestamp provided.");
      consoleErrorSpy.mockRestore();
    });

    test("should log error when new message content is missing", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      main(["chat", "edit-ts", "2021-01-01T00:00:00.000Z"]);
      expect(consoleErrorSpy).toHaveBeenCalledWith("No new message provided.");
      consoleErrorSpy.mockRestore();
    });
  });

  // New tests for Rename Command
  describe("Rename Command", () => {
    beforeEach(() => {
      if (fs.existsSync(chatHistoryFile)) {
        fs.unlinkSync(chatHistoryFile);
      }
      // Create an initial chat history
      main(["chat", "Initial Session"]);
    });

    afterEach(() => {
      if (fs.existsSync(chatHistoryFile)) {
        fs.unlinkSync(chatHistoryFile);
      }
    });

    test("should rename session title when a valid new title is provided", () => {
      const consoleSpy = vi.spyOn(console, "log");
      main(["chat", "rename", "Renamed Session"]);
      const data = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
      expect(data.sessionTitle).toBe("Renamed Session");
      // Check that backup was created
      expect(data._undoStack && data._undoStack.length).toBeGreaterThan(0);
      expect(consoleSpy).toHaveBeenCalledWith('Session title renamed to "Renamed Session".');
      consoleSpy.mockRestore();
    });

    test("should error when no new title is provided", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      main(["chat", "rename"]);
      expect(consoleErrorSpy).toHaveBeenCalledWith("No new session title provided.");
      consoleErrorSpy.mockRestore();
    });
  });

  // New tests for Import Command are already present above
});
