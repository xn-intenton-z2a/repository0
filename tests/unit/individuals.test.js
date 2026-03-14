// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { createOntology } from '../../src/lib/main.js';

describe('individuals', () => {
  test('addIndividual normalises properties to arrays and throws on unknown class', () => {
    const o = createOntology();
    o.defineClass('Mammal');
    o.defineProperty('hasName', 'Mammal', 'xsd:string');
    const ind = o.addIndividual('Mammal', 'm1', { hasName: 'Fido' });
    expect(ind.id).toBe('m1');
    expect(ind.properties.hasName).toEqual(['Fido']);
    // unknown class
    expect(() => o.addIndividual('Unknown', 'u1', {})).toThrow('class not defined');
  });

  test('updateIndividual merges by default and replaces when merge=false', () => {
    const o = createOntology();
    o.defineClass('Mammal');
    o.defineProperty('hasName', 'Mammal', 'xsd:string');
    o.addIndividual('Mammal', 'm1', { hasName: 'Fido' });
    const merged = o.updateIndividual('Mammal', 'm1', { hasName: 'Rex' });
    expect(merged.properties.hasName).toEqual(['Fido', 'Rex']);
    const replaced = o.updateIndividual('Mammal', 'm1', { hasName: 'Solo' }, { merge: false });
    expect(replaced.properties.hasName).toEqual(['Solo']);
  });

  test('removeIndividual returns true when removed and false if not present', () => {
    const o = createOntology();
    o.defineClass('Mammal');
    o.addIndividual('Mammal', 'm1', {});
    expect(o.removeIndividual('Mammal', 'm1')).toBe(true);
    expect(o.removeIndividual('Mammal', 'm1')).toBe(false);
  });
});
