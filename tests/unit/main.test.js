import { describe, test, expect } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

// Ensure that process.exit does not terminate tests
process.env.NODE_ENV = "test";

// Utility to capture console output
function captureConsole(callback) {
  let output = "";
  const originalConsoleLog = console.log;
  console.log = (msg) => { output += msg + "\n"; };
  callback();
  console.log = originalConsoleLog;
  return output;
}

// Utility to capture async console output
async function captureConsoleAsync(callback) {
  let output = "";
  const originalConsoleLog = console.log;
  console.log = (msg) => { output += msg + "\n"; };
  await callback();
  console.log = originalConsoleLog;
  return output;
}

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should display usage and demo output when no arguments are provided", () => {
    const output = captureConsole(() => { main([]); });
    expect(output).toContain("Usage: node src/lib/main.js [options]");
    expect(output).toContain("Demo Output: Run with: []");
  });
});

describe("Help Functionality", () => {
  test("should display help message when --help is passed", () => {
    const output = captureConsole(() => { main(["--help"]); });
    expect(output).toContain("Usage: node src/lib/main.js [options]");
    expect(output).not.toContain("Demo Output: Run with: []");
  });
});

describe("Version Functionality", () => {
  test("should display version info when --version is passed", () => {
    const output = captureConsole(() => { main(["--version"]); });
    expect(output).toMatch(/Version: \d+\.\d+\.\d+/);
  });
});

describe("Example OWL Functionality", () => {
  test("should display OWL example as JSON when --example-owl is passed", () => {
    const output = captureConsole(() => { main(["--example-owl"]); });
    expect(output).toContain("Example OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/tea.owl"');
    expect(output).toContain("Tea");
  });
});

describe("Fetch OWL Functionality", () => {
  test("should fetch countries data and display OWL ontology JSON when --fetch-owl is passed", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => ([
        { name: { common: "France" }, region: "Europe" },
        { name: { common: "Japan" }, region: "Asia" },
        { name: { common: "Brazil" }, region: "Americas" }
      ])
    });
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (msg) => { output += msg + "\n"; };
    await main(["--fetch-owl"]);
    console.log = originalConsoleLog;
    global.fetch = originalFetch;
    expect(output).toContain("Fetched OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/countries.owl"');
    expect(output).toContain("France");
  });
});

describe("Build OWL Functionality", () => {
  test("should display built OWL ontology as JSON when --build-owl is passed", () => {
    const output = captureConsole(() => { main(["--build-owl"]); });
    expect(output).toContain("Built OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/built.owl"');
    expect(output).toContain("Demo Class");
  });
});

describe("Diagnostics Functionality", () => {
  test("should run diagnostics, fetch public API data, and log OWL ontology JSON when --diagnostics is passed", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => new Array(250).fill({})
    });
    const output = await captureConsoleAsync(async () => { await main(["--diagnostics"]); });
    global.fetch = originalFetch;
    expect(output).toContain("Running Diagnostics...");
    expect(output).toMatch(/Fetched \d+ records in \d+ ms\./);
    expect(output).toContain("Diagnostics: OWL Ontology JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/diagnostics.owl"');
  });
});

describe("Unknown Arguments Functionality", () => {
  test("should log unknown arguments when an unrecognized flag is passed", () => {
    const args = ["--unknown", "abc"];
    const output = captureConsole(() => { main(args); });
    expect(output).toContain(`Run with: ${JSON.stringify(args)}`);
  });
});
