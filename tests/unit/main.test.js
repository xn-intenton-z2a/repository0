import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Help Option", () => {
  test("should display help message with --help and include --op flag", () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    main(["--help"]);
    const output = spy.mock.calls.flat().join("\n");
    expect(output).toMatch(/Usage/);
    expect(output).toMatch(/CLI Utility/);
    expect(output).toMatch(/--op/);
    spy.mockRestore();
  });

  test("should display help message with help and include --op flag", () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    main(["help"]);
    const output = spy.mock.calls.flat().join("\n");
    expect(output).toMatch(/Usage/);
    expect(output).toMatch(/CLI Utility/);
    expect(output).toMatch(/--op/);
    spy.mockRestore();
  });
});

describe("Feature Command", () => {
  test("should activate feature when '${featureName}' is provided", () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    main(["${featureName}"]);
    const output = spy.mock.calls.flat().join("\n");
    expect(output).toMatch(/Feature \${featureName} activated/);
    spy.mockRestore();
  });
});

describe("Argument Parsing and Operations", () => {
  test("should execute default addition with valid numeric arguments", () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    main(["3", "4"]);
    const output = spy.mock.calls.flat().join("\n");
    expect(output).toMatch(/Result: 7/);
    spy.mockRestore();
  });

  test("should perform subtraction when --op sub is provided", () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    main(["8", "2", "--op", "sub"]);
    const output = spy.mock.calls.flat().join("\n");
    expect(output).toMatch(/Result: 6/);
    spy.mockRestore();
  });

  test("should perform multiplication when --op mul is provided", () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    main(["8", "2", "--op", "mul"]);
    const output = spy.mock.calls.flat().join("\n");
    expect(output).toMatch(/Result: 16/);
    spy.mockRestore();
  });

  test("should perform division when --op div is provided", () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    main(["8", "2", "--op", "div"]);
    const output = spy.mock.calls.flat().join("\n");
    expect(output).toMatch(/Result: 4/);
    spy.mockRestore();
  });

  test("should show error for division by zero with --op div", () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    main(["5", "0", "--op", "div"]);
    const errorOutput = errorSpy.mock.calls.flat().join("\n");
    expect(errorOutput).toMatch(/Division by zero is not allowed/);
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });

  test("should show error for invalid operation flag", () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    main(["5", "2", "--op", "invalid"]);
    const errorOutput = errorSpy.mock.calls.flat().join("\n");
    expect(errorOutput).toMatch(/Invalid operation 'invalid'/);
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });

  test("should show error for insufficient arguments", () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    main(["5"]);
    const errorOutput = errorSpy.mock.calls.flat().join("\n");
    const logOutput = logSpy.mock.calls.flat().join("\n");
    expect(errorOutput).toMatch(/Two numeric arguments are required/);
    expect(logOutput).toMatch(/Usage/);
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });

  test("should show error for non-numeric arguments", () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    main(["a", "2"]);
    const errorOutput = errorSpy.mock.calls.flat().join("\n");
    const logOutput = logSpy.mock.calls.flat().join("\n");
    expect(errorOutput).toMatch(/Both arguments must be valid numbers/);
    expect(logOutput).toMatch(/Usage/);
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });
});
