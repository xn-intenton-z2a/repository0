import { describe, it, expect } from 'vitest';
import Ontology from '../../src/lib/owl.js';
import path from 'path';
import { fileURLToPath } from 'url';

const seedPath = path.resolve(process.cwd(), 'features/seed-ontology.jsonld');

describe('OWL-like ontology library', () => {
  it('loads the seed ontology and recognizes classes, properties, and individuals', async () => {
    const ont = await Ontology.load(seedPath);
    const classes = ont.getClasses().map(c => c.id);
    expect(classes).toContain('http://example.org/Animal');
    expect(classes).toContain('http://example.org/Mammal');
    const props = ont.getProperties();
    const hasFriend = props.find(p => p.id === 'http://example.org/hasFriend');
    expect(hasFriend).toBeTruthy();
    expect(hasFriend.domain).toBe('http://example.org/Animal');
    expect(hasFriend.range).toBe('http://example.org/Animal');
    const inds = ont.getIndividuals().map(i => i.id);
    expect(inds).toContain('http://example.org/fluffy');
    expect(inds).toContain('http://example.org/buddy');
  });

  it('validate returns errors for broken ontology', async () => {
    const bad = {
      '@context': {},
      '@graph': [
        { '@id': 'http://example.org/SomeProp', '@type': 'owl:ObjectProperty' }
      ]
    };
    const ont = new Ontology();
    await ont.load(bad);
    const errors = ont.validate();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('recognizes subclass relationships and instance membership', async () => {
    const ont = await Ontology.load(seedPath);
    const subs = ont.query(null, 'subClassOf', 'http://example.org/Animal');
    expect(subs).toContain('http://example.org/Mammal');
    const instances = ont.query(null, 'type', 'http://example.org/Mammal');
    // our seed has fluffy as Mammal
    expect(instances).toContain('http://example.org/fluffy');
  });

  it('serialization round-trip preserves model (counts and ids)', async () => {
    const ont = await Ontology.load(seedPath);
    const jsonld = ont.toJSONLD();
    const ont2 = await Ontology.load(jsonld);
    const s1 = ont.stats();
    const s2 = ont2.stats();
    expect(s1).toEqual(s2);
    const ids1 = ont.getIndividuals().map(i => i.id).sort();
    const ids2 = ont2.getIndividuals().map(i => i.id).sort();
    expect(ids1).toEqual(ids2);
  });

  it('query examples: find subclasses and list domain/range', async () => {
    const ont = await Ontology.load(seedPath);
    const subclasses = ont.query(null, 'subClassOf', 'http://example.org/Animal');
    expect(subclasses).toContain('http://example.org/Mammal');
    const domain = ont.query(null, 'domain', 'http://example.org/hasFriend');
    const range = ont.query(null, 'range', 'http://example.org/hasFriend');
    expect(domain).toContain('http://example.org/Animal');
    expect(range).toContain('http://example.org/Animal');
  });
});
