import { describe, test, expect, vi, afterAll } from "vitest";
import http from "http";
import { main, start, diagnostics, serve } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should export functions", () => {
    expect(main).toBeInstanceOf(Function);
    expect(start).toBeInstanceOf(Function);
    expect(diagnostics).toBeInstanceOf(Function);
    expect(serve).toBeInstanceOf(Function);
  });
});

describe("Start Handler", () => {
  test("default main should log empty args", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main();
    expect(logSpy).toHaveBeenCalledWith("Run with: []");
    logSpy.mockRestore();
  });

  test("main start with args should log args array", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["start", "foo", "bar"]);
    expect(logSpy).toHaveBeenCalledWith("Run with: [\"foo\",\"bar\"]");
    logSpy.mockRestore();
  });
});

describe("Diagnostics Handler", () => {
  test("diagnostics should log version, platform, and memory usage", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["diagnostics"]);
    const call = logSpy.mock.calls[0][0];
    expect(call).toMatch(/Node:\s*v\d+\.\d+\.\d+, Platform:\s*\w+, MemoryUsage: \{.*\}/);
    logSpy.mockRestore();
  });
});

describe("Serve Handler", () => {
  let server;
  afterAll(() => {
    server && server.close();
  });

  test("serve should return server listening on port 3000 and respond to /health", async () => {
    // Try direct serve
    server = serve();
    await new Promise((resolve) => server.once("listening", resolve));
    const address = server.address();
    expect(address).toBeTruthy();
    const port = typeof address === "object" && address.port;
    expect(port).toBe(3000);

    // Make HTTP request to /health
    const data = await new Promise((resolve, reject) => {
      http.get("http://localhost:3000/health", (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => resolve({ statusCode: res.statusCode, body: raw }));
      }).on("error", reject);
    });
    expect(data.statusCode).toBe(200);
    expect(JSON.parse(data.body)).toEqual({ status: "ok" });
  });
});

describe("Invalid Command", () => {
  test("should throw on unrecognized command", async () => {
    const err = await expect(main(["invalid"])).rejects.toThrow("Unrecognized command: invalid");
    expect(err.message).toBe("Unrecognized command: invalid");
  });
});
