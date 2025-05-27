import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";
import { promises as fs } from "fs";

// Verify module import
describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

// Verify default behavior
describe("Main Output", () => {
  test("should terminate without error", () => {
    // Simulate invocation without args
    return main([]);
  });
});

// Tests for --capital-cities feature
describe("Capital Cities CLI", () => {
  const sampleData = [
    { cca3: "USA", capital: ["Washington D.C."] },
    { cca3: "FRA", capital: ["Paris"] }
  ];

  const expectedOntology = {
    ontology: {
      classes: ["Country", "City"],
      objectProperties: [
        { name: "hasCapital", domain: "Country", range: "City" }
      ],
      individuals: [
        { type: "Country", id: "USA" },
        { type: "City", id: "Washington D.C." },
        { subject: "USA", predicate: "hasCapital", object: "Washington D.C." },
        { type: "Country", id: "FRA" },
        { type: "City", id: "Paris" },
        { subject: "FRA", predicate: "hasCapital", object: "Paris" }
      ]
    }
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should print ontology JSON to stdout", async () => {
    // Mock fetch to return sample data
    const mockResponse = { ok: true, json: vi.fn().mockResolvedValue(sampleData) };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await main(["--capital-cities"]);

    expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/all");
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed).toEqual(expectedOntology);
  });

  test("should write ontology JSON to file when --output is provided", async () => {
    // Mock fetch to return sample data
    const mockResponse = { ok: true, json: vi.fn().mockResolvedValue(sampleData) };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));
    const writeSpy = vi.spyOn(fs, "writeFile").mockResolvedValue();
    const outPath = "out.json";

    await main(["--capital-cities", "--output", outPath]);

    expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/all");
    const expectedString = JSON.stringify(expectedOntology, null, 2);
    expect(writeSpy).toHaveBeenCalledWith(outPath, expectedString, "utf-8");
  });
});
