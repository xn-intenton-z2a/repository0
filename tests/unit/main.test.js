import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should output default message when no arguments provided", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    main([]);
    expect(spy).toHaveBeenCalledWith("No CLI arguments provided");
    spy.mockRestore();
  });

  test("should output expected message when arguments are provided", () => {
    const testArgs = ["example"];
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(testArgs);
    expect(spy).toHaveBeenCalledWith(`Run with: ${JSON.stringify(testArgs)}`);
    spy.mockRestore();
  });
});
