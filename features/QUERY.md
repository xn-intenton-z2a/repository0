# QUERY

Feature: QUERY_INFERENCE

# Summary

Provide a simple, deterministic pattern-matching query API together with a small, auditable inference layer that supports transitive subclass reasoning and property-inheritance across the class hierarchy. Query behaviour must be deterministic, fast on small seed datasets, and easy to test from the public API exported by src/lib/main.js.

# Motivation

A reliable query API powers the website demo, unit tests, and user scripts that explore the ontology. Adding focused inference (subclass closure and property inheritance) makes the library sufficiently OWL-like for common use-cases without requiring a full reasoner, and it enables intuitive queries such as asking for all Animals and receiving Mammal instances.

# Specification

API

- query(pattern, opts?)
  - pattern: an object that can include any of the following keys:
    - class: short name or IRI of a class (e.g., "Animal")
    - property: short name or IRI of a property (e.g., "hasHabitat")
    - value: literal value to match for a property (e.g., "forest")
    - target: an individual id to match property references
  - opts: optional options object supporting:
    - includeSubclasses: boolean (default: true) — include instances of subclasses when matching a class
    - reasonLevel: "none" | "simple" | "rdfs" (default: "simple") — "simple" applies subclass closure and property inheritance; "none" disables inference
    - explain: boolean (default: false) — when true, results include matchedBy and inferenceChain keys describing why an item matched
  - return: array of result objects. By default each result is the individual object; when explain is true each result is extended with { matchedBy: "direct"|"inferred", inferenceChain?: string[] }.

Pattern examples

- { class: "Animal" }
- { property: "hasName", value: "Fido" }
- { class: "Animal", property: "hasHabitat", value: "forest" }
- { property: "friendOf", target: "_:dog1" }

Determinism and ordering

- Results must be deterministic. The library should sort results by individual id (or another deterministic key) before returning, so tests and UI remain stable across runs.

Inference semantics

- Subclass closure: treat the class hierarchy transitively. A query for class C matches any individual whose declared class is C or any subclass of C.
- Property inheritance: a property whose domain includes class C is considered applicable to instances of subclasses of C. When a pattern includes a property predicate, the implementation should:
  - Match individuals that have the property value stored on the individual regardless of where the property was declared.
  - When the pattern also includes class filtering, interpret applicability of the property via domain inheritance: e.g., query({ class: "Animal", property: "hasHabitat" }) should consider properties declared on Animal and its superclasses and include instances of Animal and its subclasses that have matching property values.
- Explanation: when opts.explain is true, inferred matches must include concise inferenceChain entries such as "Mammal rdfs:subClassOf Animal" or "property hasHabitat declared on Animal, applied to Mammal".

Performance

- The inference layer must remain lightweight. Implementations should precompute subclass closure and property-availability maps when classes/properties change, or compute them lazily with memoisation.
- The implementation must be efficient for small seed datasets (tens of classes and hundreds of individuals). It must not attempt full OWL reasoning.

# Acceptance Criteria

- API: query is exported as a named function from src/lib/main.js and supports query(pattern, opts?).
- Backwards compatibility: when opts.reasonLevel = "none" the query API behaves as before (no inference applied) and existing tests still pass.
- Subclass inference: unit test creates classes Animal and Mammal (Mammal subclass of Animal), adds an individual of class Mammal, and asserts query({ class: "Animal" }) returns that individual when includeSubclasses is true (default).
- Property inheritance: unit test defines property hasHabitat with domain Animal, adds an individual of class Mammal with hasHabitat = "forest", and asserts query({ property: "hasHabitat", value: "forest" }) returns the Mammal instance; a combined query({ class: "Animal", property: "hasHabitat", value: "forest" }) also returns it.
- Explain: when opts.explain = true, inferred matches include matchedBy: "inferred" and inferenceChain arrays describing the inference steps; direct matches include matchedBy: "direct".
- Disabling inference: when opts.reasonLevel = "none" or includeSubclasses = false the tests verify only direct matches are returned.
- Deterministic ordering: tests assert that query results are returned in stable order (sorted by id).
- Unit tests: tests/unit/query.test.js contains tests for subclass closure, property inheritance, explain mode, and reason-level disabling and they pass deterministically.

# Testing recommendations

- Add or update tests/unit/query.test.js to include:
  - Basic pattern matches (class, property with literal, property reference)
  - Subclass closure: define classes Animal/Mammal, add Mammal individual, assert Animal query includes it
  - Property inheritance: define property on Animal, add Mammal individual with property value, assert property-based queries find it
  - Explain mode: assert matchedBy and inferenceChain contents for inferred matches
  - No-inference mode: assert reasonLevel = "none" prevents inferred matches
  - Determinism: assert stable ordering (sorted ids) for repeated queries
- Keep tests fast by constructing in-memory models via public API calls (defineClass, defineProperty, addIndividual) and avoid disk IO unless explicitly testing persistence interaction.

# Implementation notes

- Implementation strategy:
  - Maintain a class -> superclasses map and compute transitive subclass closure on mutation (defineClass) or compute lazily and cache.
  - Maintain a property -> domain set and a derived property-availability map that indicates which classes (including subclasses) a property applies to. Update this map when defineProperty or defineClass changes.
  - At query time, translate the pattern into a set of candidate individuals by:
    1. If pattern.class present: expand to include subclasses when includeSubclasses true.
    2. If pattern.property present: filter individuals that have that property value in their stored properties; when class filtering is present, consult property-availability to determine which classes to include.
  - When opts.explain true: accumulate human-readable steps that led to an inferred match into inferenceChain.
  - Always sort results by id before returning.

- Avoid heavy dependencies; implement inference helpers in src/lib/main.js or as a small internal module so they are easy to test.

# Migration and compatibility

- Keep reasonLevel default at "simple" so existing users gain inference improvements by default. Provide an opt-out with reasonLevel = "none" for deterministic behaviour identical to previous implementations.

# Related features

- DEFINE_CLASS
- DEFINE_PROPERTY
- INDIVIDUAL_MANAGEMENT
- PERSISTENCE
- STATS

# Implementation

- Status: PARTIALLY_IMPLEMENTED — subclass closure is present, property inheritance is not yet implemented in the current codebase.
- Action: Implement property-availability mapping and update query() to consult class/property inheritance rules; add the new unit tests described above and ensure all tests pass.
- Notes: Keep the change minimal and local to query-related helpers; prefer adding targeted unit tests that fail first (red) and then implement the minimal code to make them pass (green).