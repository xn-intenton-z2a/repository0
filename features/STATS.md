# STATS

# Summary

Provide a stats API that returns counts of classes, properties, and individuals currently present in the in-memory model. Export stats as a named function from src/lib/main.js.

# Motivation

Deterministic statistics make it easy to assert the effects of API calls in unit tests and to surface summary information on the website and in CI checks.

# Specification

API

- stats()
  - Returns an object containing keys classes, properties, and individuals with integer counts.
  - Should be inexpensive to compute and reflect the current in-memory state.

# Acceptance Criteria

- stats is exported as a named function from src/lib/main.js.
- After a sequence of known operations (create two classes, define one property, add two individuals), stats returns the expected counts.
- Tests cover stats before and after persistence round-trip to ensure load restores counts.

# Testing Recommendations

- Add tests in tests/unit/stats.test.js that assert counts after mutation and after save/load.

# Implementation Notes

- Implement stats as a thin aggregator over in-memory structures to keep it fast and reliable.

# Related features

- DEFINE_CLASS
- DEFINE_PROPERTY
- INDIVIDUAL_MANAGEMENT
- PERSISTENCE

# Implementation

- Status: Implemented in src/lib/main.js via stats() exported wrapper over the default ontology instance.
- Behavior: stats() returns deterministic counts for classes, properties, and individuals; it is intentionally inexpensive and suitable for use in tests and UI summaries.
- Tests: tests/unit/stats.test.js is recommended to assert counts before and after persistence round-trips.