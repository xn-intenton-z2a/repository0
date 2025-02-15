import { exec } from "child_process";
import { describe, test, expect } from "vitest";

// This is a test

describe("Main Script Execution", () => {
  test("should exit with code 0", (done) => {
    exec(`${process.execPath} ./src/lib/main.js`, (error, stdout, stderr) => {
      expect(error).toBeNull();
      expect(stderr).toBe("");
      done();
    });
  });
});
