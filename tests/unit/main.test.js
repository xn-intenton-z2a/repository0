import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main } from "@src/lib/main.js";
import pkg from "../../package.json" assert { type: "json" };
import fs from "@src/lib/fsWrapper.js";

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
      "--ingest   Fetch and ingest a record from the specified URL"
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

  test("should ingest record and exit with code 0", async () => {
    const readSpy = vi.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("File not found");
    });
    const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`Process exit: ${code}`);
    });

    await expect(main(["--ingest", url])).rejects.toThrow("Process exit: 0");

    expect(fetch).toHaveBeenCalledWith(url);
    expect(readSpy).toHaveBeenCalled();
    expect(writeSpy).toHaveBeenCalled();
    const [path, content, encoding] = writeSpy.mock.calls[0];
    const saved = JSON.parse(content);
    expect(saved).toEqual([
      {
        id: "1",
        attributes: { name: "Alice", extra: "value" },
      },
    ]);
    expect(encoding).toBe("utf8");
    expect(logSpy).toHaveBeenCalledWith("Ingested record 1");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
