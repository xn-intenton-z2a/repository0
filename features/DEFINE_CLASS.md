# DEFINE_CLASS

# Summary

Provide a defineClass API to declare ontology classes with optional superclass relationships. Export defineClass as a named export from src/lib/main.js so code and tests can register classes programmatically.

# Motivation

Classes are the primary building blocks of the ontology. A clear, testable class API enables other features such as persistence, querying, and seed data generation.

# Specification

API

- defineClass(name, superclass?)
  - Registers a class with the given name.
  - If superclass is provided, records a subclass relationship.
  - Returns a canonical class object that contains at minimum name and optional superclass.
  - Throws a descriptive error for invalid input (missing or non-string name).

Storage and persistence

- Classes are tracked in-memory and included in the persistence output produced by PERSISTENCE.
- When saved, each class is represented in the Class-{kebab-case-classname}.jsonld file and includes its subclass relationships.

# Acceptance Criteria

- defineClass is exported as a named function from src/lib/main.js.
- Calling defineClass twice with the same name does not create duplicates and returns the same canonical object.
- Subclass relationships are recorded and discoverable via the in-memory model and persisted output.
- A unit test creates two classes, sets one as a subclass of the other, and asserts stats show two classes and the subclass relationship is present.

# Testing Recommendations

- Add tests in tests/unit/define-class.test.js that cover creation, duplication avoidance, invalid input, and subclass discovery.

# Implementation Notes

- Use a consistent internal key for class names to avoid case-sensitive duplication.
- Prefer short human-readable names for classes that map cleanly to file names when persisted.

# Related features

- PERSISTENCE
- DEFINE_PROPERTY
- STATS