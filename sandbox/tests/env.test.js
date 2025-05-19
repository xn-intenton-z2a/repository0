import { describe, test, expect, afterEach } from "vitest";
import path from "path";
import { spawnSync } from "child_process";
import fs from "fs";

const envPath = path.resolve(".env");

describe("--env CLI option", () => {
  afterEach(() => {
    if (fs.existsSync(envPath)) {
      fs.unlinkSync(envPath);
    }
  });

  test("prints value of known variable and exits 0", () => {
    fs.writeFileSync(envPath, "API_KEY=abc123");
    const result = spawnSync("node", ["sandbox/source/main.js", "--env", "API_KEY"], {
      encoding: "utf-8",
    });
    expect(result.stdout.trim()).toBe("abc123");
    expect(result.status).toBe(0);
  });

  test("alias -e works the same", () => {
    fs.writeFileSync(envPath, "KEY=val");
    const result = spawnSync("node", ["sandbox/source/main.js", "-e", "KEY"], {
      encoding: "utf-8",
    });
    expect(result.stdout.trim()).toBe("val");
    expect(result.status).toBe(0);
  });

  test("prints all loaded variables as JSON and exits 0", () => {
    fs.writeFileSync(envPath, "ONE=1\nTWO=2");
    const result = spawnSync("node", ["sandbox/source/main.js", "--env"], {
      encoding: "utf-8",
    });
    const expected = JSON.stringify({ ONE: "1", TWO: "2" }, null, 2);
    expect(result.stdout.trim()).toBe(expected);
    expect(result.status).toBe(0);
  });

  test("missing variable prints error to stderr and exits 1", () => {
    fs.writeFileSync(envPath, "A=1");
    const result = spawnSync("node", ["sandbox/source/main.js", "--env", "B"], {
      encoding: "utf-8",
    });
    expect(result.stderr.trim()).toBe("Missing environment variable: B");
    expect(result.status).toBe(1);
  });
});
