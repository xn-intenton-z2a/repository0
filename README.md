# repository0

A template repository extended with an OWL-like JSON-LD ontology library.

This project provides a small JavaScript library to manage an ontology using JSON-LD persistence. The library is usable programmatically and from the included CLI helpers.

Key files

- `src/lib/owl.js` - core ontology library (load, validate, query, serialize)
- `src/lib/main.js` - library entrypoint and exported helpers
- `features/seed-ontology.jsonld` - seed ontology (Animal/Mammal example)
- `data/ontology.jsonld` - persisted example ontology (JSON-LD)
- `tests/unit/owl.test.js` - unit tests for ontology features
- `docs/ontology.md` - documentation for the API
- `docs/examples/ontology-summary.txt` - example output summary
- `docs/evidence/ontology.json` - machine-readable evidence summary

Usage

Programmatic example:

```js
import { createOntology } from './src/lib/owl.js';
const o = createOntology();
o.defineClass('http://example.org/Animal');
o.defineClass('http://example.org/Mammal', 'http://example.org/Animal');
o.defineProperty('http://example.org/hasFriend', 'http://example.org/Animal', 'http://example.org/Animal');
o.addIndividual('http://example.org/Mammal', 'http://example.org/fluffy', { 'http://example.org/hasFriend': 'http://example.org/buddy' });
await o.save('data');
```

CLI examples:

- Run unit tests: `npm test`
- Show a quick summary from the main CLI: `npm run start:cli -- --owl-summary`
- Build the web demo: `npm run build:web`

API

See `docs/ontology.md` for full API documentation and examples.

