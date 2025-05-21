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
