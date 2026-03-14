// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { createOntology } from "../../src/lib/main.js";

describe("query (TODO placeholder)", () => {
  test("TODO: add more tests for query", () => {
    expect(true).toBe(true);
  });

  test("can query by class and property", () => {
    const o = createOntology();
    o.defineClass("Animal");
    o.defineClass("Mammal", "Animal");
    o.defineProperty("hasName", "Animal", "xsd:string");
    o.addIndividual("Mammal", "dog1", { hasName: "Fido" });
    o.addIndividual("Mammal", "cat1", { hasName: "Whiskers" });

    const all = o.query();
    expect(all.length).toBe(2);

    const animals = o.query({ class: "Animal" });
    expect(animals.length).toBe(2);

    const fido = o.query({ property: "hasName", value: "Fido" });
    expect(fido.length).toBe(1);
    expect(fido[0].id).toBe("dog1");
  });
});
