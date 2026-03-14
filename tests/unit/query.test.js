// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { createOntology } from '../../src/lib/main.js';

describe('query with inference and explain', () => {
  test('subclass inference applies by default and can be disabled', () => {
    const o = createOntology();
    o.defineClass('Animal');
    o.defineClass('Mammal', 'Animal');
    o.defineProperty('hasName', 'Animal', 'xsd:string');
    o.addIndividual('Mammal', 'dog1', { hasName: 'Fido' });

    const animals = o.query({ class: 'Animal' });
    expect(animals.some(a => a.id === 'dog1')).toBe(true);

    const noReason = o.query({ class: 'Animal' }, { reasonLevel: 'none' });
    expect(noReason.some(a => a.id === 'dog1')).toBe(false);
  });

  test('explain option adds matchedBy and inferenceChain', () => {
    const o = createOntology();
    o.defineClass('Animal');
    o.defineClass('Mammal', 'Animal');
    o.defineProperty('hasName', 'Animal', 'xsd:string');
    o.addIndividual('Mammal', 'dog1', { hasName: 'Fido' });
    const res = o.query({ class: 'Animal' }, { explain: true });
    const dog = res.find(r => r.id === 'dog1');
    expect(dog).toBeTruthy();
    expect(dog.matchedBy).toBe('inferred');
    expect(Array.isArray(dog.inferenceChain)).toBe(true);
    expect(dog.inferenceChain[0]).toBe('Mammal');
  });
});
