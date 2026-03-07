# SUBCLASS_INFERENCE

## Summary

Add a lightweight transitive subclass inference feature to the ontology library so consumers can optionally treat subclass relationships as inheritance when querying, counting and validating individuals. The feature specifies the API, expected behaviour, and tests needed to ensure deterministic, dependency-free inference suitable for small JSON-LD ontologies stored in data/.

## Rationale

Queries such as "all instances of Animal" should include objects typed as subclasses (Dog, Cat). Many consumers expect this behaviour; providing a well-specified, simple transitive closure over rdfs:subClassOf edges increases usability without introducing a full OWL reasoner.

## Design

- Purpose: compute the transitive closure of subclass relationships and expose query and helper functions that optionally use the closure to treat subclass membership as inheritance.

- API (to be exported from src/lib/main.js as named exports):
  - enableInference(flag): toggle global inference behaviour (default: false). The library should still accept per-call options.
  - getSuperClasses(className, { includeSelf?: boolean } = {}): return an array of superclass names reachable by following rdfs:subClassOf edges transitively; includeSelf defaults to true.
  - getSubClasses(className, { includeSelf?: boolean } = {}): return an array of subclass names transitively.
  - isInstanceOf(individualId, className, { inferred?: boolean } = {}): return true if the individual is typed as className or, when inferred is true, typed as any subclass of className.
  - query(pattern, { inference?: boolean } = {}): extend the existing query API so when inference or global enableInference is true, pattern matching respects the subclass closure (for instanceOf queries and property domain/range checks where appropriate).
  - findInstances(className, { inference?: boolean } = {}): convenience helper that returns individuals whose explicit type equals className or, when inference is enabled, whose type is a subclass of className.
  - stats({ includeInferred?: boolean } = {}): existing stats() behaviour extended so includeInferred true counts individuals under classes reachable via inference; ensure counts avoid double-counting individuals for multiple matched classes unless specifically aggregated per-class.

- Implementation notes:
  - Keep implementation small and dependency-free; perform a DFS/BFS over in-memory subclass edges to compute closures and cache results per-change for performance (invalidate cache on defineClass/defineProperty/addIndividual/load/save operations).
  - Use stable ordering (alphabetical) for the arrays returned to maintain determinism in tests.
  - The inference must be best-effort and limited to rdfs:subClassOf transitivity; do not attempt other OWL inferences.
  - Ensure operations are synchronous and simple to test; prefer pure JS functions inside src/lib/main.js so web and CLI examples can import them without extra tooling.

## Tests

Add unit tests under tests/unit/ that assert the following behaviours:

- Transitive closure test: given A subclassOf B and B subclassOf C, getSuperClasses(A) returns ["A","B","C"] when includeSelf true, and getSubClasses(C) returns ["C","B","A"] when includeSelf true.

- findInstances inference: with class hierarchy Animal > Mammal > Dog and an individual typed as Dog, findInstances("Animal", { inference: true }) returns the Dog individual; with inference false it does not.

- stats with includeInferred: stats({ includeInferred: true }) reports counts that include individuals under their superclasses via inference; ensure counts are deterministic and test asserts exact numbers for the seed animal taxonomy.

- isInstanceOf checks: isInstanceOf(individualId, superclass, { inferred: true }) returns true for instances of subclasses; with inferred false returns only explicit types.

- Cache invalidation: after defining a new subclass or loading new data, cached closures are invalidated and subsequent getSuperClasses reflects new relationships.

- No duplicate counting: when an individual belongs to multiple classes transitively, per-class queries include the individual where relevant but aggregated counts used in stats do not double-count the same individual for a single class metric (document any specific aggregation semantics in tests).

## Acceptance Criteria

- Transitive subclass closure functions getSuperClasses and getSubClasses are exported and return deterministic, alphabetically sorted arrays.
- findInstances supports an inference option and returns instances typed as subclasses when inference is enabled.
- stats supports includeInferred and returns counts consistent with inferred membership for the included seed data.
- isInstanceOf supports an inferred flag and produces expected boolean results for explicit and inferred membership.
- The cache is invalidated when ontology structure mutates (new classes, subclass edges, or load()), and tests assert the cache behaviour.
- All new tests pass under the existing test runner without adding external dependencies.

## Compatibility Notes

- This feature is intentionally small: it only adds rdfs:subClassOf transitive closure and related helpers, not full OWL reasoning.
- Implementation must live in src/lib/main.js so the web example and CLI can import it without additional files.
- The web example and README may later opt to enable inference by default or expose an option in the UI; this spec only defines the API and tests.
