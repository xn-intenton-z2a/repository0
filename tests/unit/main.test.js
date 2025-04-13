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
  } catch {}
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

  // Tests for chat-export command without custom template
  test("chat-export command exports conversation history to markdown file with metadata", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const mdFile = path.resolve(process.cwd(), "chat_history.md");
    const sampleHistory = { sessionTitle: "My Session", messages: [
      { role: "user", content: "Hello Markdown", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Hi in Markdown!", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-export"]));
    expect(output).toContain("Conversation history exported to chat_history.md");
    const mdContent = await fs.readFile(mdFile, "utf-8");
    expect(mdContent).toContain("# Conversation History");
    expect(mdContent).toContain("**Session Title:** My Session");
    expect(mdContent).toContain("**Exported At:**");
    expect(mdContent).toContain("**Timestamp:**");
    await fs.unlink(historyFile);
    await fs.unlink(mdFile);
  });

  // Test for chat-export command with custom template
  test("chat-export command with custom template renders template output", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const mdFile = path.resolve(process.cwd(), "chat_history.md");
    const templateFile = path.resolve(process.cwd(), "custom_template.md");
    const sampleHistory = { sessionTitle: "Custom Session", messages: [
      { role: "user", content: "Custom Hello", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const customTemplate = "Custom Export\nSession: <%= sessionTitle %>\nTime: <%= exportTimestamp %>\n<% messages.forEach(function(m, i){ %>Message <%= i+1 %>: <%= m.content %>\n<% }); %>";
    await fs.writeFile(templateFile, customTemplate);
    const output = await captureOutput(() => main(["chat-export", "--template", templateFile]));
    expect(output).toContain("Conversation history exported to chat_history.md");
    const mdContent = await fs.readFile(mdFile, "utf-8");
    expect(mdContent).toContain("Custom Export");
    expect(mdContent).toContain("Session: Custom Session");
    await fs.unlink(historyFile);
    await fs.unlink(mdFile);
    await fs.unlink(templateFile);
  });

  // Tests for chat-html-export command
  test("chat-html-export command exports conversation history to HTML file with metadata", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const htmlFile = path.resolve(process.cwd(), "chat_history.html");
    const sampleHistory = { sessionTitle: "HTML Session", messages: [
      { role: "user", content: "Hello HTML", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Hi in HTML!", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-html-export"]));
    expect(output).toContain("Conversation history exported to chat_history.html");
    const htmlContent = await fs.readFile(htmlFile, "utf-8");
    expect(htmlContent).toContain("<html>");
    expect(htmlContent).toContain("<title>Conversation History</title>");
    expect(htmlContent).toContain("HTML Session");
    expect(htmlContent).toContain("Exported At:" );
    expect(htmlContent).toContain("Timestamp:" );
    await fs.unlink(historyFile);
    await fs.unlink(htmlFile);
  });

  // Tests for chat-pdf-export command
  test("chat-pdf-export command exports conversation history to PDF file with metadata", async () => {
    process.env.VITEST = "true"; // force test mode for PDF export
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const pdfFile = path.resolve(process.cwd(), "chat_history.pdf");
    const sampleHistory = { sessionTitle: "PDF Session", messages: [
      { role: "user", content: "Hello PDF", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Hi in PDF!", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-pdf-export"]));
    expect(output).toContain("Conversation history exported to chat_history.pdf");
    const pdfData = await fs.readFile(pdfFile);
    const pdfText = pdfData.toString();
    expect(pdfText).toContain("Conversation History");
    expect(pdfText).toContain("PDF Session");
    expect(pdfText).toContain("Exported At:");
    expect(pdfText).toContain("Hello PDF");
    expect(pdfText).toContain("Hi in PDF!");
    await fs.unlink(historyFile);
    await fs.unlink(pdfFile);
    delete process.env.VITEST;
  });

  test("chat-pdf-export command with custom template renders template output in PDF", async () => {
    process.env.VITEST = "true";
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const pdfFile = path.resolve(process.cwd(), "chat_history.pdf");
    const templateFile = path.resolve(process.cwd(), "custom_pdf_template.txt");
    const sampleHistory = { sessionTitle: "PDF Custom Session", messages: [
      { role: "user", content: "PDF Custom Message", tags: ["export"], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const customTemplate = "Custom PDF Export\nSession: <%= sessionTitle %>\nTime: <%= exportTimestamp %>\n<% messages.forEach(function(m, i){ %>Msg <%= i+1 %>: <%= m.content %>\n<% }); %>";
    await fs.writeFile(templateFile, customTemplate);
    const output = await captureOutput(() => main(["chat-pdf-export", "--template", templateFile]));
    expect(output).toContain("Conversation history exported to chat_history.pdf");
    const pdfData = await fs.readFile(pdfFile);
    const pdfText = pdfData.toString();
    expect(pdfText).toContain("Custom PDF Export");
    expect(pdfText).toContain("Session: PDF Custom Session");
    await fs.unlink(historyFile);
    await fs.unlink(pdfFile);
    await fs.unlink(templateFile);
    delete process.env.VITEST;
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
    const sampleHistory = { sessionTitle: "", messages: [
      { role: "user", content: "Hello", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Hi there!", tags: [], timestamp: new Date().toISOString() },
      { role: "user", content: "How are you doing today?", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "I'm doing well, thank you!", tags: [], timestamp: new Date().toISOString() }
    ] };
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
    const sampleHistory = { sessionTitle: "", messages: [
      { role: "user", content: "Entry 1", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Entry 2", tags: [], timestamp: new Date().toISOString() },
      { role: "user", content: "Entry 3", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-remove", "--index", "2"]));
    expect(output).toContain("Successfully removed conversation entry at index 2.");
    const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(updatedHistory.messages.length).toBe(2);
    expect(updatedHistory.messages[0].content).toBe("Entry 1");
    expect(updatedHistory.messages[1].content).toBe("Entry 3");
    await fs.unlink(historyFile);
  });

  test("chat-remove command error for out-of-bound index", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = { sessionTitle: "", messages: [
      { role: "user", content: "Only Entry", tags: [], timestamp: new Date().toISOString() }
    ] };
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
    await fs.writeFile(historyFile, JSON.stringify({ sessionTitle: "", messages: [] }, null, 2));
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
    const sampleHistory = { sessionTitle: "", messages: [
      { role: "user", content: "Old message 1", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Old message 2", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const newMessage = "Updated message";
    const output = await captureOutput(() => main(["chat-edit", "--index", "2", "--message", newMessage]));
    expect(output).toContain("Successfully updated conversation entry at index 2.");
    const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(updatedHistory.messages[1].content).toBe(newMessage);
    await fs.unlink(historyFile);
  });

  test("chat-edit command error for out-of-bound index", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = { sessionTitle: "", messages: [
      { role: "user", content: "Only Entry", tags: [], timestamp: new Date().toISOString() }
    ] };
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
    const sampleHistory = { sessionTitle: "", messages: [
      { role: "user", content: "Old message", tags: [], timestamp: new Date().toISOString() }
    ] };
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
    const sampleHistory = { sessionTitle: "Auto Archive Test", messages: [
      { role: "user", content: "Old message 1", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Old response 1", tags: [], timestamp: new Date().toISOString() },
      { role: "user", content: "Old message 2", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat", "--prompt", "New auto archival test", "--auto-archive-threshold", "3"]));
    expect(output).toMatch(/Conversation history auto-archived to chat_history-\d{14}\.json/);
    const newHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(newHistory.sessionTitle).toBe("Auto Archive Test");
    expect(newHistory.messages.length).toBe(1);
    expect(newHistory.messages[0].content).toBe("New auto archival test");
    const archiveMatch = output.match(/Conversation history auto-archived to (chat_history-\d{14}\.json)/);
    if (archiveMatch) {
      const archiveFileName = path.resolve(process.cwd(), archiveMatch[1]);
      if (existsSync(archiveFileName)) {
        await fs.unlink(archiveFileName);
      }
    }
    await fs.unlink(historyFile);
  });

  // Tests for chat-import command
  test("chat-import command successfully imports valid conversation history", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const initialHistory = { sessionTitle: "", messages: [
      { role: "user", content: "Existing message", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(initialHistory, null, 2));

    const importFile = path.resolve(process.cwd(), "test_import.json");
    const importData = [
      { role: "assistant", content: "Imported reply", tags: [], timestamp: new Date().toISOString() },
      { role: "user", content: "Imported question", tags: [], timestamp: new Date().toISOString() }
    ];
    await fs.writeFile(importFile, JSON.stringify(importData, null, 2));

    const output = await captureOutput(() => main(["chat-import", "--file", importFile]));
    expect(output).toContain("Successfully imported 2 conversation messages. Chat history updated.");

    const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(updatedHistory.messages.length).toBe(3);
    expect(updatedHistory.messages).toEqual(initialHistory.messages.concat(importData));
    await fs.unlink(importFile);
    await fs.unlink(historyFile);
  });

  test("chat-import command errors when file does not exist", async () => {
    const nonExistentFile = path.resolve(process.cwd(), "nonexistent.json");
    const output = await captureOutput(() => {
      try {
        return main(["chat-import", "--file", nonExistentFile]);
      } catch(e){}
    });
    expect(output).toContain(`File not found: ${nonExistentFile}`);
  });

  test("chat-import command errors when file contains invalid JSON", async () => {
    const importFile = path.resolve(process.cwd(), "invalid.json");
    await fs.writeFile(importFile, "This is not JSON");
    const output = await captureOutput(() => {
      try {
        return main(["chat-import", "--file", importFile]);
      } catch(e){}
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
      } catch(e){}
    });
    expect(output).toContain("Invalid conversation history format: Expected an array of messages.");
    await fs.unlink(importFile);
  });

  test("chat-import command errors when an entry has invalid structure", async () => {
    const importFile = path.resolve(process.cwd(), "invalid_entry.json");
    const importData = [
      { role: "user", content: "Valid message", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant" }
    ];
    await fs.writeFile(importFile, JSON.stringify(importData, null, 2));
    const output = await captureOutput(() => {
      try {
        return main(["chat-import", "--file", importFile]);
      } catch(e){}
    });
    expect(output).toContain("Invalid conversation entry: Missing or empty 'content' property.");
    await fs.unlink(importFile);
  });

  // Tests for chat-translate command
  test("chat-translate command with empty language input displays error", async () => {
    const output = await captureOutput(() => {
      try {
        return main(["chat-translate", "--language", ""]);
      } catch(e){}
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
    const sampleHistory = { sessionTitle: "", messages: [
      { role: "user", content: "Hello", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Hi there!", tags: [], timestamp: new Date().toISOString() }
    ] };
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

  // Test for chat command with custom summarization prompt
  test("chat command with custom summarization prompt triggers custom summarization", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = { sessionTitle: "", messages: [
      { role: "user", content: "Message 1", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Response 1", tags: [], timestamp: new Date().toISOString() },
      { role: "user", content: "Message 2", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Response 2", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat", "--prompt", "New message", "--max-history-messages", "3", "--summarization-prompt", "Custom summarize:" ]));
    expect(output).toContain("Custom summarization response");
    await fs.unlink(historyFile);
  });

  // Test for auto archival feature triggered in chat command
  test("chat command auto-archives conversation when threshold exceeded", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = { sessionTitle: "Auto Archive Test", messages: [
      { role: "user", content: "Old message 1", tags: [], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Old response 1", tags: [], timestamp: new Date().toISOString() },
      { role: "user", content: "Old message 2", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat", "--prompt", "New auto archival test", "--auto-archive-threshold", "3"]));
    expect(output).toMatch(/Conversation history auto-archived to chat_history-\d{14}\.json/);
    const newHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(newHistory.sessionTitle).toBe("Auto Archive Test");
    expect(newHistory.messages.length).toBe(1);
    expect(newHistory.messages[0].content).toBe("New auto archival test");
    const archiveMatch = output.match(/Conversation history auto-archived to (chat_history-\d{14}\.json)/);
    if (archiveMatch) {
      const archiveFile = path.resolve(process.cwd(), archiveMatch[1]);
      if (existsSync(archiveFile)) {
        await fs.unlink(archiveFile);
      }
    }
    await fs.unlink(historyFile);
  });

  // New Tests for chat-csv-export command
  test("chat-csv-export command exports conversation history to CSV with metadata", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const csvFile = path.resolve(process.cwd(), "chat_history.csv");
    const sampleHistory = { sessionTitle: "CSV Session", messages: [
      { role: "user", content: "Hello CSV", tags: ["greeting"], timestamp: new Date().toISOString(), feedback: "positive" },
      { role: "assistant", content: "Hi in CSV!", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-csv-export"]));
    expect(output).toContain("Conversation history exported to chat_history.csv");
    const csvContent = await fs.readFile(csvFile, "utf-8");
    expect(csvContent).toContain("CSV Session");
    expect(csvContent).toContain("Hello CSV");
    expect(csvContent).toContain("Hi in CSV!");
    expect(csvContent).toContain("greeting");
    await fs.unlink(historyFile);
    await fs.unlink(csvFile);
  });

  test("chat-csv-export command applies tag filtering", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const csvFile = path.resolve(process.cwd(), "chat_history.csv");
    const sampleHistory = { sessionTitle: "CSV Filter", messages: [
      { role: "user", content: "Message with tag", tags: ["export"], timestamp: new Date().toISOString() },
      { role: "assistant", content: "Message without tag", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-csv-export", "--tag", "export"]));
    expect(output).toContain("Conversation history exported to chat_history.csv");
    const csvContent = await fs.readFile(csvFile, "utf-8");
    expect(csvContent).toContain("Message with tag");
    expect(csvContent).not.toContain("Message without tag");
    await fs.unlink(historyFile);
    await fs.unlink(csvFile);
  });

  test("chat-csv-export command applies date range filtering", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const csvFile = path.resolve(process.cwd(), "chat_history.csv");
    const oldDate = new Date(Date.now() - 86400000).toISOString(); // 1 day ago
    const newDate = new Date().toISOString();
    const sampleHistory = { sessionTitle: "CSV Date Filter", messages: [
      { role: "user", content: "Old message", tags: [], timestamp: oldDate },
      { role: "assistant", content: "Recent message", tags: [], timestamp: newDate }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-csv-export", "--start-date", newDate]));
    expect(output).toContain("Conversation history exported to chat_history.csv");
    const csvContent = await fs.readFile(csvFile, "utf-8");
    expect(csvContent).toContain("Recent message");
    expect(csvContent).not.toContain("Old message");
    await fs.unlink(historyFile);
    await fs.unlink(csvFile);
  });

  test("chat-csv-export command with custom delimiter ';'", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const csvFile = path.resolve(process.cwd(), "chat_history.csv");
    const sampleHistory = { sessionTitle: "CSV Custom Delimiter", messages: [
      { role: "user", content: "Hello;World", tags: ["custom"], timestamp: new Date().toISOString(), feedback: "positive" },
      { role: "assistant", content: "Hi, there!", tags: [], timestamp: new Date().toISOString() }
    ] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-csv-export", "--delimiter", ";"]));
    expect(output).toContain("Conversation history exported to chat_history.csv");
    const csvContent = await fs.readFile(csvFile, "utf-8");
    // Check that the header uses semicolon as delimiter
    expect(csvContent).toContain('"Session Title";"Export Timestamp"');
    // Check one of the rows
    expect(csvContent).toContain('1;');
    await fs.unlink(historyFile);
    await fs.unlink(csvFile);
  });

  // Tests for chat-feedback command
  describe("chat-feedback command", () => {
    test("add subcommand adds feedback to an entry", async () => {
      const historyFile = path.resolve(process.cwd(), ".chat_history.json");
      const sampleHistory = { sessionTitle: "Feedback Test", messages: [
        { role: "user", content: "Test message", tags: [], timestamp: new Date().toISOString() }
      ] };
      await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
      const output = await captureOutput(() => main(["chat-feedback", "add", "--index", "1", "--feedback", "positive"]));
      expect(output).toContain("Feedback added to conversation entry at index 1.");
      const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
      expect(updatedHistory.messages[0].feedback).toBe("positive");
      await fs.unlink(historyFile);
    });

    test("remove subcommand removes feedback from an entry", async () => {
      const historyFile = path.resolve(process.cwd(), ".chat_history.json");
      const sampleHistory = { sessionTitle: "Feedback Test", messages: [
        { role: "user", content: "Test message", feedback: "negative", tags: [], timestamp: new Date().toISOString() }
      ] };
      await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
      const output = await captureOutput(() => main(["chat-feedback", "remove", "--index", "1"]));
      expect(output).toContain("Feedback removed from conversation entry at index 1.");
      const updatedHistory = JSON.parse(await fs.readFile(historyFile, "utf-8"));
      expect(updatedHistory.messages[0].feedback).toBeUndefined();
      await fs.unlink(historyFile);
    });

    test("list subcommand lists feedback for entries", async () => {
      const historyFile = path.resolve(process.cwd(), ".chat_history.json");
      const sampleHistory = { sessionTitle: "Feedback Test", messages: [
        { role: "user", content: "Message one", feedback: "good", tags: [], timestamp: new Date().toISOString() },
        { role: "assistant", content: "Message two", tags: [], timestamp: new Date().toISOString() }
      ] };
      await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
      const output = await captureOutput(() => main(["chat-feedback", "list"]));
      expect(output).toContain("1. user: good");
      await fs.unlink(historyFile);
    });
  });

  // Tests for chat-title command
  test("chat-title set command sets the session title", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    await fs.writeFile(historyFile, JSON.stringify({ sessionTitle: "", messages: [] }, null, 2));
    const output = await captureOutput(() => main(["chat-title", "set", "--title", "My Chat Session"]));
    expect(output).toContain("Session title set to: My Chat Session");
    const data = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(data.sessionTitle).toBe("My Chat Session");
    await fs.unlink(historyFile);
  });

  test("chat-title get command retrieves the session title", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = { sessionTitle: "Test Title", messages: [] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-title", "get"]));
    expect(output).toContain("Current session title: Test Title");
    await fs.unlink(historyFile);
  });

  test("chat-title get command shows message when no title is set", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = { sessionTitle: "", messages: [] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-title", "get"]));
    expect(output).toContain("No session title set.");
    await fs.unlink(historyFile);
  });

  test("chat-title clear command clears the session title", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = { sessionTitle: "Title To Clear", messages: [] };
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-title", "clear"]));
    expect(output).toContain("Session title cleared.");
    const data = JSON.parse(await fs.readFile(historyFile, "utf-8"));
    expect(data.sessionTitle).toBe("");
    await fs.unlink(historyFile);
  });
});
