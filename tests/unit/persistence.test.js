// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { createOntology } from "../../src/lib/main.js";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("persistence (TODO placeholder)", () => {
  test("TODO: add more tests for load/save", () => {
    expect(true).toBe(true);
  });

  test("can save and load ontology to/from JSON-LD", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "ont-"));
    try {
      const o = createOntology();
      o.defineClass("Animal");
      o.defineProperty("hasName", "Animal", "xsd:string");
      o.addIndividual("Animal", "dog1", { hasName: "Fido" });
      const out = await o.save(tmp);
      expect(typeof out).toBe("string");

      const o2 = createOntology();
      const loaded = await o2.load(tmp);
      expect(loaded).toBeGreaterThan(0);
      expect(o2.stats().individuals).toBe(1);
    } finally {
      try { rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* ignore */ }
    }
  });
});
