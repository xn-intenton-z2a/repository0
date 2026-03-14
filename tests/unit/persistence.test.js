// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { createOntology } from '../../src/lib/main.js';
import { mkdtempSync, rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

describe('persistence', () => {
  test('save writes context.jsonld and Class-{kebab}.jsonld and load round-trip preserves stats', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'ont-'));
    try {
      const o = createOntology();
      o.defineClass('Animal');
      o.defineClass('Mammal', 'Animal');
      o.defineProperty('hasName', 'Animal', 'xsd:string');
      o.addIndividual('Mammal', 'dog1', { hasName: 'Fido' });
      const sum = await o.save(tmp);
      expect(sum.ok).toBe(true);
      // files include context.jsonld and Class-animal.jsonld and Class-mammal.jsonld
      expect(sum.files.some(f => f.endsWith('context.jsonld'))).toBe(true);
      expect(sum.files.some(f => f.includes('Class-animal.jsonld'))).toBe(true);
      expect(sum.classes).toBe(2);
      expect(sum.individuals).toBe(1);

      const o2 = createOntology();
      const loaded = await o2.load(tmp);
      expect(loaded.classes).toBe(2);
      expect(o2.stats().individuals).toBe(1);
    } finally {
      try { rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* ignore */ }
    }
  });
});
