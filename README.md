# repository0

This repository demonstrates an agentic library template and now includes an OWL-like JSON-LD ontology library.

## OWL-like JSON-LD ontology library

Files added:

- `src/lib/owl.js` - core ontology library (load, validate, query, serialize)
- `features/seed-ontology.jsonld` - seed ontology (Animal/Mammal example)
- `tests/unit/owl.test.js` - unit tests for the ontology library
- `src/examples/owl-example.js` - example CLI script to print a summary
- `docs/ontology.md` - documentation for the API
- `src/web/seed-ontology.jsonld` - web-copy of the seed so the demo site can load it

Usage

- Run tests: `npm test`
- Run the example CLI: `node src/examples/owl-example.js`
- Print a quick summary via main CLI: `npm run start:cli -- --owl-summary`
- Build the docs site: `npm run build:web` (the web demo will display the seed ontology)

See `docs/ontology.md` for API details and examples.

Mission: owl-ontology — complete
