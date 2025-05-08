import { describe, test, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import { main, SEED_TEMPLATE } from "../source/main.js";

describe("Seed CLI", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("prints SEED_TEMPLATE when no --output and exits with 0", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitMock = vi.spyOn(process, "exit").mockImplementation(code => { throw new Error(`process.exit: ${code}`); });
    expect(() => main(["seed"])).toThrow("process.exit: 0");
    expect(logSpy).toHaveBeenCalledWith(SEED_TEMPLATE);
  });

  test("writes SEED_TEMPLATE to file when --output is specified and exits with 0", () => {
    const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    const exitMock = vi.spyOn(process, "exit").mockImplementation(code => { throw new Error(`process.exit: ${code}`); });
    const file = "dummy.md";
    expect(() => main(["seed", "--output", file])).toThrow("process.exit: 0");
    expect(writeSpy).toHaveBeenCalledWith(file, SEED_TEMPLATE);
  });
});