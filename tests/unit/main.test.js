import { describe, test, expect } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

// Set test environment variable to prevent process.exit from terminating tests
process.env.NODE_ENV = "test";

/**
 * Utility function to capture async console output.
 * Captures both console.log and console.error outputs.
 * @param {Function} callback - The async function to execute.
 * @returns {Promise<string>} - The captured output.
 */
async function captureConsoleAsync(callback) {
  let output = "";
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  console.log = (msg) => { output += msg + "\n"; };
  console.error = (msg) => { output += msg + "\n"; };
  await callback();
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  return output;
}


describe("Main Module Import", () => {
  test("module should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("displays usage and demo output when no arguments are provided", async () => {
    const output = await captureConsoleAsync(async () => { await main([]); });
    expect(output).toContain("Usage: node src/lib/main.js [options]");
    expect(output).toContain("Demo Output: Run with: []");
  });
});

describe("Help Functionality", () => {
  test("displays help message when --help is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--help"]); });
    expect(output).toContain("Usage: node src/lib/main.js [options]");
    expect(output).not.toContain("Demo Output: Run with: []");
  });
});

describe("JSON Help Functionality", () => {
  test("displays JSON help when --help-json is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--help-json"]); });
    expect(output).toContain("Help JSON:");
    const jsonString = output.split("Help JSON:")[1].trim();
    let helpObj;
    try {
      helpObj = JSON.parse(jsonString);
    } catch (error) {
      helpObj = null;
    }
    expect(helpObj).not.toBeNull();
    expect(helpObj).toHaveProperty("usage");
    expect(helpObj).toHaveProperty("options");
  });
});

describe("Detailed Version Functionality", () => {
  test("displays detailed version info when --version-full is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--version-full"]); });
    expect(output).toContain("Name:");
    expect(output).toContain("Version:");
    expect(output).toContain("Description:");
  });
});

describe("Version Functionality", () => {
  test("displays version info when --version is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--version"]); });
    expect(output).toMatch(/Version: \d+\.\d+\.\d+/);
  });
});

describe("Example OWL Functionality", () => {
  test("displays example OWL ontology as JSON when --example-owl is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--example-owl"]); });
    expect(output).toContain("Example OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/tea.owl"');
    expect(output).toContain("Tea");
  });
});

describe("Fetch OWL Functionality", () => {
  test("fetches countries data and displays OWL ontology JSON with metadata when --fetch-owl is passed", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => ([
        { name: { common: "France" }, region: "Europe" },
        { name: { common: "Japan" }, region: "Asia" },
        { name: { common: "Brazil" }, region: "Americas" }
      ])
    });
    const output = await captureConsoleAsync(async () => { await main(["--fetch-owl"]); });
    global.fetch = originalFetch;
    expect(output).toContain("Fetched OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/countries.owl"');
    expect(output).toContain("France");
    expect(output).toContain("fetchedAt");
    expect(output).toContain("sourceEndpoint");
    expect(output).toContain("recordCount");
  });
});

describe("Fetch OWL Fallback Functionality", () => {
  test("fetches data from backup endpoint when primary fails", async () => {
    const originalFetch = global.fetch;
    global.fetch = async (url) => {
      if (url === "https://restcountries.com/v3.1/all") {
        return { ok: false, status: 500 };
      } else if (url === "https://jsonplaceholder.typicode.com/users") {
        return {
          ok: true,
          json: async () => ([
            { username: "BackupUser1", company: { name: "BackupCompany1" } },
            { username: "BackupUser2", company: { name: "BackupCompany2" } },
            { username: "BackupUser3", company: { name: "BackupCompany3" } }
          ])
        };
      }
    };
    const output = await captureConsoleAsync(async () => { await main(["--fetch-owl"]); });
    global.fetch = originalFetch;
    expect(output).toContain("Fetched OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/users.owl"');
    expect(output).toContain("BackupUser1");
    expect(output).toContain("fetchedAt");
    expect(output).toContain("sourceEndpoint");
    expect(output).toContain("recordCount");
  });
});

describe("Build OWL Functionality", () => {
  test("displays built OWL ontology as JSON when --build-owl is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--build-owl"]); });
    expect(output).toContain("Built OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/built.owl"');
    expect(output).toContain("Demo Class");
  });
});

describe("Diagnostics Functionality", () => {
  test("runs diagnostics and displays OWL ontology JSON with metadata when --diagnostics is passed", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => new Array(250).fill({ name: { common: "CountryName" }, region: "Region" })
    });
    const output = await captureConsoleAsync(async () => { await main(["--diagnostics"]); });
    global.fetch = originalFetch;
    expect(output).toContain("Running Diagnostics...");
    expect(output).toMatch(/Fetched \d+ records in \d+ ms\./);
    expect(output).toContain("Diagnostics: OWL Ontology JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/diagnostics.owl"');
    expect(output).toContain("fetchedAt");
    expect(output).toContain("recordCount");
    expect(output).toContain("latencyMs");
  });
});

describe("Extended Functionality", () => {
  test("displays extended OWL ontology as JSON when --extend is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--extend"]); });
    expect(output).toContain("Extended OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/extended.owl"');
    expect(output).toContain("Extended Class");
  });
});

describe("Full Extended Functionality", () => {
  test("displays full extended OWL ontology as JSON when --full-extend is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--full-extend"]); });
    expect(output).toContain("Full Extended OWL Ontology as JSON:");
    expect(output).toContain('"ontologyIRI": "http://example.org/full-extended.owl"');
    expect(output).toContain("Full Extended Class");
    expect(output).toContain("nodeVersion");
    expect(output).toContain("platform");
  });
});

describe("Random OWL Functionality", () => {
  test("displays a random OWL ontology as JSON when --random-owl is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--random-owl"]); });
    expect(output).toContain("Random OWL Ontology as JSON:");
    const hasOwl1 = output.includes("http://example.org/owl1");
    const hasOwl2 = output.includes("http://example.org/owl2");
    expect(hasOwl1 || hasOwl2).toBe(true);
    expect(output).toContain("generatedAt");
    expect(output).toContain("randomSeed");
  });
});

describe("Logging Functionality", () => {
  test("logs to file and displays logging message when --log is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--log"]); });
    expect(output).toContain("Logging output to file 'owl-builder.log'");
  });
});

describe("System Information Functionality", () => {
  test("displays system information when --system is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--system"]); });
    expect(output).toContain("System Information:");
    const jsonString = output.split("System Information:")[1].trim();
    let sysInfo;
    try {
      sysInfo = JSON.parse(jsonString);
    } catch (error) {
      sysInfo = null;
    }
    expect(sysInfo).not.toBeNull();
    expect(sysInfo).toHaveProperty("platform");
    expect(sysInfo).toHaveProperty("arch");
    expect(sysInfo).toHaveProperty("nodeVersion");
    expect(sysInfo).toHaveProperty("cpu");
  });
});

describe("Detailed Diagnostics Functionality", () => {
  test("displays detailed diagnostics information when --detailed-diagnostics is passed", async () => {
    const output = await captureConsoleAsync(async () => { await main(["--detailed-diagnostics"]); });
    expect(output).toContain("Detailed Diagnostics:");
    const jsonString = output.split("Detailed Diagnostics:")[1].trim();
    let details;
    try {
      details = JSON.parse(jsonString);
    } catch (error) {
      details = null;
    }
    expect(details).not.toBeNull();
    expect(details).toHaveProperty("memory");
    expect(details.memory).toHaveProperty("total");
    expect(details.memory).toHaveProperty("free");
    expect(details).toHaveProperty("uptime");
    expect(details).toHaveProperty("loadAverage");
  });
});

describe("Unknown Arguments Functionality", () => {
  test("logs unknown arguments when an unrecognized flag is passed", async () => {
    const args = ["--unknown", "abc"];
    const output = await captureConsoleAsync(async () => { await main(args); });
    expect(output).toContain(`Run with: ${JSON.stringify(args)}`);
  });
});
