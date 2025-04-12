import { describe, test, expect, vi } from "vitest";
import { main } from "@src/lib/main.js";
import { promises as fs } from "fs";
import { existsSync } from "fs";
import path from "path";

// Mock the OpenAI module for chat command tests
vi.mock("openai", () => {
  class FakeConfiguration {}
  class FakeOpenAIApi {
    constructor(config) {}
    async createChatCompletion(params) {
      // For testing multi-turn, we can check the messages length if needed
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

  test("NaN input displays error message", async () => {
    const output = await captureOutput(() => {
      try {
        return main([NaN]);
      } catch {}
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received NaN");
    expect(output).toContain(suggestion);
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

  // New tests for chat-history command
  test("chat-history command displays conversation history if file exists", async () => {
    const historyFile = path.resolve(process.cwd(), ".chat_history.json");
    const sampleHistory = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there!" }
    ];
    await fs.writeFile(historyFile, JSON.stringify(sampleHistory, null, 2));
    const output = await captureOutput(() => main(["chat-history"]));
    expect(output).toContain("Conversation History:");
    expect(output).toContain("1. user: Hello");
    expect(output).toContain("2. assistant: Hi there!");
    // Cleanup
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
});
