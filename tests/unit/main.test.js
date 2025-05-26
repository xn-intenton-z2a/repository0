import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main } from "@src/lib/main.js";
import pkg from "../../package.json" assert { type: "json" };
import * as graphModule from "@src/lib/graph.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(main).not.toBeNull();
  });
});

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
  });

  test("should display help and exit with code 0", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Process exit");
    });
    try {
      main(["--help"]);
    } catch (err) {
      expect(err.message).toBe("Process exit");
    }
    expect(logSpy).toHaveBeenCalledTimes(4);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "Usage: node src/lib/main.js [--help] [--version] [--ingest <url>]"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      "--help     Show this help message and exit"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      3,
      "--version  Print version number and exit"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      4,
      "--ingest <url>  Fetch and ingest a record and persist to graph.json"
    );
    expect(exitSpy).toHaveBeenCalledWith(0);
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("should display version and exit with code 0", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Process exit");
    });
    try {
      main(["--version"]);
    } catch (err) {
      expect(err.message).toBe("Process exit");
    }
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(pkg.version);
    expect(exitSpy).toHaveBeenCalledWith(0);
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("should log args when no flags are present", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["foo", "bar"]);
    expect(logSpy).toHaveBeenCalledWith('Run with: ["foo","bar"]');
    logSpy.mockRestore();
  });
});

describe("Ingest Command", () => {
  const url = "https://example.com/data";
  const rawRecord = { id: 1, name: "Alice", extra: "value" };

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => rawRecord,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should ingest record via appendRecord and exit with code 0", async () => {
    const appendSpy = vi.spyOn(graphModule, "appendRecord").mockResolvedValue();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`Process exit: ${code}`);
    });

    await expect(main(["--ingest", url])).rejects.toThrow("Process exit: 0");

    expect(fetch).toHaveBeenCalledWith(url);
    expect(appendSpy).toHaveBeenCalledWith({
      id: "1",
      attributes: { name: "Alice", extra: "value" },
    });
    expect(logSpy).toHaveBeenCalledWith("Ingested record with id: 1");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});