import { describe, test, expect } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main, gcd } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
  });
});

describe("GCD Function", () => {
  test("gcd of 48 and 18 returns 6", () => {
    expect(gcd(48, 18)).toBe(6);
  });
  test("gcd of 100 and 10 returns 10", () => {
    expect(gcd(100, 10)).toBe(10);
  });
  test("gcd of 7 and 13 (coprime) returns 1", () => {
    expect(gcd(7, 13)).toBe(1);
  });
  test("gcd of same numbers returns the number", () => {
    expect(gcd(20, 20)).toBe(20);
  });
  test("should throw error on non-positive integers", () => {
    expect(() => gcd(0, 10)).toThrow("gcd function requires two positive integers");
    expect(() => gcd(10, 0)).toThrow("gcd function requires two positive integers");
  });
});
