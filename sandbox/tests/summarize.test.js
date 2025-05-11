import { describe, beforeEach, test, expect, vi } from "vitest";
import { readFile, unlink } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Mock OpenAI client
vi.mock("openai", () => {
  return {
    Configuration: vi.fn(),
    OpenAIApi: vi.fn().mockImplementation(() => {
      return {
        createChatCompletion: vi.fn().mockResolvedValue({
          data: {
            choices: [
              {
                message: {
                  content: "Test summary"
                }
              }
            ]
          }
        })
      };
    })
  };
});

import { summarize, main, usage } from "../../sandbox/source/main.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = join(__dirname, "fixtures");
const sampleMd = join(fixtureDir, "sample.md");
const summaryText = "Test summary";

describe("Summarize command", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key";
  });

  test("summarize returns summary string for stdout", async () => {
    const summary = await summarize(sampleMd);
    expect(summary).toBe(summaryText);
  });

  test("summarize writes to output file when -o flag is used", async () => {
    const output = join(fixtureDir, "summary.txt");
    try {
      await unlink(output);
    } catch {}
    const summary = await summarize(sampleMd, output);
    const content = await readFile(output, "utf8");
    expect(content).toBe(summaryText);
  });

  test("main throws error for missing input file", async () => {
    await expect(main(["summarize"])).rejects.toThrow(usage());
  });

  test("summarize throws error when API key missing", async () => {
    delete process.env.OPENAI_API_KEY;
    await expect(summarize(sampleMd)).rejects.toThrow("Missing OpenAI API key");
  });
});
