# ANIMAL_SEED

Summary

Provide a small example ontology (animal taxonomy) as seed data and a documented seeding procedure so the repository always ships with demonstrable, testable data under data/ that exercises classes, properties, and individuals.

Rationale

An example ontology that exercises core behaviours makes tests more meaningful and gives consumers an immediate starting point to explore the API and the website. The animal taxonomy is domain-simple and pedagogically effective.

Design

- Content: a minimal animal taxonomy with classes: Animal, Mammal (subclass of Animal), Bird (subclass of Animal), Dog (subclass of Mammal), Cat (subclass of Mammal). Properties: hasName (literal), hasColor (literal), eats (object property linking to Animal).
- Individuals: Fido (Dog, hasName Fido, hasColor brown), Whiskers (Cat, hasName Whiskers, hasColor black), Tweety (Bird, hasName Tweety, hasColor yellow).
- Storage: seed files must live under data/ as JSON-LD following the JSONLD_PERSISTENCE layout; add a small script or README instructions showing how to load the seed using the library's load function.

Tests

- Unit tests confirm seed load produces expected stats: classes 5, properties 3, individuals 3.
- Tests assert that basic queries (findInstances('Dog'), findByProperty('hasColor','brown')) return the expected individuals.

Acceptance Criteria

- Seed data is included in the repository data/ directory and can be loaded with load().
- Tests reference the seed and pass in a clean environment.
- README documents the seed and how to load it into the in-memory graph for interactive exploration.
