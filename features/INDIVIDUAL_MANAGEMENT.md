# INDIVIDUAL_MANAGEMENT

# Summary

Provide a clear, testable CRUD API for individuals (instances) in the ontology: create, read, update and remove. Export addIndividual, updateIndividual, removeIndividual (and optional getIndividual helper) as named exports from src/lib/main.js so consumers and tests can manipulate instance data deterministically.

# Motivation

Individuals are the primary data the ontology holds and query operations rely on predictable instance lifecycle behaviour. A focused CRUD API enables deterministic examples, reliable persistence round-trips, and straightforward tests for the website and library consumers.

# Specification

API

- addIndividual(className, id, properties)
  - Adds a new individual of the specified class with a unique id and a properties map.
  - properties may contain literal values (strings/numbers/booleans), arrays of literals, or references to other individual ids.
  - Normalises stored property values to arrays for stable representation (e.g., { hasName: "Fido" } -> properties.hasName === ["Fido"]).
  - Throws a descriptive error if className is missing or the class is not defined (implementations MAY optionally auto-create the class but tests assume explicit class creation).
  - Returns the created individual object.

- updateIndividual(className, id, properties, opts?)
  - Updates an existing individual's properties. Default semantics: merge update (opts.merge = true) where provided property keys are merged into existing arrays (appended) and scalar values become single-element arrays.
  - When opts.merge = false the update replaces the individual's properties entirely with the provided properties map.
  - Returns the updated individual object.
  - Throws a descriptive error if the individual does not exist or if the className is not defined.

- removeIndividual(className, id)
  - Removes the named individual if present; returns true when an individual was removed and false when no such individual existed.
  - Removing an individual clears any internal indices and leaves no dangling references; implementations should not automatically cascade-delete linked individuals but should surface broken references via validation (see PERSISTENCE/VALIDATION).

- getIndividual(className, id) [optional]
  - Returns the individual object or null if not found. Useful for tests and CLI helpers.

Behavioral rules

- IDs are unique within the ontology (global id uniqueness is recommended); attempts to add an individual with an existing id should fail.
- Adding or removing individuals updates stats() counts deterministically.
- updateIndividual defaults to merge semantics to make incremental updates convenient; callers can request replace semantics when needed.
- Property value normalization (arrays) is stable and preserved across save/load round-trips.

# Acceptance Criteria

- The library exports addIndividual, updateIndividual, and removeIndividual as named functions from src/lib/main.js (getIndividual is optional but recommended).
- addIndividual increases stats().individuals by 1; removeIndividual decreases it by 1 when an existing individual is removed.
- updateIndividual with the default options merges values: adding a new property appends it; providing an existing property with a new scalar value appends that value to the property's array.
- updateIndividual with opts.merge = false replaces the individual's properties exactly with the supplied map.
- removeIndividual returns true for successful removals and false when the id was not present.
- Persistence: after a sequence of addIndividual/updateIndividual/removeIndividual operations, calling save(dir) and then loading the data into a fresh ontology using load(dir) restores the expected individuals and their properties (including merged values or replaced values depending on the last update operation).
- Unit tests exist in tests/unit/individuals.test.js that exercise: add -> update (merge) -> update (replace) -> remove -> save/load round-trip and assert stats and property content at each step.

# Testing Recommendations

- Create tests/unit/individuals.test.js covering:
  - add individual with literal and reference properties and assert normalised array representation
  - update with default merge semantics (append behaviour) and assert property arrays
  - update with merge=false to replace properties and assert exact match
  - remove existing and non-existing individuals and assert return values and stats
  - persistence round-trip: perform operations, save to a temp dir, load into a fresh ontology, and assert counts and property values are preserved
- Use mkdtempSync and rmSync for temporary directory lifecycle in tests.

# Implementation Notes

- The in-memory store may continue to use a global id -> individual map with each individual having a class property (current implementation) but should ensure lookups by (class,id) are efficient for tests and UI listing helpers.
- Keep property ordering deterministic when persisting to reduce diffs (sort property keys or emit properties consistently).
- Do not silently auto-create classes in addIndividual for tests; prefer throwing an informative error to encourage explicit schema creation.
- Highlight compatibility: if existing code uses a simple id->individual map (as present in the current implementation), updateIndividual and removeIndividual can be implemented without major refactor.

# Related features

- PERSISTENCE (save/load and validation)
- DEFINE_CLASS
- DEFINE_PROPERTY
- QUERY

# Migration guidance

- If the current code base exposes only addIndividual, add updateIndividual and removeIndividual as thin wrappers around the underlying individual map and ensure they are exported as named functions.
- Add tests first (red), implement the minimal behaviour to satisfy tests (green), then refactor if needed to optimise lookups.
