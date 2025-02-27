import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should terminate without error and output an empty array when no args provided", () => {
    const consoleSpy = vi.spyOn(console, "log");
    main();
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: []`);
    consoleSpy.mockRestore();
  });

  test("should work with provided arguments", () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["--diagnostics"];
    main(args);
    expect(consoleSpy).toHaveBeenCalledWith(`Run with: ${JSON.stringify(args)}`);
    consoleSpy.mockRestore();
  });
});
