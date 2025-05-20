import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
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
