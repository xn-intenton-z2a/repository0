import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Use absolute path to CLI script so tests work when cwd is not repository root
const cli = `node ${path.join(process.cwd(), 'sandbox/source/main.js')}`;

describe("mission command", () => {
  const tempDir = path.join(os.tmpdir(), "mission-tests");

  beforeEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("success case: prints mission statement", () => {
    const missionContent = "# Mission Statement\nThis is a test mission.\nDetails here.";
    const missionPath = path.join(tempDir, "MISSION.md");
    fs.writeFileSync(missionPath, missionContent);
    const output = execSync(`${cli} mission`, { encoding: "utf-8", cwd: tempDir });
    expect(output).toContain("# Mission Statement");
    expect(output).toContain("This is a test mission.");
    const expected = fs.readFileSync(missionPath, "utf-8");
    expect(output).toContain(expected);
  });

  test("error case: missing MISSION.md errors out", () => {
    let error;
    try {
      execSync(`${cli} mission`, { encoding: "utf-8", cwd: tempDir, stdio: "pipe" });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.status).toBe(1);
    expect(error.stderr).toContain("Error reading mission:");
  });
});
