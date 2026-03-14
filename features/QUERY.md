# QUERY

# Summary

Provide a simple pattern-matching query API that can locate individuals by class and by matching property values. Export query as a named export from src/lib/main.js.

# Motivation

A query API is essential for discovering data in the ontology programmatically and for powering the website examples and tests.

# Specification

API

- query(pattern)
  - Accepts a pattern object describing selection criteria.
  - Supported pattern shapes include:
    - find all individuals of a class by class name
    - find individuals where a property equals a given literal value
    - find individuals where a property references a specific individual id
  - Returns an array of matching individual objects with at least id and class name.

Behavior

- Queries should be executed against the in-memory model and respect the most recent state (including unpersisted changes).
- Query results should be deterministic and stable when no concurrent modifications occur.

# Acceptance Criteria

- query is exported as a named function from src/lib/main.js.
- Unit tests include cases: find by class, find by property literal, find by property reference.
- A test inserts example individuals and asserts query results match expected ids and counts.

# Testing Recommendations

- Add tests in tests/unit/query.test.js that build an in-memory model, add individuals, and exercise each pattern shape.

# Implementation Notes

- Keep the pattern language intentionally small and easy to implement and test; add complexity later if needed.

# Related features

- INDIVIDUAL_MANAGEMENT
- DEFINE_PROPERTY
- PERSISTENCE