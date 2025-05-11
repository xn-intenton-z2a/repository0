import { describe, test, expect } from "vitest";
import { convert, main, usage } from "../../sandbox/source/main.js";
import { readFile, unlink } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = join(__dirname, "fixtures");
const sampleMd = join(fixtureDir, "sample.md");

describe("Markdown to HTML conversion", () => {
  test("convert returns HTML string for stdout", async () => {
    const html = await convert(sampleMd);
    expect(html).toContain("<h1>Sample</h1>");
    expect(html).toContain("<p>This is a sample markdown file.</p>");
  });

  test("convert writes to output file when -o flag is used", async () => {
    const output = join(fixtureDir, "out.html");
    try {
      await unlink(output);
    } catch {}
    await convert(sampleMd, output);
    const html = await readFile(output, "utf8");
    expect(html).toContain("<p>This is a sample markdown file.</p>");
  });

  test("convert throws error for missing input file", async () => {
    await expect(convert("nonexistent.md")).rejects.toThrow("Failed to read input file");
  });

  test("main throws error and prints usage when no arguments", async () => {
    await expect(main([])).rejects.toThrow(usage());
  });
});
