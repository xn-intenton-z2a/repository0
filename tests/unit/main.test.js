import { describe, test, expect } from "vitest";
import http from "http";
import { parseServeArgs, startServer, main } from "@src/lib/main.js";

async function getResponse(port) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${port}/`);
    req.on("response", (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    req.on("error", reject);
  });
}

describe("parseServeArgs", () => {
  test("no flags", () => {
    expect(parseServeArgs([])).toEqual({ serve: false, port: 8080 });
  });

  test("--serve flag only", () => {
    expect(parseServeArgs(["--serve"]))
      .toEqual({ serve: true, port: 8080 });
  });

  test("--serve with port", () => {
    expect(parseServeArgs(["--serve", "3000"]))
      .toEqual({ serve: true, port: 3000 });
  });
});

describe("startServer and HTTP GET /", () => {
  test("responds with Hello World!", async () => {
    const server = await startServer(0);
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : address;
    const response = await getResponse(port);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Hello World!");
    server.close();
  });
});

describe("main", () => {
  test("default behavior logs arguments", async () => {
    const args = ["foo", "bar"];
    const origLog = console.log;
    const log = [];
    console.log = (...msgs) => log.push(msgs.join(" "));
    await main(args);
    expect(log[0]).toBe(`Run with: ${JSON.stringify(args)}`);
    console.log = origLog;
  });
});
