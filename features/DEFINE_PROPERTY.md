# DEFINE_PROPERTY

# Summary

Provide a defineProperty API to declare properties with domain and range. Export defineProperty as a named export from src/lib/main.js so properties can be used to link classes and individuals.

# Motivation

Properties express relationships and attributes within the ontology. A minimal property model with domain, range, and optional cardinality or datatype metadata is required for useful queries and persistence.

# Specification

API

- defineProperty(name, domain, range, opts?)
  - Registers a property with the given name.
  - domain and range reference class names or IRIs and are validated against currently defined classes when possible.
  - opts may include cardinality hints, datatype, and an optional inverse property name.
  - Returns a canonical property descriptor object.

Storage

- Properties are included in the persisted files for relevant classes and in the global graph if a single graph layout is used.

# Acceptance Criteria

- defineProperty is exported as a named function from src/lib/main.js.
- After defining a property, stats reports an increased property count.
- A unit test defines a property linking two classes, persists the model using persistence save, reloads it, and asserts the property is present with the same domain and range.

# Testing Recommendations

- Add tests in tests/unit/define-property.test.js that validate domain and range validation, opts handling, and persistence round-trip.

# Implementation Notes

- Keep the property descriptor minimal but extensible: name, domain, range, opts.
- When persisting per-class files, include property definitions in files for classes in the domain.

# Related features

- PERSISTENCE
- DEFINE_CLASS
- QUERY