# Mission

A JavaScript library that manages a simple OWL-like ontology stored as JSON-LD files in a `data/` directory. The pipeline should both build the library AND populate it with example ontology data over successive transform cycles.

This is an ongoing mission. Do not set schedule to off.

## Core Functions

- `defineClass(name, superclass?)` — define an ontology class, optionally as a subclass.
- `defineProperty(name, domain, range, opts?)` — define a property linking two classes.
- `addIndividual(className, id, properties)` — add an instance of a class with property values.
- `query(pattern)` — basic pattern matching over the ontology (e.g. find all instances of a class, find by property value).
- `load(dir?)` — load ontology from JSON-LD files in the data directory.
- `save(dir?)` — persist the ontology to JSON-LD files.
- `stats()` — return counts of classes, properties, and individuals.

## Requirements

- Store data as JSON-LD files in `data/` (one file per class or a single graph file — implementer's choice).
- The library should be usable both programmatically and to build up ontology data over time.
- Export all functions as named exports from `src/lib/main.js`.
- Include seed ontology data (e.g. a simple animal taxonomy) to demonstrate the library works.
- Unit tests covering CRUD operations, querying, and persistence.
- README with usage examples.

## Acceptance Criteria

- [ ] Can define classes and properties
- [ ] Can add individuals and query them
- [ ] Data persists to and loads from JSON-LD files
- [ ] At least one example ontology (e.g. animals) is populated in `data/`
- [ ] `stats()` returns correct counts
- [ ] All unit tests pass
- [ ] README documents the API with examples
