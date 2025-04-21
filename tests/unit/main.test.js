import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

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

describe("Help Option", () => {
  test("should display help message with --help", () => {
    const spy = vi.spyOn(console, 'log');
    main(["--help"]);
    const output = spy.mock.calls.flat().join("\n");
    expect(output).toMatch(/Usage/);
    expect(output).toMatch(/\$\{featureName\}/);
    expect(output).toMatch(/options/i);
    spy.mockRestore();
  });

  test("should display help message with help", () => {
    const spy = vi.spyOn(console, 'log');
    main(["help"]);
    const output = spy.mock.calls.flat().join("\n");
    expect(output).toMatch(/Usage/);
    expect(output).toMatch(/\$\{featureName\}/);
    expect(output).toMatch(/options/i);
    spy.mockRestore();
  });
});
