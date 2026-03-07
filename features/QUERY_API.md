# QUERY_API

Summary

Define and specify the behaviour of the library's query API so consumers can perform common ontology queries: list instances of a class, find individuals by property values, and run simple pattern matches against triples.

Rationale

A compact, well-specified query API lets the library be useful for both programmatic consumers and the example website. Tests and examples should cover key use cases to prevent regressions.

Design

- API: query(pattern) where pattern is a simple object describing subject, predicate, and object with optional wildcards. Also provide convenience helpers: findInstances(className) and findByProperty(propertyName, value).
- Supported pattern forms: { type: 'instanceOf', class: 'ClassName' } and { property: 'propName', value: 'literalOrId' } and triple-like { s: '?', p: 'hasName', o: 'Fido' } where ? matches any subject.
- Return format: array of individuals or triples, each represented as plain JS objects with ids and properties.
- Performance: queries run in-memory against the current graph. Document complexity assumptions and that this is not a SPARQL replacement.

Tests

- Unit tests for findInstances and findByProperty using the animal seed: find all Dogs, find individuals with property color: brown, and pattern-match queries returning expected triples.
- Edge cases: no matches, multiple matches, and property values that are IRIs vs literals.

Acceptance Criteria

- query(pattern) supports the listed pattern forms and returns the expected results for example data.
- findInstances and findByProperty are exported named functions and covered by unit tests.
- README includes at least two query examples demonstrating common use.
