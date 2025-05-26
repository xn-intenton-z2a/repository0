import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main } from "@src/lib/main.js";
import pkg from "../../package.json" assert { type: "json" };
import * as graphModule from "@src/lib/graph.js";
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
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => {
        throw new Error("Process exit");
      });
    try {
      main(["--help"]);
    } catch (err) {
      expect(err.message).toBe("Process exit");
    }
    expect(logSpy).toHaveBeenCalledTimes(6);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "Usage: node src/lib/main.js [--help] [--version] [--mission] [--ingest <url>] [--ingest-all <url>]"
    );
    expect(logSpy).toHaveBeenNthCalledWith(2, "--help     Show this help message and exit");
    expect(logSpy).toHaveBeenNthCalledWith(3, "--version  Print version number and exit");
    expect(logSpy).toHaveBeenNthCalledWith(4, "--mission  Print repository mission statement and exit");
    expect(logSpy).toHaveBeenNthCalledWith(
      5,
      "--ingest <url>  Fetch and ingest a record and persist to graph.json"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      6,
      "--ingest-all <url>  Fetch an array of records from URL, normalize each, and append all to graph.json"
    );
    expect(exitSpy).toHaveBeenCalledWith(0);
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("should display version and exit with code 0", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => {
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

  test("should display mission and exit with code 0", () => {
    const missionContent =
      "# Mission\nBuild a knowledge graph of the physical world by crawling public data sources.\n";
    vi.spyOn(fs, "readFileSync").mockReturnValue(missionContent);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => {
        throw new Error("Process exit");
      });
    try {
      main(["--mission"]);
    } catch (err) {
      expect(err.message).toBe("Process exit");
    }
    expect(logSpy).toHaveBeenCalledWith(
      "Build a knowledge graph of the physical world by crawling public data sources."
    );
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
    const appendSpy = vi
      .spyOn(graphModule, "appendRecord")
      .mockResolvedValue();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((code) => {
        throw new Error(`Process exit: ${code}`);
      });

    await expect(main(["--ingest", url])).rejects.toThrow(
      "Process exit: 0"
    );

    expect(fetch).toHaveBeenCalledWith(url);
    expect(appendSpy).toHaveBeenCalledWith({
      id: "1",
      attributes: { name: "Alice", extra: "value" },
    });
    expect(logSpy).toHaveBeenCalledWith("Ingested record with id: 1");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});

describe("Batch Ingest Command", () => {
  const url = "https://example.com/batch";
  const rawArray = [
    { id: 1, foo: "a" },
    { id: 2, foo: "b" },
  ];

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => rawArray,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should batch ingest and exit with code 0", async () => {
    const appendSpy = vi
      .spyOn(graphModule, "appendRecord")
      .mockResolvedValue();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((code) => {
        throw new Error(`Process exit: ${code}`);
      });

    await expect(main(["--ingest-all", url])).rejects.toThrow(
      "Process exit: 0"
    );

    expect(fetch).toHaveBeenCalledWith(url);
    expect(appendSpy).toHaveBeenCalledTimes(rawArray.length);
    expect(logSpy).toHaveBeenCalledWith(
      `Ingested ${rawArray.length} records from ${url}`
    );
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("should error and exit 1 when response is not array", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    }));
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((code) => {
        throw new Error(`Process exit: ${code}`);
      });
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      await main(["--ingest-all", url]);
    } catch (err) {
      expect(err.message).toBe("Process exit: 1");
    }
    expect(errSpy).toHaveBeenCalledWith(
      "Error: --ingest-all endpoint did not return an array"
    );
    exitSpy.mockRestore();
    errSpy.mockRestore();
  });
});
