# QUERY_INFERENCE

Summary

Provide a deterministic, easy-to-test query API with a small, auditable inference layer that supports transitive subclass reasoning and property-availability inheritance. The feature enhances the existing query() API exported from src/lib/main.js so website demos, CLI and unit tests can rely on intuitive OWL-like behaviour without a full reasoner.

Motivation

A lightweight inference layer makes queries more useful for common ontology tasks (for example: querying for all Animals should return instances of Mammal). Keeping inference simple and deterministic keeps tests stable and execution fast on the seed datasets used by the mission.

Specification

API surface

- query(pattern, opts?)
  - pattern is an object with optional keys: class, property, value, target.
  - opts supports:
    - includeSubclasses: boolean (default true) — include instances of subclasses when matching a class.
    - reasonLevel: none | simple (default simple) — none disables inference, simple applies subclass closure and property-availability inheritance only.
    - explain: boolean (default false) — when true, results include matchedBy and inferenceChain fields explaining inferred matches.
  - Returns an array of result objects. When explain is false each result is the matched individual object; when explain is true each result is extended with matchedBy: "direct" | "inferred" and inferenceChain: an array of concise human-readable steps.

Pattern behaviour

- class: short name or IRI of a class. When present, candidate instances are those whose declared class equals the class or (when includeSubclasses true) any subclass transitively.
- property: short name or IRI of a property. Matches individuals that have the named property with a value matching value (when value provided) or that reference target (when target provided).
- value: literal to match against property values.
- target: an individual id for reference-style property matching.

Determinism and ordering

- Results must be deterministic. The implementation sorts results by a stable key (preferably individual id) before returning so tests and UI remain stable across runs.

Inference semantics

- Subclass closure: classes are treated transitively. A query for class C matches any individual whose declared class is C or any subclass of C.
- Property-availability inheritance: a property declared with a domain that includes class C is considered applicable to instances of subclasses of C. Querying for class C and property P must consider property declarations on C and its superclasses.
- Explanation: when explain is true, inferred matches include inferenceChain entries such as "Mammal rdfs:subClassOf Animal" or "property hasHabitat declared on Animal, applied to Mammal" to make reasoning steps auditable.

Performance

- The inference layer must be lightweight. Implementations should precompute or memoise subclass closure and property-availability maps on schema mutation (defineClass/defineProperty) and reuse them for queries to avoid repeated traversal.
- The design must be efficient for small seed datasets (tens of classes and hundreds of individuals) and must not attempt full OWL reasoning.

Acceptance Criteria

- API: query is exported as a named function from src/lib/main.js and supports query(pattern, opts?).
- Basic pattern support: query({ class: "Animal" }), query({ property: "hasName", value: "Fido" }), query({ property: "friendOf", target: "dog1" }) work as described.
- Subclass inference: a unit test creates classes Animal and Mammal (Mammal subclass of Animal), adds an individual of class Mammal, and asserts query({ class: "Animal" }) returns the Mammal instance when includeSubclasses is true (default).
- Property inheritance: a unit test defines property hasHabitat with domain Animal, adds a Mammal instance with hasHabitat = "forest", and asserts query({ property: "hasHabitat", value: "forest" }) returns that instance; combined query({ class: "Animal", property: "hasHabitat", value: "forest" }) also returns it.
- Explainable matches: when opts.explain = true, inferred results include matchedBy: "inferred" and inferenceChain arrays describing inference steps; direct matches include matchedBy: "direct".
- Disabling inference: when opts.reasonLevel = "none" or includeSubclasses = false the tests verify only direct matches are returned.
- Deterministic ordering: tests assert query results are returned in stable order (sorted by id).
- Tests: tests/unit/query.test.js contains the tests above and they pass deterministically.

Testing recommendations

- Implement tests that build the model in-memory using defineClass, defineProperty, addIndividual and avoid disk IO unless explicitly testing persistence interaction.
- Recommended test cases:
  - subclass closure test: define Animal/Mammal, add Mammal instance, assert Animal query returns it
  - property inheritance test: define property on Animal, add Mammal instance with the property, assert queries find it
  - explain test: assert matchedBy and inferenceChain for inferred matches
  - no-inference test: verify reasonLevel none prevents inferred matches
  - deterministic ordering: run the same query multiple times and assert stable order

Implementation notes

- Maintain a class -> superclasses map and compute transitive subclass closure on mutation or lazily with caching.
- Maintain a property domain map and compute property-availability per class (including subclasses) when classes or properties change.
- At query time translate the pattern into candidate classes and properties then filter individuals accordingly; gather explanation steps when explain is true.
- Always sort final result set by individual id before returning.
- Keep inference code in a small internal helper to keep surface API code clear and simple to test.

Compatibility and migration

- Default reasonLevel is simple to give users the benefit of intuitive inference; an opt-out via reasonLevel = none preserves previous behaviour for consumers needing exact-match semantics.
- Implement new behaviour behind unit tests incrementally: add failing tests first and then implement property-availability mapping and query changes.

Related features

- DEFINE_CLASS
- DEFINE_PROPERTY
- INDIVIDUAL_MANAGEMENT
- PERSISTENCE
- STATS

Implementation plan

- Status: PARTIALLY_IMPLEMENTED — subclass closure exists in the codebase but property-availability inheritance and explain mode require enhancement.
- Tasks:
  - Add or update tests in tests/unit/query.test.js to codify acceptance criteria and demonstrate failing tests for current gaps.
  - Implement property-availability mapping and update query() to consult class/property inheritance rules and produce explanation chains when explain true.
  - Ensure deterministic ordering and add memoisation for class closure and property maps.
  - Run unit tests and iterate until all tests pass.

Acceptance test examples (high-level steps for tests)

- Create classes: defineClass("Animal"), defineClass("Mammal", "Animal").
- Define property: defineProperty("hasHabitat", "Animal", "Literal").
- Add individual: addIndividual("Mammal", "m1", { hasHabitat: "forest" }).
- Assert: query({ class: "Animal" }) returns individual m1.
- Assert: query({ property: "hasHabitat", value: "forest" }) returns m1.
- Assert: query({ class: "Animal", property: "hasHabitat", value: "forest" }, { explain: true }) returns m1 with matchedBy "inferred" and inferenceChain including "Mammal rdfs:subClassOf Animal".

Notes

- Keep the implementation focused and small; avoid adding full OWL reasoning. The goal is pragmatic: small useful inference that is auditable and testable.
- Ensure tests are fast and deterministic by operating on in-memory models.

# End of spec
