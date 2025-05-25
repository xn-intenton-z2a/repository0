import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Main Output", () => {
  test("should terminate without error", async () => {
    process.exitCode = undefined;
    await main();
    expect(process.exitCode).not.toBe(1);
  });
});

describe("Crawl URL", () => {
  let originalFetch;
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    originalFetch = global.fetch;
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    process.exitCode = undefined;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  test("should extract JSON-LD blocks successfully", async () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">{"key": "value"}</script>
          <script type="application/ld+json">{"foo": "bar"}</script>
        </head>
      </html>
    `;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => html,
    });

    await main(["--crawl", "http://example.com"]);
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify([{ key: "value" }, { foo: "bar" }]));
    expect(process.exitCode).not.toBe(1);
  });

  test("should return empty array when no JSON-LD blocks", async () => {
    const html = `<html><head><title>No JSON-LD</title></head><body>Hello</body></html>`;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => html,
    });

    await main(["--crawl", "http://example.com"]);
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify([]));
    expect(process.exitCode).not.toBe(1);
  });

  test("should handle invalid JSON-LD parse error", async () => {
    const html = `<script type="application/ld+json">{"invalid: json"}</script>`;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => html,
    });

    await main(["--crawl", "http://example.com"]);
    expect(errorSpy).toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  test("should handle non-200 response status", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await main(["--crawl", "http://example.com"]);
    expect(errorSpy).toHaveBeenCalledWith("Error fetching URL: 404 Not Found");
    expect(process.exitCode).toBe(1);
  });

  test("should handle fetch rejection", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network failure"));

    await main(["--crawl", "http://example.com"]);
    expect(errorSpy).toHaveBeenCalledWith("Error fetching URL: network failure");
    expect(process.exitCode).toBe(1);
  });

  test("should error when URL is missing", async () => {
    await main(["--crawl"]);
    expect(errorSpy).toHaveBeenCalledWith("Error: URL must be provided with --crawl");
    expect(process.exitCode).toBe(1);
  });
});
