#!/usr/bin/env node
// src/lib/owl-example.js
import Ontology from './owl.js';
import path from 'path';

export default async function runExample() {
  const seed = path.resolve(process.cwd(), 'features/seed-ontology.jsonld');
  const ont = await Ontology.load(seed);
  console.log('Ontology summary');
  console.log('Classes:', ont.getClasses().map(c => c.id).join(', '));
  console.log('Properties:', ont.getProperties().map(p => `${p.id} (domain=${p.domain}, range=${p.range})`).join('\n  '));
  console.log('Individuals:', ont.getIndividuals().map(i => `${i.id} types=${i.types.join(',')}`).join('\n  '));
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] && process.argv[1].endsWith('owl-example.js')) {
  runExample().catch(err => { console.error(err); process.exit(1); });
}
