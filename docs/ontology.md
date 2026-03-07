# OWL-like JSON-LD ontology library

This library provides a small OWL-like ontology manager with JSON-LD loading, validation, querying and serialization.

API (src/lib/owl.js)

- Ontology: class with methods:
  - load(jsonld|path) - load ontology data from an object or a file path
  - validate() -> returns array of validation error objects
  - getClasses() -> [{ id, superClasses }]
  - getProperties() -> [{ id, domain, range, type }]
  - getIndividuals() -> [{ id, types, properties }]
  - query(subject, predicate, object) -> simple triple/pattern matching
  - toJSONLD() -> returns JSON-LD object representing the ontology
  - save(dir) -> persist to data/ontology.jsonld
  - stats() -> { classes, properties, individuals }

Example usage

```js
import Ontology from './src/lib/owl.js';
const ont = await Ontology.load('features/seed-ontology.jsonld');
console.log(ont.getClasses());
console.log(ont.getIndividuals());
```

JSON-LD structure expected

A JSON-LD document with `@context` and `@graph`, where classes are nodes with `@type: owl:Class`, properties use `@type: owl:ObjectProperty` (or Datatype), and individuals have `@type` referencing classes. Properties for domain/range use `rdfs:domain` and `rdfs:range`.

Seed data

The repository includes `features/seed-ontology.jsonld` which contains a minimal animal taxonomy (Animal, Mammal, hasFriend, two individuals) and can be used as an example.

Serialization and round-trip

Call `toJSONLD()` to produce a JSON-LD representation that can be re-loaded with `Ontology.load()`; tests verify counts and identities are preserved.

CLI example

Run the example script:

```
node src/examples/owl-example.js
```

Website

The web demo fetches `seed-ontology.jsonld` from the site root when built (it is copied during `npm run build:web`) and displays the raw JSON-LD and a short summary.
