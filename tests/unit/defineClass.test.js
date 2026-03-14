// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { createOntology } from "../../src/lib/main.js";

describe("defineClass (TODO placeholder)", () => {
  test("TODO: add more tests for defineClass", () => {
    expect(true).toBe(true);
  });

  test("can define classes and subclasses", () => {
    const o = createOntology();
    o.defineClass("Animal");
    o.defineClass("Mammal", "Animal");
    const s = o.stats();
    expect(s.classes).toBe(2);
  });
});
