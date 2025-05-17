import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { main } from "../source/main.js";

describe("CLI Arithmetic Commands", () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {
      /* noop */
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("add command sums numbers", () => {
    main(["add", "2", "3", "4"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(9);
  });

  test("multiply command multiplies numbers", () => {
    main(["multiply", "2", "3", "4"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(24);
  });

  test("no command echoes args", () => {
    main([]);
    expect(consoleLogSpy).toHaveBeenCalledWith("Run with: []");
  });

  test("unknown command outputs error then usage", () => {
    main(["foo", "1", "2"]);
    expect(consoleLogSpy).toHaveBeenCalledWith("Unknown command: foo");
    expect(consoleLogSpy).toHaveBeenCalledWith("Run with: [\"foo\",\"1\",\"2\"]");
  });
});
