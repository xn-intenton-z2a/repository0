# INDIVIDUAL_MANAGEMENT

# Summary

Provide an API for adding, updating, and removing individuals (instances) within the ontology. Export addIndividual, updateIndividual, and removeIndividual as named exports from src/lib/main.js.

# Motivation

Individuals are the primary data the ontology is used to manage and query. A straightforward CRUD API for individuals enables programmatic population and manipulation for examples, tests, and the website.

# Specification

API

- addIndividual(className, id, properties)
  - Adds a new individual of the specified class with a unique id and a properties map.
  - Properties map may include literal values or references to other individual ids.
  - Returns the created individual object.

- updateIndividual(className, id, properties)
  - Updates properties for an existing individual. Replaces or merges as documented by the API.

- removeIndividual(className, id)
  - Removes the named individual from the class and updates in-memory indices.

Behavior

- Adding an individual for an undefined class should throw a descriptive error unless the implementation auto-creates the class.
- IDs must be unique within their class unless updateIndividual is used.

# Acceptance Criteria

- addIndividual, updateIndividual, and removeIndividual are exported as named functions from src/lib/main.js.
- Adding an individual increases the individuals count in stats; removing decreases it.
- A unit test performs add, update, remove sequence and asserts expected state at each step.
- Persistence save and load round-trips individuals correctly into the same class files.

# Testing Recommendations

- Add tests in tests/unit/individuals.test.js that cover creation with literal and reference properties, updates, and removals. Use temporary directories for persistence checks.

# Implementation Notes

- Store individuals keyed by class and id in memory to allow fast lookup.
- When persisting, include individuals in their class file in a stable ordering to reduce diffs across runs.

# Related features

- PERSISTENCE
- DEFINE_CLASS
- DEFINE_PROPERTY
- QUERY