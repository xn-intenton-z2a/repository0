# Mission

A JavaScript library that manages a simple OWL-like ontology stored as JSON-LD files in a `data/` directory at the project root.

## Required Capabilities

- Define ontology classes, optionally with a superclass.
- Define properties linking two classes (domain and range).
- Add individuals (instances of a class) with property values.
- Query the ontology:
  - By class — return all individuals of that class (including subclasses).
  - By property value — return all individuals with a matching property value.
- Load the ontology from JSON-LD files in `data/` and persist it back.
- Return counts of classes, properties, and individuals.

## JSON-LD Format

- Use namespace `http://example.org/ontology#` as the `@context` vocabulary.
- Store one file per class in `data/`, named `<ClassName>.jsonld` (e.g. `data/Mammal.jsonld`).
- Each file contains the class definition and its individuals as a JSON-LD graph.

## Seed Ontology

The library must include a seed ontology demonstrating all features:

- Classes: `Animal` > `Mammal` > `Dog`, `Cat`; `Animal` > `Bird` > `Parrot`
- Properties: `hasName` (string), `hasLegs` (integer)
- Individuals: at least 3 (e.g. a Dog named "Rex" with 4 legs, a Cat named "Whiskers", a Parrot named "Polly" with 2 legs)

## Requirements

- Export all public API as named exports from `src/lib/main.js`.
- No external runtime dependencies.
- Comprehensive unit tests covering CRUD operations, querying (both patterns), persistence round-trip, and stats.
- README with usage examples.

## Acceptance Criteria

- [ ] Can define classes with inheritance (superclass)
- [ ] Can define properties with domain and range
- [ ] Can add individuals and query by class (returns subclass instances too)
- [ ] Can query by property value
- [ ] Data persists to `data/` as JSON-LD files and loads back correctly (round-trip)
- [ ] Seed ontology with animals is populated in `data/`
- [ ] Statistics return correct counts of classes, properties, and individuals
- [ ] All unit tests pass
- [ ] README documents the API with examples
