// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { createOntology } from "../../src/lib/main.js";

describe("addIndividual (TODO placeholder)", () => {
  test("TODO: add more tests for addIndividual", () => {
    expect(true).toBe(true);
  });

  test("can add an individual with properties", () => {
    const o = createOntology();
    o.defineClass("Animal");
    o.defineProperty("hasName", "Animal", "xsd:string");
    const ind = o.addIndividual("Animal", "dog1", { hasName: "Fido" });
    expect(ind.id).toBe("dog1");
    expect(o.stats().individuals).toBe(1);
    expect(ind.properties.hasName).toEqual(["Fido"]);
  });
});
