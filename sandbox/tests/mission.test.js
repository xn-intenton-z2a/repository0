import { describe, test, expect, vi } from "vitest";
import fs from "fs";
import { main } from "../source/main.js";

describe("Mission Command", () => {
  test("Valid Mission File", () => {
    const mockContent = "# Mission Statement\nSample mission text";
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    vi.spyOn(fs, "readFileSync").mockReturnValue(mockContent);

    main(["--mission"]);

    expect(logSpy).toHaveBeenCalledWith(mockContent);
    expect(exitSpy).toHaveBeenCalledWith(0);

    vi.restoreAllMocks();
  });

  test("Read Failure", () => {
    const error = new Error("fail");
    vi.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw error;
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});

    main(["--mission"]);

    expect(errorSpy).toHaveBeenCalledWith(`Error reading mission file: ${error.message}`);
    expect(exitSpy).toHaveBeenCalledWith(1);

    vi.restoreAllMocks();
  });
});
