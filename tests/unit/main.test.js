import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default behavior", () => {
  test("logs args and does not exit", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    await main([]);
    expect(logSpy).toHaveBeenCalledWith("Run with: []");
    expect(exitSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe("fetch-wikipedia CLI option", () => {
  let logSpy;
  let errorSpy;
  let exitSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`exit:${code}`); });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Successful response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue({ extract: "Summary text." }),
    });
    await expect(main(["--fetch-wikipedia", "Term"]))
      .rejects.toThrow("exit:0");
    expect(fetch).toHaveBeenCalledWith(
      "https://en.wikipedia.org/api/rest_v1/page/summary/Term"
    );
    expect(logSpy).toHaveBeenCalledWith("Summary text.");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("Article not found (404)", async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 404 });
    await expect(main(["--fetch-wikipedia", "NotFound"]))
      .rejects.toThrow("exit:1");
    expect(errorSpy).toHaveBeenCalledWith("Article not found: NotFound");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test("Network error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network failure"));
    await expect(main(["--fetch-wikipedia", "ErrorTerm"]))
      .rejects.toThrow("exit:1");
    expect(errorSpy).toHaveBeenCalledWith(
      "Error fetching article: network failure"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test("Disambiguation", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue({ type: "disambiguation", extract: "" }),
    });
    await expect(main(["--fetch-wikipedia", "Term"]))
      .rejects.toThrow("exit:1");
    expect(errorSpy).toHaveBeenCalledWith(
      "Disambiguation page encountered for term: Term"
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
