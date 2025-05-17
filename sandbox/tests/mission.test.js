import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import { spawnSync } from "child_process";

describe("CLI Mission Flag", () => {
  beforeEach(() => {
    vi.spyOn(fs, "readFileSync").mockReturnValue("Repo Mission: Showcase workflows");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("prints mission content and exits", () => {
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    const result = spawnSync("node", ["sandbox/source/main.js", "--mission"], {
      encoding: "utf8",
    });
    expect(result.stdout.trim()).toBe("Repo Mission: Showcase workflows");
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  });
});