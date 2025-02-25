import { describe, test, expect } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

// Ensure that process.exit does not terminate tests
process.env.NODE_ENV = "test";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should display usage and demo output when no arguments are provided", () => {
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (msg) => { output += msg + "\n"; };
    main([]);
    console.log = originalConsoleLog;
    expect(output).toContain("Usage: node src/lib/main.js [options]");
    expect(output).toContain("Demo Output: Run with: []");
  });
});

describe("Help Functionality", () => {
  test("should display help message when --help is passed", () => {
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (msg) => { output += msg; };
    main(["--help"]);
    console.log = originalConsoleLog;
    expect(output).toContain("Usage: node src/lib/main.js [options]");
    // Ensure that demo output is not printed when --help is used
    expect(output).not.toContain("Demo Output: Run with: []");
  });
});

describe("Version Functionality", () => {
  test("should display version info when --version is passed", () => {
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (msg) => { output += msg; };
    main(["--version"]);
    console.log = originalConsoleLog;
    expect(output).toMatch(/Version: \d+\.\d+\.\d+/);
  });
});

describe("Example OWL Functionality", () => {
  test("should display OWL example as JSON when --example-owl is passed", () => {
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (msg) => { output += msg + "\n"; };
    main(["--example-owl"]);
    console.log = originalConsoleLog;
    expect(output).toContain("Example OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/tea.owl"');
    expect(output).toContain('"Tea"');
  });
});

describe("Fetch OWL Functionality", () => {
  test("should fetch countries data and display OWL ontology JSON when --fetch-owl is passed", async () => {
    // Backup the original fetch
    const originalFetch = global.fetch;
    // Stub fetch to return a controlled response mimicking REST Countries API
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
    // Restore the original fetch
    global.fetch = originalFetch;
    expect(output).toContain("Fetched OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/countries.owl"');
    expect(output).toContain("France");
  });
});

describe("Build OWL Functionality", () => {
  test("should display built OWL ontology as JSON when --build-owl is passed", () => {
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (msg) => { output += msg + "\n"; };
    main(["--build-owl"]);
    console.log = originalConsoleLog;
    expect(output).toContain("Built OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/built.owl"');
    expect(output).toContain("Demo Class");
  });
});
