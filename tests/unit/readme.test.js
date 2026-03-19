// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { listEncodings } from "../../src/lib/main.js";

function parseTable(md) {
  const lines = md.split(/\r?\n/);
  const tableLines = lines.filter(l => l.trim().startsWith("|"));
  // find encoding rows by name
  const rows = {};
  tableLines.forEach(line => {
    const parts = line.split("|").map(p => p.trim()).filter(Boolean);
    if (parts.length >= 4) {
      const name = parts[0];
      const charsetSize = Number(parts[1]);
      const bits = Number(parts[2]);
      const uuidLen = Number(parts[3]);
      if (name) rows[name] = { charsetSize, bits, uuidLen };
    }
  });
  return rows;
}

describe("README encoding table matches runtime", () => {
  test("numbers in README match listEncodings", () => {
    const md = readFileSync("README.md", "utf8");
    const table = parseTable(md);
    const encs = listEncodings();
    encs.forEach(e => {
      const r = table[e.name];
      expect(r).toBeDefined();
      expect(r.charsetSize).toBe(e.charsetSize);
      // compare bits with 2 decimal precision
      expect(r.bits).toBeCloseTo(Number(e.bitsPerChar.toFixed(2)), 2);
      expect(r.uuidLen).toBe(e.uuidLength);
    });
  });
});
