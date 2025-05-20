import { describe, test, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
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
        const res = await fetch(`${baseUrl}${endpoint}${query}`);
        const text = await res.text();
        expect(text).toEqual(expected);
      }
    );
  }
});
