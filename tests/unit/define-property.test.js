// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { createOntology } from '../../src/lib/main.js';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

describe('defineProperty', () => {
  test('defineProperty returns descriptor and increments stats', () => {
    const o = createOntology();
    o.defineClass('Animal');
    const before = o.stats().properties;
    const p = o.defineProperty('hasName', 'Animal', 'xsd:string');
    const after = o.stats().properties;
    expect(p.name).toBe('hasName');
    expect(after).toBe(before + 1);
  });

  test('persistence round-trip preserves property domain/range', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'ont-'));
    try {
      const o = createOntology();
      o.defineClass('Animal');
      o.defineProperty('hasName', 'Animal', 'xsd:string');
      const sum = await o.save(tmp);
      expect(sum.properties).toBe(1);

      const o2 = createOntology();
      const loaded = await o2.load(tmp);
      expect(loaded.properties).toBe(1);
      const props = o2.listProperties();
      expect(props.find(p => p.name === 'hasName').domain).toBe('Animal');
      expect(props.find(p => p.name === 'hasName').range).toBe('xsd:string');
    } finally {
      try { rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* ignore */ }
    }
  });
});
