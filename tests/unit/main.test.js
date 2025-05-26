import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { main } from "@src/lib/main.js";

describe("HELLO_WORLD CLI", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("default mode prints Hello World", () => {
    main([]);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith("Hello World");
  });

  test("diagnostics mode prints Hello World and diagnostics", () => {
    const args = ["--diagnostics", "foo", "bar"];
    main(args);
    expect(logSpy).toHaveBeenCalledTimes(4);
    expect(logSpy.mock.calls[0][0]).toBe("Hello World");
    expect(logSpy.mock.calls[1][0]).toBe(`Node version: ${process.version}`);
    expect(logSpy.mock.calls[2][0]).toBe(`Platform: ${process.platform}`);
    expect(logSpy.mock.calls[3][0]).toBe(`Args: ${JSON.stringify(["foo","bar"])}`);
  });

  test("serve mode responds with Hello World", async () => {
    const server = main(["--serve"]);
    expect(server).toBeDefined();
    await new Promise((resolve) => server.once("listening", resolve));

    const res = await fetch("http://localhost:3000/");
    const text = await res.text();

    expect(res.status).toBe(200);
    expect(text).toBe("Hello World");

    server.close();
  });

  test("programmatic invocation returns undefined for non-serve", () => {
    const result = main(["foo"]);
    expect(result).toBeUndefined();
  });
});
