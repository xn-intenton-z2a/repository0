import { describe, test, expect, vi } from "vitest";
import { main } from "@src/lib/main.js";
import pkg from "../../package.json" assert { type: "json" };

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
    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "Usage: node src/lib/main.js [--help] [--version]"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      "--help     Show this help message and exit"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      3,
      "--version  Print version number and exit"
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
