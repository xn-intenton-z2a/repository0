import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main } from "@src/lib/main.js";
import http from "http";

describe("DISPLAY_EMOTION CLI", () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should display happy ASCII art and return 0", () => {
    const code = main(["--emotion", "happy"]);
    expect(logSpy).toHaveBeenCalledWith(":-)");
    expect(errorSpy).not.toHaveBeenCalled();
    expect(code).toBe(0);
  });

  test("should display sad ASCII art and return 0", () => {
    const code = main(["--emotion", "sad"]);
    expect(logSpy).toHaveBeenCalledWith(":-((");
    expect(errorSpy).not.toHaveBeenCalled();
    expect(code).toBe(0);
  });

  test("should error for unsupported emotion and return 1", () => {
    const code = main(["--emotion", "foo"]);
    expect(errorSpy).toHaveBeenCalledWith("Unsupported emotion: foo");
    expect(errorSpy).toHaveBeenCalledWith(
      "Supported emotions: happy, sad, angry, surprised"
    );
    expect(code).toBe(1);
  });

  test("should show usage when no flag and return 0", () => {
    const code = main([]);
    expect(logSpy).toHaveBeenCalledWith("Usage: --emotion <name>");
    expect(logSpy).toHaveBeenCalledWith(
      "Supported emotions: happy, sad, angry, surprised"
    );
    expect(code).toBe(0);
  });

  test("should error when no emotion provided and return 1", () => {
    const code = main(["--emotion"]);
    expect(errorSpy).toHaveBeenCalledWith("No emotion specified.");
    expect(logSpy).toHaveBeenCalledWith("Usage: --emotion <name>");
    expect(logSpy).toHaveBeenCalledWith(
      "Supported emotions: happy, sad, angry, surprised"
    );
    expect(code).toBe(1);
  });
});

describe("PLOT_EQUATION CLI", () => {
  let logSpy;
  let errorSpy;
  let createServerSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should plot a simple equation and return 0", () => {
    const code = main(["--plot", "x+1"]);
    expect(logSpy).toHaveBeenCalled();
    expect(code).toBe(0);
  });

  test("should error when no equation provided and return 1", () => {
    const code = main(["--plot"]);
    expect(errorSpy).toHaveBeenCalledWith("No equation specified.");
    expect(logSpy).toHaveBeenCalledWith("Usage: --plot <equation>");
    expect(logSpy).toHaveBeenCalledWith("Usage: --serve [--port <number>]");
    expect(logSpy).toHaveBeenCalledWith("Usage: --emotion <name>");
    expect(code).toBe(1);
  });

  test("should error on invalid equation and return 1", () => {
    const code = main(["--plot", "invalid@@"]);
    expect(errorSpy).toHaveBeenCalledWith("Invalid equation: invalid@@");
    expect(logSpy).toHaveBeenCalledWith("Usage: --plot <equation>");
    expect(code).toBe(1);
  });

  test("should start HTTP server on default port and return 0", () => {
    createServerSpy = vi.spyOn(http, "createServer").mockReturnValue({
      listen: (port, cb) => cb(),
    });
    const code = main(["--serve"]);
    expect(createServerSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("Server listening on port 3000");
    expect(code).toBe(0);
  });

  test("should start HTTP server on given port and return 0", () => {
    createServerSpy = vi.spyOn(http, "createServer").mockReturnValue({
      listen: (port, cb) => cb(),
    });
    const code = main(["--serve", "--port", "4000"]);
    expect(createServerSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("Server listening on port 4000");
    expect(code).toBe(0);
  });

  test("should error on invalid port and return 1", () => {
    const code = main(["--serve", "--port", "abc"]);
    expect(errorSpy).toHaveBeenCalledWith("Invalid port number.");
    expect(logSpy).toHaveBeenCalledWith("Usage: --plot <equation>");
    expect(logSpy).toHaveBeenCalledWith("Usage: --serve [--port <number>]");
    expect(logSpy).toHaveBeenCalledWith("Usage: --emotion <name>");
    expect(code).toBe(1);
  });

  test("should enforce mutual exclusivity and return 1", () => {
    const code = main(["--emotion", "happy", "--plot", "x+1"]);
    expect(errorSpy).toHaveBeenCalledWith(
      "Flags --emotion, --plot, and --serve are mutually exclusive."
    );
    expect(logSpy).toHaveBeenCalledWith("Usage: --emotion <name>");
    expect(code).toBe(1);
  });
});
