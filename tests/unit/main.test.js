import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main } from "@src/lib/main.js";

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
    expect(logSpy).toHaveBeenCalledWith(":-(");
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

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should error for missing equation parameter and return 1", () => {
    const code = main(["--plot"]);
    expect(errorSpy).toHaveBeenCalledWith("No equation specified.");
    expect(errorSpy).toHaveBeenCalledWith("Usage: --plot <equation>");
    expect(code).toBe(1);
  });

  test("should error for invalid expression and return 1", () => {
    const code = main(["--plot", "foo(x)"]);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringMatching(/^Invalid equation:/));
    expect(errorSpy).toHaveBeenCalledWith("Usage: --plot <equation>");
    expect(code).toBe(1);
  });

  test("should error on conflicting flags and return 1", () => {
    let code = main(["--plot", "x^2", "--emotion", "happy"]);
    expect(errorSpy).toHaveBeenCalledWith(
      "Conflicting options: --plot cannot be used with --emotion or --serve."
    );
    expect(errorSpy).toHaveBeenCalledWith("Usage:");
    expect(errorSpy).toHaveBeenCalledWith("  --emotion <name>");
    expect(errorSpy).toHaveBeenCalledWith("  --plot <equation>");
    expect(code).toBe(1);

    errorSpy.mockClear();
    code = main(["--plot", "x^2", "--serve"]);
    expect(errorSpy).toHaveBeenCalledWith(
      "Conflicting options: --plot cannot be used with --emotion or --serve."
    );
    expect(code).toBe(1);
  });

  test("should plot constant zero and return 0", () => {
    const code = main(["--plot", "0"]);
    expect(code).toBe(0);
    // grid printed: 20 rows
    expect(logSpy).toHaveBeenCalledTimes(20);
    // each row length 80 and all stars
    for (const call of logSpy.mock.calls) {
      const line = call[0];
      expect(typeof line).toBe("string");
      expect(line).toHaveLength(80);
    }
    // middle row should be full of stars
    const mid = Math.floor(20 / 2);
    const midLine = logSpy.mock.calls[mid][0];
    expect(midLine).toMatch(/^\*{80}$/);
  });
});
