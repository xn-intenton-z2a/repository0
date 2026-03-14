# QUERY_AND_INFERENCE

# Summary

Provide a simple pattern-matching query API that can locate individuals by class and by matching property values, and optionally apply light-weight, deterministic inference. Export query as a named export from src/lib/main.js. Inference covers transitive subclass reasoning and simple property inheritance so queries for a superclass return instances of its subclasses and properties declared on superclasses are visible for subclass instances.

# Motivation

A query API is essential for discovering data in the ontology programmatically and for powering the website examples and tests. Adding a minimal inference layer makes the library feel OWL-like for common use-cases (e.g., query Animal returns Mammal instances) without introducing a full reasoning engine.

# Specification

API

- query(pattern, opts?)
  - Accepts a pattern object describing selection criteria and an optional options object.
  - Supported pattern shapes include (examples):
    - { class: "Animal" } — find all individuals of a class (by short name or IRI)
    - { property: "hasName", value: "Fido" } — find individuals where a property equals a literal value
    - { property: "friendOf", target: "_:id123" } — find individuals where a property references a specific individual id
    - { class: "Animal", property: "hasColor", value: "brown" } — combined filters
  - Options (opts):
    - includeSubclasses: boolean (default: true) — when true, class-based queries include instances of subclasses (transitive closure)
    - reasonLevel: "none" | "rdfs" | "simple" (default: "simple") — controls the extent of inference; "simple" applies subclass transitive closure and property inheritance, "rdfs" is reserved for future RDFS-like rules, and "none" disables inference
    - explain: boolean (default: false) — when true, return enriched result objects describing whether a match was direct or inferred and the inference chain
  - Returns an array of matching individual objects. When opts.explain is true, each result includes metadata: { id, class, matchedBy: "direct"|"inferred", inferenceChain?: [string] }

Inference behaviour

- Subclass reasoning: compute the transitive closure of subclass relationships so that a query for class C matches individuals whose declared class is C or any subclass of C.
- Property inheritance: properties declared on a superclass are considered available to instances of its subclasses. When matching a property predicate, the implementation should consider properties declared on the instance's class and any of its superclasses.
- Determinism: inference results are deterministic given the same in-memory model and recorded subclass/property relationships. No non-deterministic or probabilistic reasoning is performed.
- Performance: inference is intentionally lightweight. Implementations may precompute subclass closure and property inheritance mapping at mutation time or compute them lazily at query time; tests assume reasonable performance on small seed datasets.

Behavior

- Queries execute against the in-memory model and reflect the current state (including unpersisted changes).
- When includeSubclasses is true (default), class queries return instances of subclasses.
- When reasonLevel is "none", queries use only direct class and property data and do not apply inference.
- When opts.explain is true, results include a concise inferenceChain showing assertions used to derive an inferred match (for example: ["Mammal rdfs:subClassOf Animal"]).

# Acceptance Criteria

- query is exported as a named function from src/lib/main.js and supports the extended signature query(pattern, opts?).
- Existing query behaviours are preserved: find-by-class, find-by-property literal, and find-by-property reference continue to work when opts.reasonLevel is "none".
- Subclass inference: a unit test creates classes Animal and Mammal (Mammal rdfs:subClassOf Animal), adds an individual of type Mammal, and asserts that query({ class: "Animal" }) returns that individual when includeSubclasses is true (default).
- Property inheritance: define a property hasHabitat on class Animal, add an individual of class Mammal with hasHabitat = "forest", and assert query({ property: "hasHabitat", value: "forest" }) finds the Mammal instance even though the property was declared on Animal.
- explain mode: when opts.explain = true, inferred matches include matchedBy: "inferred" and an inferenceChain array explaining the rule(s) applied; direct matches have matchedBy: "direct".
- Disabling inference: when opts.reasonLevel = "none" or includeSubclasses = false, the same model returns only direct matches; tests assert both behaviours.
- Unit tests for the above behaviours exist in tests/unit/query.test.js and run deterministically.

# Testing Recommendations

- Extend tests/unit/query.test.js to cover:
  - Basic patterns: find by class, property literal, and property reference (existing tests)
  - Subclass reasoning round-trip: define class hierarchy, add instances, assert superclass queries return subclass instances
  - Property inheritance: define property on superclass, assert queries find subclass instances with that property
  - explain mode assertions: check matchedBy and inferenceChain contents for inferred matches
  - reason disabling: assert that opts.reasonLevel = "none" prevents inferred matches

- Use temporary in-memory models constructed via the public API (defineClass/defineProperty/addIndividual) to keep tests fast and isolated.

# Implementation Notes

- Keep inference implementation intentionally small and auditable: compute subclass transitive closure using depth-first traversal or memoised recursion; compute property availability per class by walking its superclasses and merging declarations.
- Maintain deterministic ordering for results (for example sort by individual id) so tests and UI remain stable.
- The explanation strings in inferenceChain should be short and human-readable, for example: "Mammal rdfs:subClassOf Animal" or "property hasHabitat inherited from Animal".
- Avoid introducing heavyweight third-party reasoners; prefer a small, purpose-built inference helper in the library that is easy to unit test.

# Related features

- INDIVIDUAL_MANAGEMENT
- DEFINE_PROPERTY
- DEFINE_CLASS
- PERSISTENCE
- STATS
