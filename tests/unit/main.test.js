import { describe, test, expect, vi } from "vitest";
import http from "http";
import {
  parseOpenPrsArg,
  openPrs,
  parseConsolidatedPrArg,
  openConsolidatedPr,
  parseMissionArg,
  readMission,
  parseDiagnosticsArg,
  collectDiagnostics,
  parseServeArgs,
  startServer,
  main
} from "@src/lib/main.js";

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

describe("parseOpenPrsArg", () => {
  test("no flags", () => {
    expect(parseOpenPrsArg([])).toBe(false);
  });

  test("--open-prs flag only", () => {
    expect(parseOpenPrsArg(["--open-prs"]))
      .toBe(true);
  });
});

describe("openPrs", () => {
  test("executes commands in order and resolves", async () => {
    const execCalls = [];
    vi.spyOn(require('child_process'), 'exec').mockImplementation((cmd, cb) => {
      execCalls.push(cmd);
      cb(null, 'stdout', '');
    });
    await expect(openPrs()).resolves.toBeUndefined();
    expect(execCalls).toEqual([
      'gh auth status',
      'git checkout -b pr-2188',
      'gh pr create --title "Implement feature for issue #2188" --body "Resolves issue #2188"',
      'gh auth status',
      'git checkout -b pr-2193',
      'gh pr create --title "Implement feature for issue #2193" --body "Resolves issue #2193"'
    ]);
    require('child_process').exec.mockRestore();
  });
});

describe("parseConsolidatedPrArg", () => {
  test("no flags", () => {
    expect(parseConsolidatedPrArg([])).toBe(false);
  });
  test("--open-prs-consolidated flag only", () => {
    expect(parseConsolidatedPrArg(["--open-prs-consolidated"]))
      .toBe(true);
  });
});

describe("openConsolidatedPr", () => {
  test("executes commands in sequence and logs success", async () => {
    const execSeq = [];
    vi.spyOn(require('child_process'), 'exec').mockImplementation((cmd, cb) => {
      execSeq.push(cmd);
      cb(null, '', '');
    });
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await expect(openConsolidatedPr()).resolves.toBeUndefined();
    expect(execSeq).toEqual([
      'gh auth status',
      'git checkout -b open-prs-http-diagnostics',
      'gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"'
    ]);
    expect(logSpy).toHaveBeenCalledWith('Opened consolidated PR for HTTP server and diagnostics');
    require('child_process').exec.mockRestore();
    logSpy.mockRestore();
  });
});

describe("parseMissionArg", () => {
  test("no flags", () => {
    expect(parseMissionArg([])).toBe(false);
  });

  test("--mission flag only", () => {
    expect(parseMissionArg(["--mission"]))
      .toBe(true);
  });
});

describe("readMission", () => {
  test("returns mission content including title", async () => {
    const content = await readMission();
    expect(content).toContain("# repository0");
  });
});

describe("parseDiagnosticsArg", () => {
  test("no flags", () => {
    expect(parseDiagnosticsArg([])).toBe(false);
  });

  test("--diagnostics flag only", () => {
    expect(parseDiagnosticsArg(["--diagnostics"]))
      .toBe(true);
  });
});

describe("collectDiagnostics", () => {
  test("returns correct structure and types", () => {
    const diag = collectDiagnostics();
    expect(typeof diag.version).toBe("string");
    expect(typeof diag.uptime).toBe("number");
    expect(typeof diag.platform).toBe("string");
    expect(typeof diag.arch).toBe("string");
    expect(typeof diag.memoryUsage.rss).toBe("number");
    expect(typeof diag.memoryUsage.heapTotal).toBe("number");
    expect(typeof diag.memoryUsage.heapUsed).toBe("number");
  });
});

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

describe("main consolidated mode", () => {
  test("calls openConsolidatedPr and exits", async () => {
    const execMock = vi.spyOn(require('child_process'), 'exec').mockImplementation((cmd, cb) => cb(null, '', ''));
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`Exit:${code}`); });
    try {
      await main(["--open-prs-consolidated"]);
    } catch (err) {
      expect(err.message).toBe("Exit:0");
    }
    expect(execMock).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Opened consolidated PR for HTTP server and diagnostics');
    execMock.mockRestore();
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe("main conflict and help", () => {
  test("conflicting flags exit 1", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`Exit:${code}`); });
    try {
      await main(["--mission", "--diagnostics"]);
    } catch (err) {
      expect(err.message).toBe("Exit:1");
    }
    expect(errSpy).toHaveBeenCalledWith("Error: --mission and --diagnostics cannot be used together");
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("help flag prints usage and exits 0", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`Exit:${code}`); });
    try {
      await main(["--help"]);
    } catch (err) {
      expect(err.message).toBe("Exit:0");
    }
    expect(logSpy).toHaveBeenCalled();
    const helpMsg = logSpy.mock.calls[0][0];
    expect(helpMsg).toContain("Usage: node src/lib/main.js");
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe("main open-prs mode", () => {
  test("calls openPrs and exits", async () => {
    const execMock = vi.spyOn(require('child_process'), 'exec').mockImplementation((cmd, cb) => cb(null, '', ''));
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`Exit:${code}`); });
    try {
      await main(["--open-prs"]);
    } catch (err) {
      expect(err.message).toBe("Exit:0");
    }
    expect(execMock).toHaveBeenCalledTimes(6);
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith("Opened PR for issue #2188");
    expect(logSpy).toHaveBeenCalledWith("Opened PR for issue #2193");
    execMock.mockRestore();
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe("main mission mode", () => {
  test("prints mission and exits", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`Exit:${code}`); });

    try {
      await main(["--mission"]);
    } catch (err) {
      expect(err.message).toBe("Exit:0");
    }

    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    expect(output).toContain("# repository0");

    logSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe("main diagnostics mode", () => {
  test("prints diagnostics and exits", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`Exit:${code}`); });

    try {
      await main(["--diagnostics"]);
    } catch (err) {
      expect(err.message).toBe("Exit:0");
    }

    expect(logSpy).toHaveBeenCalled();
    const parsed = JSON.parse(logSpy.mock.calls[0][0]);
    expect(parsed).toHaveProperty("version");
    expect(parsed).toHaveProperty("uptime");
    expect(parsed).toHaveProperty("memoryUsage");
    expect(parsed).toHaveProperty("platform");
    expect(parsed).toHaveProperty("arch");

    logSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe("main default mode", () => {
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
