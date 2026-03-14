// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { createOntology } from "../../src/lib/main.js";

describe("stats (TODO placeholder)", () => {
  test("TODO: add more tests for stats", () => {
    expect(true).toBe(true);
  });

  test("stats returns correct counts", () => {
    const o = createOntology();
    o.defineClass("Animal");
    o.defineClass("Mammal", "Animal");
    o.defineProperty("hasName", "Animal", "xsd:string");
    o.addIndividual("Mammal", "dog1", { hasName: "Fido" });
    const s = o.stats();
    expect(s.classes).toBe(2);
    expect(s.properties).toBe(1);
    expect(s.individuals).toBe(1);
  });
});
