import { describe, test, expect, vi } from "vitest";
import { main } from "@src/lib/main.js";
import { promises as fs } from "fs";
import { existsSync } from "fs";
import path from "path";
import readline from "readline";

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
        return main([["array"]]);
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

  // New test for NaN string input
  test("chat command with 'NaN' prompt displays error", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";
    const output = await captureOutput(() => {
      try {
        return main(["chat", "--prompt", "NaN"]);
      } catch {} 
    });
    expect(output).toContain("Invalid input: Expected a valid non-empty string command, but received NaN.");
    expect(output).toContain(suggestion);
  });

  // Existing export command tests omitted for brevity...

  // New Tests for chat-interactive command
  test("chat-interactive command terminates on exit", async () => {
    process.env.CHATGPT_API_SECRET_KEY = "test-api-key";

    // Fake the readline interface
    const fakeInterface = {
      question: vi.fn(),
      close: vi.fn()
    };
    const responses = ["Hello interactive", "exit"];
    let callCount = 0;
    fakeInterface.question.mockImplementation((prompt, cb) => {
      cb(responses[callCount]);
      callCount++;
    });
    vi.spyOn(readline, 'createInterface').mockReturnValue(fakeInterface);

    const output = await captureOutput(() => main(["chat-interactive"]));
    expect(output).toContain("Entering interactive chat mode");
    expect(output).toContain("Response from OpenAI");
    expect(output).toContain("Exiting interactive chat session.");
    readline.createInterface.mockRestore();
  });

  // Additional tests for other chat commands remain...
});
