import { describe, test, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(main).not.toBeNull();
  });
});

describe("ASCII Face Renderer", () => {
  const faces = {
    happy: `\n  ^_^\n`,
    sad: `\n  T_T\n`,
    surprised: `\n  O_O\n`,
    angry: `\n  >:(\n`,
    neutral: `\n  -_-\n`,
  };

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.each([
    [["happy"], faces.happy],
    [["--emotion", "happy"], faces.happy],
    [["sad"], faces.sad],
    [["--emotion", "sad"], faces.sad],
    [["surprised"], faces.surprised],
    [["--emotion", "surprised"], faces.surprised],
    [["angry"], faces.angry],
    [["--emotion", "angry"], faces.angry],
  ])("logs correct face for args %p", (input, expected) => {
    main(input);
    expect(console.log).toHaveBeenCalledWith(expected);
  });

  test.each([
    [[], faces.neutral],
    [["confused"], faces.neutral],
    [["--emotion", "confused"], faces.neutral],
    [["-x"], faces.neutral],
  ])("fallbacks to neutral for args %p", (input, expected) => {
    main(input);
    expect(console.log).toHaveBeenCalledWith(expected);
  });
});

describe("HTTP Interface", () => {
  const faces = {
    happy: `\n  ^_^\n`,
    sad: `\n  T_T\n`,
    surprised: `\n  O_O\n`,
    angry: `\n  >:(\n`,
    neutral: `\n  -_-\n`,
  };
  let server;
  let baseUrl;

  beforeAll(async () => {
    // Start server on ephemeral port
    server = main(["--serve", "--port", "0"]);
    await new Promise((resolve) => server.on("listening", resolve));
    const address = server.address();
    const port = typeof address === "object" ? address.port : address;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(() => {
    server.close();
  });

  const endpoints = ["/", "/face"];
  const testCases = [
    ["happy", faces.happy],
    ["sad", faces.sad],
    ["surprised", faces.surprised],
    ["angry", faces.angry],
    [undefined, faces.neutral],
    ["confused", faces.neutral],
  ];

  for (const endpoint of endpoints) {
    test.each(testCases)(
      `GET ${endpoint} with emotion=%s returns expected face`,
      async (emotion, expected) => {
        const query = emotion ? `?emotion=${emotion}` : "";
        const url = `${baseUrl}${endpoint}${query}`;
        const res = await fetch(url);
        expect(res.status).toBe(200);
        expect(res.headers.get("content-type")).toMatch(/text\/plain/);
        const text = await res.text();
        expect(text).toEqual(expected);
      }
    );
  }

  test("GET invalid path returns 404", async () => {
    const res = await fetch(`${baseUrl}/invalid`);
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toMatch(/text\/plain/);
    const text = await res.text();
    expect(text).toEqual("Not Found");
  });

  test("GET /emotions returns default emotions list", async () => {
    const res = await fetch(`${baseUrl}/emotions`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/application\/json/);
    const json = await res.json();
    expect(json).toEqual(Object.keys(faces));
  });
});

describe("CLI: Custom Config", () => {
  const tmpDir = os.tmpdir();
  const jsonPath = path.join(tmpDir, "custom-test.json");
  const yamlPath = path.join(tmpDir, "custom-test.yaml");
  const badSchemaPath = path.join(tmpDir, "bad-schema.json");

  beforeAll(() => {
    fs.writeFileSync(jsonPath, JSON.stringify({ confused: "\n  o_O\n" }));
    fs.writeFileSync(
      yamlPath,
      `confused: |\n  o_O\n`
    );
    fs.writeFileSync(badSchemaPath, JSON.stringify({ confused: 123 }));
  });

  afterAll(() => {
    [jsonPath, yamlPath, badSchemaPath].forEach((p) => fs.unlinkSync(p));
  });

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("uses custom JSON mapping and falls back to defaults", () => {
    main(["--config", jsonPath, "confused"]);
    expect(console.log).toHaveBeenCalledWith("\n  o_O\n");
  });

  test("uses custom YAML mapping and falls back to defaults", () => {
    main(["--config", yamlPath, "confused"]);
    expect(console.log).toHaveBeenCalledWith("\n  o_O\n");
  });

  test("fallback to default when emotion not in custom", () => {
    main(["--config", jsonPath, "happy"]);
    expect(console.log).toHaveBeenCalledWith(`\n  ^_^\n`);
  });

  test("exits with error for missing config file", () => {
    vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`exit ${code}`); });
    expect(() => main(["--config", "no-such.json"])).toThrow("exit 1");
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Error loading config file"));
  });

  test("exits with error for invalid schema in config", () => {
    vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`exit ${code}`); });
    expect(() => main(["--config", badSchemaPath, "confused"])).toThrow("exit 1");
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Error loading config file"));
  });
});

describe("CLI: List Emotions", () => {
  const tmpDir = os.tmpdir();
  const jsonPath = path.join(tmpDir, "list-custom.json");

  beforeAll(() => {
    fs.writeFileSync(jsonPath, JSON.stringify({ confused: "\n  o_O\n" }));
  });

  afterAll(() => {
    fs.unlinkSync(jsonPath);
  });

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("lists default emotions with --list-emotions", () => {
    main(["--list-emotions"]);
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify(["happy", "sad", "surprised", "angry", "neutral"])
    );
  });

  test("lists default emotions with --list alias", () => {
    main(["--list"]);
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify(["happy", "sad", "surprised", "angry", "neutral"])
    );
  });

  test("lists merged emotions with custom config", () => {
    main(["--config", jsonPath, "--list-emotions"]);
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify([
        "happy",
        "sad",
        "surprised",
        "angry",
        "neutral",
        "confused",
      ])
    );
  });
});

describe("HTTP Interface: Custom Config", () => {
  const tmpDir = os.tmpdir();
  const jsonPath = path.join(tmpDir, "custom-http.json");
  beforeAll(async () => {
    fs.writeFileSync(jsonPath, JSON.stringify({ confused: "\n  o_O\n" }));
  });
  afterAll(() => {
    fs.unlinkSync(jsonPath);
  });

  let server;
  let baseUrl;

  beforeAll(async () => {
    server = main(["--serve", "--config", jsonPath, "--port", "0"]);
    await new Promise((resolve) => server.on("listening", resolve));
    const addr = server.address();
    const port = typeof addr === "object" ? addr.port : addr;
    baseUrl = `http://127.0.0.1:${port}`;
  });
  afterAll(() => {
    server.close();
  });

  test("GET /?emotion=confused returns custom mapping", async () => {
    const res = await fetch(`${baseUrl}/?emotion=confused`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toEqual("\n  o_O\n");
  });

  test("server fails to start with invalid config path", () => {
    expect(() => main(["--serve", "--config", "no.json"]))
      .toThrow();
  });

  test("GET /emotions returns merged emotions list", async () => {
    const res = await fetch(`${baseUrl}/emotions`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/application\/json/);
    const json = await res.json();
    expect(json).toEqual([
      "happy",
      "sad",
      "surprised",
      "angry",
      "neutral",
      "confused",
    ]);
  });
});

// HTML Interface tests

describe("HTML Interface", () => {
  const faces = {
    happy: `\n  ^_^\n`,
    sad: `\n  T_T\n`,
    surprised: `\n  O_O\n`,
    angry: `\n  >:(\n`,
    neutral: `\n  -_-\n`,
  };
  let server;
  let baseUrl;

  beforeAll(async () => {
    server = main(["--serve", "--port", "0"]);
    await new Promise((resolve) => server.on("listening", resolve));
    const addr = server.address();
    const port = typeof addr === "object" ? addr.port : addr;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(() => {
    server.close();
  });

  test.each([
    ["happy", faces.happy],
    [undefined, faces.neutral],
    ["unknown", faces.neutral],
  ])(
    "GET /html?emotion=%s returns HTML with expected face",
    async (emotion, expected) => {
      const query = emotion ? `?emotion=${emotion}` : "";
      const url = `${baseUrl}/html${query}`;
      const res = await fetch(url);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toMatch(/text\/html/);
      const text = await res.text();
      const expectedPre = `<pre>${expected}</pre>`;
      expect(text).toContain(expectedPre);
    }
  );
});

// Diagnostics Mode Tests

describe("Diagnostics", () => {
  const tmpDir = os.tmpdir();
  const jsonPath = path.join(tmpDir, "diag-config.json");
  const defaultFaces = {
    happy: `\n  ^_^\n`,
    sad: `\n  T_T\n`,
    surprised: `\n  O_O\n`,
    angry: `\n  >:(\n`,
    neutral: `\n  -_-\n`,
  };

  beforeAll(() => {
    fs.writeFileSync(jsonPath, JSON.stringify({ foo: "\n  f_0\n" }));
  });

  afterAll(() => {
    fs.unlinkSync(jsonPath);
  });

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`exit:${code}`); });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("outputs default diagnostics and exits", () => {
    expect(() => main(["--diagnostics"]))
      .toThrow("exit:0");
    expect(console.log).toHaveBeenCalledTimes(1);
    const logged = console.log.mock.calls[0][0];
    const obj = JSON.parse(logged);
    expect(obj).toHaveProperty("version");
    expect(obj.defaultEmotions).toEqual(Object.keys(defaultFaces));
    expect(obj.loadedConfigPath).toBe(null);
    expect(obj.customEmotionsCount).toBe(0);
    expect(obj.serveMode).toBe(false);
    expect(obj.listMode).toBe(false);
  });

  test("outputs diagnostics with custom config and exits", () => {
    expect(() => main(["--config", jsonPath, "--diagnostics"]))
      .toThrow("exit:0");
    expect(console.log).toHaveBeenCalledTimes(1);
    const logged = console.log.mock.calls[0][0];
    const obj = JSON.parse(logged);
    expect(obj.loadedConfigPath).toBe(jsonPath);
    expect(obj.customEmotionsCount).toBe(1);
  });
});
