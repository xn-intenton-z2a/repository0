import { describe, test, expect, vi } from "vitest";
import { main } from "@src/lib/main.js";
import { promises as fs } from "fs";
import { existsSync } from "fs";
import path from "path";

// Mock the OpenAI module for chat command and summarization tests
vi.mock("openai", () => {
  class FakeConfiguration {}
  class FakeOpenAIApi {
    constructor(config) {}
    async createChatCompletion(params) {
      // For custom summarization prompt, check if the last message starts with 'Custom summarize:'
      if (params.messages && Array.isArray(params.messages)) {
        const lastMessage = params.messages[params.messages.length - 1].content;
        if (lastMessage.startsWith('Custom summarize:')) {
          return { data: { choices: [{ message: { content: "Custom summarization response" } }] } };
        } else if (lastMessage.startsWith('Summarize the following conversation:')) {
          return { data: { choices: [{ message: { content: "Summary of conversation" } }] } };
        } else if (lastMessage.startsWith('Translate the following conversation history')) {
          return { data: { choices: [{ message: { content: `Translated conversation to target language` } }] } };
        }
      }
      // Check for custom model and temperature parameters
      if (params.model === "gpt-4" && params.temperature === 0.9) {
        return { data: { choices: [{ message: { content: "Custom response from OpenAI with gpt-4" } }] } };
      }
      return { data: { choices: [{ message: { content: "Response from OpenAI" } }] } };
    }
  }
  return { Configuration: FakeConfiguration, OpenAIApi: FakeOpenAIApi };
});

// Helper to capture console.log and console.error output (supports async handlers)
async function captureOutput(fn) {
  let output = "";
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(" ") + "\n";
  };
  console.error = (...args) => {
    output += args.join(" ") + "\n";
  };
  try {
    const result = fn();
    if (result && typeof result.then === "function") {
      await result;
    }
  } catch {
    // ignore errors for testing
  }
  console.log = originalLog;
  console.error = originalError;
  return output;
}

const suggestion = "Please provide a valid non-empty string, such as 'start' or 'info'.";

describe("CLI Commands", () => {
  test("diagnostics command", async () => {
    const output = await captureOutput(() => main(["diagnostics"]));
    expect(output).toContain("Diagnostics: running diagnostics");
    expect(output).toContain("Node.js Version:");
    expect(output).toContain("Package: @xn-intenton-z2a/repository0");
    expect(output).toContain("Dependencies:");
  });

  test("version command", async () => {
    const output = await captureOutput(() => main(["version"]));
    expect(output).toContain("Version 1.4.1-13");
  });

  test("update command", async () => {
    const output = await captureOutput(() => main(["update"]));
    expect(output).toContain("Performing update...");
  });

  test("config show command", async () => {
    const output = await captureOutput(() => main(["config", "show"]));
    expect(output).toContain("Configuration: using default settings");
  });

  test("info command", async () => {
    const output = await captureOutput(() => main(["info"]));
    expect(output).toContain("Repository: @xn-intenton-z2a/repository0");
    expect(output).toContain("Version: 1.4.1-13");
    expect(output).toContain("Demo repository showcasing agentic‑lib workflows");
  });

  test("no command provided shows error/help", async () => {
    const output = await captureOutput(() => {
      try {
        return main([]);
      } catch {}
    });
    expect(output).toContain("You need to specify a valid command");
  });

  test("default parameter when no arguments provided", async () => {
    const output = await captureOutput(() => {
      try {
        return main();
      } catch {}
    });
    expect(output).toContain("Run with: []");
  });

  test("empty string input displays error message", async () => {
    const output = await captureOutput(() => {
      try {
        return main([""]);
      } catch {}
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received an empty string");
    expect(output).toContain(suggestion);
  });

  // Tests for the chat command
  test("chat command with valid prompt", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    const output = await captureOutput(() => main(["chat", "--prompt", "Hello, how are you?"]));
    expect(output).toContain("Response from OpenAI");
  });

  test("chat command with empty prompt displays error", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    const output = await captureOutput(() => {
      try {
        return main(["chat", "--prompt", ""]);
      } catch {}
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received an empty string");
    expect(output).toContain(suggestion);
  });

  test("chat command missing API key displays error", async () => {
    delete process.env.CHATGPT_API_SECRET_KEY;
    const output = await captureOutput(() => {
      try {
        return main(["chat", "--prompt", "Hello"]);
      } catch {}
    });
    expect(output).toContain("Missing environment variable CHATGPT_API_SECRET_KEY");
  });

  test("boolean input (true) displays error", async () => {
    const output = await captureOutput(() => {
      try {
        return main([true]);
      } catch {} 
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received true");
    expect(output).toContain(suggestion);
  });

  test("boolean input (false) displays error", async () => {
    const output = await captureOutput(() => {
      try {
        return main([false]);
      } catch {} 
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received false");
    expect(output).toContain(suggestion);
  });

  test("null input displays error", async () => {
    const output = await captureOutput(() => {
      try {
        return main([null]);
      } catch {} 
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received null");
    expect(output).toContain(suggestion);
  });

  test("undefined input displays error", async () => {
    const output = await captureOutput(() => {
      try {
        return main([undefined]);
      } catch {} 
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received undefined");
    expect(output).toContain(suggestion);
  });

  test("object input displays error", async () => {
    const output = await captureOutput(() => {
      try {
        return main([{ command: "test" }]);
      } catch {} 
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received {\"command\":\"test\"}");
    expect(output).toContain(suggestion);
  });

  test("array input displays error", async () => {
    const output = await captureOutput(() => {
      try {
        return main([ ["array"] ]);
      } catch {} 
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received Array");
    expect(output).toContain(suggestion);
  });

  test("symbol input displays error", async () => {
    const sym = Symbol("testSymbol");
    const output = await captureOutput(() => {
      try {
        return main([sym]);
      } catch {} 
    });
    expect(output).toContain(`Invalid input: Expected a valid non-empty string command, but received Symbol(testSymbol)`);
    expect(output).toContain(suggestion);
  });

  test("bigint input displays error", async () => {
    const big = BigInt(123);
    const output = await captureOutput(() => {
      try {
        return main([big]);
      } catch {} 
    });
    expect(output).toContain(`Invalid input: Expected a valid non-empty string command, but received ${big.toString()}n`);
    expect(output).toContain(suggestion);
  });

  // Tests for chat-history command
  test("chat-history command displays conversation history if file exists", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Hello", tags: [] },
      { role: "assistant", content: "Hi there!", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-history"]));
    expect(output).toContain("Conversation History:");
    expect(output).toContain("1. user: Hello");
    expect(output).toContain("2. assistant: Hi there!");
    await fs.unlink(historyFile);
  });

  test("chat-history command displays no history message when file does not exist", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    if (existsSync(historyFile)) {
      await fs.unlink(historyFile);
    }
    const output = await captureOutput(() => main(["chat-history"]));
    expect(output).toContain("No conversation history available.");
  });

  // Tests for chat-summarize command
  test("chat-summarize command displays summary when history exists", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "How are you?", tags: [] },
      { role: "assistant", content: "I am fine.", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-summarize"]));
    expect(output).toContain("Summary of conversation");
    await fs.unlink(historyFile);
  });

  test("chat-summarize command shows no history message when file is missing", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    if (existsSync(historyFile)) {
      await fs.unlink(historyFile);
    }
    const output = await captureOutput(() => main(["chat-summarize"]));
    expect(output).toContain("No conversation history to summarize.");
  });

  test("chat-summarize command shows no history message when file is empty", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    await fs.writeFile(historyFile, JSON.stringify([], null, 2));
    const output = await captureOutput(() => main(["chat-summarize"]));
    expect(output).toContain("No conversation history to summarize.");
    await fs.unlink(historyFile);
  });

  // Tests for chat-search command
  test("chat-search command displays matching history entries for a valid query", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "I need help with testing.", tags: [] },
      { role: "assistant", content: "Sure, I can help you with that.", tags: [] },
      { role: "user", content: "What is the time?", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-search", "--query", "help"]));
    expect(output).toContain("Search Results:");
    expect(output).toContain("1. user: I need help with testing.");
    expect(output).toContain("2. assistant: Sure, I can help you with that.");
    await fs.unlink(historyFile);
  });

  test("chat-search command displays no results message when no entries match the query", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "I like apples.", tags: [] },
      { role: "assistant", content: "Apples are great!", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-search", "--query", "banana"]));
    expect(output).toContain("No results found for query: \"banana\"");
    await fs.unlink(historyFile);
  });

  test("chat-search command displays no conversation history message when history file is missing", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    if (existsSync(historyFile)) {
      await fs.unlink(historyFile);
    }
    const output = await captureOutput(() => main(["chat-search", "--query", "test"]));
    expect(output).toContain("No conversation history available.");
  });

  // Test for chat-export command
  test("chat-export command exports conversation history to markdown file", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const mdFile = path.resolve(process.cwd(), "chat_history.md");
    const sampleHistory = [
      { role: "user", content: "Hello Markdown", tags: [] },
      { role: "assistant", content: "Hi in Markdown!", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-export"]));
    expect(output).toContain("Conversation history exported to chat_history.md");
    const mdContent = await fs.readFile(mdFile, "utf-8");
    expect(mdContent).toContain("# Conversation History");
    expect(mdContent).toContain("**1. user**: Hello Markdown");
    expect(mdContent).toContain("**2. assistant**: Hi in Markdown!");
    await fs.unlink(historyFile);
    await fs.unlink(mdFile);
  });

  // Tests for chat-html-export command
  test("chat-html-export command exports conversation history to HTML file", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const htmlFile = path.resolve(process.cwd(), "chat_history.html");
    const sampleHistory = [
      { role: "user", content: "Hello HTML", tags: [] },
      { role: "assistant", content: "Hi in HTML!", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-html-export"]));
    expect(output).toContain("Conversation history exported to chat_history.html");
    const htmlContent = await fs.readFile(htmlFile, "utf-8");
    expect(htmlContent).toContain("<html>");
    expect(htmlContent).toContain("<title>Conversation History</title>");
    expect(htmlContent).toContain("Hello HTML");
    expect(htmlContent).toContain("Hi in HTML!");
    await fs.unlink(historyFile);
    await fs.unlink(htmlFile);
  });

  test("chat-html-export command displays no history message when file does not exist", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    if (existsSync(historyFile)) {
      await fs.unlink(historyFile);
    }
    const output = await captureOutput(() => main(["chat-html-export"]));
    expect(output).toContain("No conversation history available to export.");
  });

  // Tests for chat-statistics command
  test("chat-statistics command displays no history message when file does not exist", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    if (existsSync(historyFile)) {
      await fs.unlink(historyFile);
    }
    const output = await captureOutput(() => main(["chat-statistics"]));
    expect(output).toContain("No conversation history available.");
  });

  test("chat-statistics command displays statistics when history exists", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Hello", tags: [] },
      { role: "assistant", content: "Hi there!", tags: [] },
      { role: "user", content: "How are you doing today?", tags: [] },
      { role: "assistant", content: "I'm doing well, thank you!", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-statistics"]));
    expect(output).toContain("Conversation Statistics:");
    expect(output).toContain("Total Messages: 4");
    expect(output).toContain("Role user:");
    expect(output).toContain("Role assistant:");
    await fs.unlink(historyFile);
  });

  // Tests for chat-remove command
  test("chat-remove command successfully removes an entry", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Entry 1", tags: [] },
      { role: "assistant", content: "Entry 2", tags: [] },
      { role: "user", content: "Entry 3", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-remove", "--index", "2"]));
    expect(output).toContain("Successfully removed conversation entry at index 2.");
    const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(updatedHistory.length).toBe(2);
    expect(updatedHistory).toEqual([
      { role: "user", content: "Entry 1", tags: [] },
      { role: "user", content: "Entry 3", tags: [] }
    ]);
    await fs.unlink(historyFile);
  });

  test("chat-remove command error for out-of-bound index", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Only Entry", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => {
      try {
        return main(["chat-remove", "--index", "5"]);
      } catch {}
    });
    expect(output).toContain("Error: Provided index 5 is out of bounds. Conversation history contains 1 entries.");
    await fs.unlink(historyFile);
  });

  test("chat-remove command error when history file does not exist", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    if (existsSync(historyFile)) {
      await fs.unlink(historyFile);
    }
    const output = await captureOutput(() => {
      try {
        return main(["chat-remove", "--index", "1"]);
      } catch {}
    });
    expect(output).toContain("No conversation history available.");
  });

  test("chat-remove command error when history is empty", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    await fs.writeFile(historyFile, JSON.stringify([], null, 2));
    const output = await captureOutput(() => {
      try {
        return main(["chat-remove", "--index", "1"]);
      } catch {}
    });
    expect(output).toContain("No conversation history available.");
    await fs.unlink(historyFile);
  });

  // Tests for chat-edit command
  test("chat-edit command successfully updates a message", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Old message 1", tags: [] },
      { role: "assistant", content: "Old message 2", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const newMessage = "Updated message";
    const output = await captureOutput(() => main(["chat-edit", "--index", "2", "--message", newMessage]));
    expect(output).toContain("Successfully updated conversation entry at index 2.");
    const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(updatedHistory[1].content).toBe(newMessage);
    await fs.unlink(historyFile);
  });

  test("chat-edit command error for out-of-bound index", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Only Entry", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => {
      try {
        return main(["chat-edit", "--index", "5", "--message", "New message"]);
      } catch {}
    });
    expect(output).toContain("Error: Provided index 5 is out of bounds. Conversation history contains 1 entries.");
    await fs.unlink(historyFile);
  });

  test("chat-edit command error for empty message", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Old message", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => {
      try {
        return main(["chat-edit", "--index", "1", "--message", ""]);
      } catch {}
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received an empty string");
    expect(output).toContain(suggestion);
    await fs.unlink(historyFile);
  });

  // Tests for chat-archive command
  test("chat-archive command shows message when no history exists", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    if (existsSync(historyFile)) {
      await fs.unlink(historyFile);
    }
    const output = await captureOutput(() => main(["chat-archive"]));
    expect(output).toContain("No conversation history available to archive.");
  });

  test("chat-archive command archives history and resets file", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Archive test", tags: [] },
      { role: "assistant", content: "History to archive", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-archive"]));
    const archiveRegex = /Conversation history archived to chat_history-\d{14}\.json/;
    expect(output).toMatch(archiveRegex);
    const match = output.match(archiveRegex);
    if (match) {
      const archiveFileName = match[0].replace('Conversation history archived to ', '');
      const archivedData = JSON.parse(await fs.readFile(path.resolve(process.cwd(), archiveFileName), "utf-8"));
      expect(archivedData).toEqual(sampleHistory);
      await fs.unlink(path.resolve(process.cwd(), archiveFileName));
    }
    const newHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(newHistory).toEqual([]);
    await fs.unlink(historyFile);
  });

  // New tests for chat-import command
  test("chat-import command successfully imports valid conversation history", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const initialHistory = [
      { role: "user", content: "Existing message", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(initialHistory, null, 2));

    const importFile = path.resolve(process.cwd(), "test_import.json");
    const importData = [
      { role: "assistant", content: "Imported reply", tags: [] },
      { role: "user", content: "Imported question", tags: [] }
    ];
    await fs.writeFile(importFile, JSON.stringify(importData, null, 2));

    const output = await captureOutput(() => main(["chat-import", "--file", importFile]));
    expect(output).toContain("Successfully imported 2 conversation messages. Chat history updated.");

    const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(updatedHistory.length).toBe(3);
    expect(updatedHistory).toEqual(initialHistory.concat(importData));
    
    await fs.unlink(importFile);
    await fs.unlink(historyFile);
  });

  test("chat-import command errors when file does not exist", async () => {
    const nonExistentFile = path.resolve(process.cwd(), "nonexistent.json");
    const output = await captureOutput(() => {
      try {
        return main(["chat-import", "--file", nonExistentFile]);
      } catch {}
    });
    expect(output).toContain(`File not found: ${nonExistentFile}`);
  });

  test("chat-import command errors when file contains invalid JSON", async () => {
    const importFile = path.resolve(process.cwd(), "invalid.json");
    await fs.writeFile(importFile, "This is not JSON");
    const output = await captureOutput(() => {
      try {
        return main(["chat-import", "--file", importFile]);
      } catch {}
    });
    expect(output).toContain(`Failed to read or parse file: ${importFile}`);
    await fs.unlink(importFile);
  });

  test("chat-import command errors when JSON structure is invalid (not an array)", async () => {
    const importFile = path.resolve(process.cwd(), "not_array.json");
    await fs.writeFile(importFile, JSON.stringify({ role: "user", content: "Invalid structure" }));
    const output = await captureOutput(() => {
      try {
        return main(["chat-import", "--file", importFile]);
      } catch {}
    });
    expect(output).toContain("Invalid conversation history format: Expected an array of messages.");
    await fs.unlink(importFile);
  });

  test("chat-import command errors when an entry has invalid structure", async () => {
    const importFile = path.resolve(process.cwd(), "invalid_entry.json");
    const importData = [
      { role: "user", content: "Valid message", tags: [] },
      { role: "assistant" }
    ];
    await fs.writeFile(importFile, JSON.stringify(importData, null, 2));
    const output = await captureOutput(() => {
      try {
        return main(["chat-import", "--file", importFile]);
      } catch {}
    });
    expect(output).toContain("Invalid conversation entry: Missing or empty 'content' property.");
    await fs.unlink(importFile);
  });

  // New tests for chat-translate command
  test("chat-translate command with empty language input displays error", async () => {
    const output = await captureOutput(() => {
      try {
        return main(["chat-translate", "--language", ""]);
      } catch {}
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received an empty string");
    expect(output).toContain(suggestion);
  });

  test("chat-translate command displays no conversation history message when file does not exist", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    if (existsSync(historyFile)) {
      await fs.unlink(historyFile);
    }
    const output = await captureOutput(() => main(["chat-translate", "--language", "Spanish"]));
    expect(output).toContain("No conversation history available to translate.");
  });

  test("chat-translate command translates conversation history with valid history", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Hello", tags: [] },
      { role: "assistant", content: "Hi there!", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-translate", "--language", "Spanish"]));
    expect(output).toContain("Translated conversation to target language");
    await fs.unlink(historyFile);
  });

  // Tests for chat command with custom model and temperature
  test("chat command with custom model and temperature", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    const output = await captureOutput(() => main(["chat", "--prompt", "Hello, custom test", "--model", "gpt-4", "--temperature", "0.9"]));
    expect(output).toContain("Custom response from OpenAI with gpt-4");
  });

  // New test for chat command with custom summarization prompt
  test("chat command with custom summarization prompt triggers custom summarization", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    // Write a sample history to force auto-summarization
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Message 1", tags: [] },
      { role: "assistant", content: "Response 1", tags: [] },
      { role: "user", content: "Message 2", tags: [] },
      { role: "assistant", content: "Response 2", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    // Set max-history-messages to 3 so that auto-summarization is triggered
    const output = await captureOutput(() => main(["chat", "--prompt", "New message", "--max-history-messages", "3", "--summarization-prompt", "Custom summarize:" ]));
    expect(output).toContain("Custom summarization response");
    await fs.unlink(historyFile);
  });

  // New tests for chat-pdf-export command
  test("chat-pdf-export command exports conversation history to PDF file", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const pdfFile = path.resolve(process.cwd(), "chat_history.pdf");
    const sampleHistory = [
      { role: "user", content: "Hello PDF", tags: [] },
      { role: "assistant", content: "Hi in PDF!", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-pdf-export"]));
    expect(output).toContain("Conversation history exported to chat_history.pdf");
    const pdfData = await fs.readFile(pdfFile);
    const pdfText = pdfData.toString();
    expect(pdfText).toContain("Conversation History");
    expect(pdfText).toContain("1. user: Hello PDF");
    expect(pdfText).toContain("2. assistant: Hi in PDF!");
    await fs.unlink(historyFile);
    await fs.unlink(pdfFile);
  });

  test("chat-pdf-export command displays message when no history exists", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    if (existsSync(historyFile)) {
      await fs.unlink(historyFile);
    }
    const output = await captureOutput(() => main(["chat-pdf-export"]));
    expect(output).toContain("No conversation history available to export.");
  });

  // New test for global verbose flag
  test("global verbose flag enables detailed debug logging", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    const output = await captureOutput(() => main(["--verbose", "diagnostics"]));
    expect(output).toContain("Verbose mode enabled.");
    expect(output).toContain("Diagnostics: running diagnostics");
  });

  // New tests for chat-config-update command
  test("chat-config-update command creates a new configuration file when none exists", async () => {
    const configFile = path.resolve(process.cwd(), ".chat_config.json");
    if (existsSync(configFile)) {
      await fs.unlink(configFile);
    }
    const output = await captureOutput(() => main(["chat-config-update", "--model", "gpt-4", "--temperature", "0.8", "--max-history-messages", "15", "--recent-messages", "3"]));
    expect(output).toContain("Chat configuration updated successfully.");
    const configData = JSON.parse(await fs.readFile(configFile, "utf-8"));
    expect(configData.model).toBe("gpt-4");
    expect(configData.temperature).toBe(0.8);
    expect(configData["max-history-messages"]).toBe(15);
    expect(configData["recent-messages"]).toBe(3);
    await fs.unlink(configFile);
  });

  test("chat-config-update command merges with existing configuration", async () => {
    const configFile = path.resolve(process.cwd(), ".chat_config.json");
    const initialConfig = { model: "gpt-3.5-turbo", temperature: 0.7 };
    await fs.writeFile(configFile, JSON.stringify(initialConfig, null, 2));
    const output = await captureOutput(() => main(["chat-config-update", "--temperature", "0.9"]));
    expect(output).toContain("Chat configuration updated successfully.");
    const updatedConfig = JSON.parse(await fs.readFile(configFile, "utf-8"));
    expect(updatedConfig.model).toBe("gpt-3.5-turbo");
    expect(updatedConfig.temperature).toBe(0.9);
    await fs.unlink(configFile);
  });

  // New tests for chat-tag command
  test("chat-tag add command adds a tag to an entry", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Test message", tags: [] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-tag", "add", "--index", "1", "--tag", "important"]));
    expect(output).toContain("Tag \"important\" added to conversation entry at index 1.");
    const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(updatedHistory[0].tags).toContain("important");
    await fs.unlink(historyFile);
  });

  test("chat-tag add command errors when adding duplicate tag", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Test message", tags: ["important"] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => {
      try {
        return main(["chat-tag", "add", "--index", "1", "--tag", "important"]);
      } catch {}
    });
    expect(output).toContain("Tag \"important\" already exists for entry at index 1.");
    await fs.unlink(historyFile);
  });

  test("chat-tag remove command removes a tag from an entry", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Test message", tags: ["important", "todo"] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-tag", "remove", "--index", "1", "--tag", "important"]));
    expect(output).toContain("Tag \"important\" removed from conversation entry at index 1.");
    const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(updatedHistory[0].tags).not.toContain("important");
    await fs.unlink(historyFile);
  });

  test("chat-tag list command lists tags for an entry", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Test message", tags: ["important", "urgent"] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-tag", "list", "--index", "1"]));
    expect(output).toContain("Tags for entry at index 1: important, urgent");
    await fs.unlink(historyFile);
  });

  test("chat-tag filter command filters entries by tag", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Message one", tags: ["tag1"] },
      { role: "assistant", content: "Reply one", tags: [] },
      { role: "user", content: "Message two", tags: ["tag1", "tag2"] }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-tag", "filter", "--tag", "tag1"]));
    expect(output).toContain("Conversation entries with tag \"tag1\":");
    expect(output).toContain("user: Message one");
    expect(output).toContain("user: Message two");
    await fs.unlink(historyFile);
  });
});
