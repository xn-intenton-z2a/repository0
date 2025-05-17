import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("mission command", () => {
  test("prints the mission statement", () => {
    const output = execSync("node sandbox/source/main.js mission", {
      encoding: "utf8",
    }).trim();
    const missionPath = resolve(__dirname, "../../MISSION.md");
    const expected = readFileSync(missionPath, "utf8").trim();
    expect(output).toBe(expected);
  });
});