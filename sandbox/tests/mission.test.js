import { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import { main } from "../source/main.js";

describe("Mission command (--mission and -m)", () => {
  let logSpy;
  let missionContent;

  beforeAll(async () => {
    missionContent = await fs.readFile(path.resolve("MISSION.md"), "utf-8");
  });

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("prints mission with --mission", async () => {
    await main(["--mission"]);
    expect(logSpy).toHaveBeenCalledWith(missionContent);
  });

  test("prints mission with -m alias", async () => {
    await main(["-m"]);
    expect(logSpy).toHaveBeenCalledWith(missionContent);
  });
});
