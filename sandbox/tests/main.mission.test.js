import { describe, test, expect, beforeAll, afterAll, vi } from "vitest";
import fs from "fs/promises";
import { run } from "../source/main.js";

describe("Mission Command", () => {
  const missionContent = "# Mission Statement\nTest content";

  beforeAll(() => {
    // Mock readFile to return predictable mission content
    vi.spyOn(fs, "readFile").mockImplementation(async () => missionContent);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should print mission statement when 'mission' is passed", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await run(["mission"]);
    expect(logSpy).toHaveBeenCalledWith(missionContent);
    logSpy.mockRestore();
  });

  test("should print mission statement when '--mission' flag is passed", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await run(["--mission"]);
    expect(logSpy).toHaveBeenCalledWith(missionContent);
    logSpy.mockRestore();
  });
});