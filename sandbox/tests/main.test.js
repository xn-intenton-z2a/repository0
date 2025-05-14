import { describe, test, expect, vi } from "vitest";
import { main } from "../source/main.js";
import fs from "fs";

describe("Main Output", () => {
  test("should terminate without error", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    main([]);
    expect(log).toHaveBeenCalledWith("Run with: []");
    log.mockRestore();
  });

  test("should display mission statement", () => {
    const mockContent = "# Mission Statement\nSample mission text";
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(fs, "readFileSync").mockReturnValue(mockContent);
    main(["--mission"]);
    expect(log).toHaveBeenCalledWith(mockContent);
    vi.restoreAllMocks();
  });

  test("should display version", () => {
    const mockPkg = { version: "1.2.3" };
    const readSpy = vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockPkg));
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const exit = vi.spyOn(process, "exit").mockImplementation(() => {});

    main(["--version"]);

    expect(log).toHaveBeenCalledWith("1.2.3");
    expect(exit).toHaveBeenCalledWith(0);

    readSpy.mockRestore();
    log.mockRestore();
    exit.mockRestore();
  });
});

describe("Help Output", () => {
  test("should display help and exit with code 0 and ignore other flags", () => {
    const logs = [];
    const logSpy = vi.spyOn(console, "log").mockImplementation((...args) => {
      logs.push(args.join(" "));
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    // Spy fs.readFileSync to catch unintended reads
    const fsSpy = vi.spyOn(fs, "readFileSync").mockImplementation(() => "");

    main(["--help"]);

    const expected = [
      "repository0: A CLI demo of our agentic workflows.",
      "",
      "Usage: sandbox/source/main.js [options] [arguments]",
      "",
      "Options:",
      "  --help      Show this help message",
      "  --mission   Print the repository mission statement",
      "  --version   Print the package version",
      "  --license   Print the package license",
      "",
      "Examples:",
      "  npm run start -- --help",
      "  npm run start -- --mission",
      "  npm run start -- --license",
      "  npm run start -- foo bar",
    ];
    expect(logs).toEqual(expected);
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(errorSpy).not.toHaveBeenCalled();

    fsSpy.mockRestore();
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("should only display help when other flags are provided", () => {
    const logs = [];
    const logSpy = vi.spyOn(console, "log").mockImplementation((...args) => {
      logs.push(args.join(" "));
    });
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fsSpy = vi.spyOn(fs, "readFileSync").mockImplementation(() => "");

    main(["--help", "--version", "--mission"]);
    expect(logs[0]).toBe("repository0: A CLI demo of our agentic workflows.");
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(errorSpy).not.toHaveBeenCalled();

    fsSpy.mockRestore();
    logSpy.mockRestore();
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });
});

describe("License Output", () => {
  test("should display license when license field is present", () => {
    const mockPkg = { license: "MIT" };
    const readSpy = vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockPkg));
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});

    main(["--license"]);

    expect(logSpy).toHaveBeenCalledWith("MIT");
    expect(exitSpy).toHaveBeenCalledWith(0);

    vi.restoreAllMocks();
  });

  test("should display missing message and exit with code 1 when license is missing", () => {
    const mockPkg = {};
    const readSpy = vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockPkg));
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});

    main(["--license"]);

    expect(logSpy).toHaveBeenCalledWith("No license specified in package.json.");
    expect(exitSpy).toHaveBeenCalledWith(1);

    vi.restoreAllMocks();
  });

  test("should display missing message and exit with code 1 when license is empty string", () => {
    const mockPkg = { license: "" };
    const readSpy = vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockPkg));
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});

    main(["--license"]);

    expect(logSpy).toHaveBeenCalledWith("No license specified in package.json.");
    expect(exitSpy).toHaveBeenCalledWith(1);

    vi.restoreAllMocks();
  });

  test("should display error and exit with code 1 on read/parse failure", () => {
    const error = new Error("fail");
    const readSpy = vi.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw error;
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});

    main(["--license"]);

    expect(errorSpy).toHaveBeenCalledWith("Error reading license from package.json: fail");
    expect(exitSpy).toHaveBeenCalledWith(1);

    vi.restoreAllMocks();
  });
});
