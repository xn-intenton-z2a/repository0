# repo — Ontology library

This repository contains a small JavaScript library for managing a simple OWL-like ontology stored as JSON-LD files.

Features:

- defineClass(name, superclass?) — define an ontology class
- defineProperty(name, domain, range, opts?) — define a property linking classes
- addIndividual(className, id, properties) — add an instance with properties
- query(pattern) — basic pattern matching over the ontology
- load(dir?) / save(dir?) — load and persist JSON-LD data
- stats() — counts of classes, properties, individuals

Usage (Node):

```js
import { createOntology } from './src/lib/main.js';

const o = createOntology();
o.defineClass('Animal');
o.defineClass('Mammal', 'Animal');
o.defineProperty('hasName', 'Animal', 'xsd:string');
o.addIndividual('Mammal', 'dog1', { hasName: 'Fido' });
console.log(o.query({ class: 'Animal' }));
console.log(o.stats());
```

Web demo:

Open `src/web/index.html` in a browser or run `npm run start` and visit the page; the web page imports the library via `src/web/lib.js`.

Tests:

- Unit tests: `npm test`
- Behaviour tests: `npm run test:behaviour` (requires Playwright)

License: MIT
