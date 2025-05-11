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
