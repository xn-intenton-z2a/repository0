import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { main } from "../source/main.js";

describe("Conversion Rate Logic", () => {
  let logSpy;
  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    delete process.env.ISSUE_TO_CODE_CONVERSION_RATE;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.ISSUE_TO_CODE_CONVERSION_RATE;
  });

  test("defaults to package.json config (0.5) when no flag or env", () => {
    const result = main([]);
    expect(result.conversionRate).toBe(0.5);
    expect(result.args).toEqual([]);
    expect(logSpy).toHaveBeenCalledWith("Effective conversion rate: 0.5");
  });

  test("uses environment variable override", () => {
    process.env.ISSUE_TO_CODE_CONVERSION_RATE = "0.8";
    const result = main([]);
    expect(result.conversionRate).toBe(0.8);
    expect(logSpy).toHaveBeenCalledWith("Effective conversion rate: 0.8");
  });

  test("uses CLI flag override over env and default", () => {
    process.env.ISSUE_TO_CODE_CONVERSION_RATE = "0.8";
    const result = main(["--conversion-rate", "0.3"]);
    expect(result.conversionRate).toBe(0.3);
    expect(result.args).toEqual(["--conversion-rate", "0.3"]);
    expect(logSpy).toHaveBeenCalledWith("Effective conversion rate: 0.3");
  });

  test.each(["-0.1", "1.1", "abc"])(
    "throws on invalid conversion rate value '%s' via CLI",
    (val) => {
      expect(() => main(["--conversion-rate", val])).toThrow(
        /Invalid conversion rate:/
      );
    }
  );

  test.each(["-0.1", "1.1", "xyz"]) (
    "throws on invalid conversion rate in env '%s'",
    (val) => {
      process.env.ISSUE_TO_CODE_CONVERSION_RATE = val;
      expect(() => main([])).toThrow(/Invalid conversion rate:/);
    }
  );
});
