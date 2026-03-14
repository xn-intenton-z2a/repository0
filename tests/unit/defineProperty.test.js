// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { createOntology } from "../../src/lib/main.js";

describe("defineProperty (TODO placeholder)", () => {
  test("TODO: add more tests for defineProperty", () => {
    expect(true).toBe(true);
  });

  test("can define a property with domain and range", () => {
    const o = createOntology();
    o.defineClass("Animal");
    const p = o.defineProperty("hasName", "Animal", "xsd:string");
    const s = o.stats();
    expect(s.properties).toBe(1);
    expect(p.name).toBe("hasName");
  });
});
