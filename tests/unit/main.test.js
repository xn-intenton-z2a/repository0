import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main, greet } from "@src/lib/main.js";

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

describe("Greet Command", () => {
  test("should output 'Hello, world!' when no name is provided", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["greet"]);
    expect(spy).toHaveBeenCalledWith("Hello, world!");
    spy.mockRestore();
  });

  test("should output 'Hello, Alice!' when 'Alice' is provided as the name", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["greet", "Alice"]);
    expect(spy).toHaveBeenCalledWith("Hello, Alice!");
    spy.mockRestore();
  });

  test("greet function returns correct greeting", () => {
    expect(greet()).toBe("Hello, world!");
    expect(greet("Bob")).toBe("Hello, Bob!");
  });
});
