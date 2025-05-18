import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import path from "path";
import { main } from "../source/main.js";

describe("--render CLI option", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("renders EJS with JSON data", async () => {
    const tpl = path.resolve("sandbox/tests/fixtures/template.ejs");
    const data = path.resolve("sandbox/tests/fixtures/data.json");
    await main(["--render", tpl, data]);
    expect(logSpy).toHaveBeenCalledWith("Hello Alice! You have 3 items.");
  });

  test("renders EJS with YAML data", async () => {
    const tpl = path.resolve("sandbox/tests/fixtures/template.ejs");
    const data = path.resolve("sandbox/tests/fixtures/data.yaml");
    await main(["--render", tpl, data]);
    expect(logSpy).toHaveBeenCalledWith("Hello Alice! You have 3 items.");
  });
});
