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

  test("should output expected message when unknown command is provided", () => {
    const testArgs = ["example"];
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(testArgs);
    expect(spy).toHaveBeenCalledWith(`Unknown command: example`);
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

describe("Arithmetic Commands", () => {
  test("gcd command should compute the greatest common divisor", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["gcd", "12", "18", "24"]);
    expect(spy).toHaveBeenCalledWith(6);
    spy.mockRestore();
  });

  test("lcm command should compute the least common multiple", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["lcm", "4", "5", "10"]);
    expect(spy).toHaveBeenCalledWith(20);
    spy.mockRestore();
  });

  test("prime command should confirm prime and non-prime numbers", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["prime", "7"]);
    expect(spy).toHaveBeenCalledWith("7 is prime");
    spy.mockClear();
    main(["prime", "8"]);
    expect(spy).toHaveBeenCalledWith("8 is not prime");
    spy.mockRestore();
  });
});

describe("Diagnostics Command", () => {
  test("should output diagnostics message", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    main(["diagnostics"]);
    expect(spy).toHaveBeenCalledWith("Diagnostics: All systems operational");
    spy.mockRestore();
  });
});
