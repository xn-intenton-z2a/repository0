# SEED_DATA

# Summary

Define a seed data feature that provides example ontology content (for example a small animal taxonomy) and a seeded data generator that writes deterministic JSON-LD into data/ using the persistence API.

# Motivation

Seed data demonstrates library behavior, powers the website examples, and provides repeatable transforms across CI runs. Deterministic seed data reduces noise in diffs and makes reviewable example changes possible.

# Specification

Behavior

- Provide a seeded generator script or function that uses defineClass, defineProperty, and addIndividual to build a small example ontology and then calls save to write files to data/.
- The seed must be deterministic and idempotent: repeated runs write the same files and contents (aside from timestamp metadata which should be avoided if possible).

Acceptance Criteria

- A seed function exists and is referenced in the documentation and tests.
- Running the seed function writes a small animal taxonomy under data/ consisting of at least two classes (Animal, Mammal), one property linking species to common name text, and at least two individuals.
- A unit test runs the seed generator into a temporary directory, loads it, and asserts stats show the expected counts.

# Testing Recommendations

- Add tests in tests/unit/seed.test.js that run the seed generator and assert deterministic output and successful load.

# Implementation Notes

- Implement the seed generator as a separate module that imports the public API, so it can be used both in CI and in documentation site builds.

# Related features

- PERSISTENCE
- DEFINE_CLASS
- DEFINE_PROPERTY
- INDIVIDUAL_MANAGEMENT