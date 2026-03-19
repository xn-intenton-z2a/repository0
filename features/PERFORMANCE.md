# PERFORMANCE

## Summary
Guidance and an optional streaming generator variant to handle large n without excessive memory use.

## Specification
- Provide an iterative implementation and an optional generator function fizzBuzzGenerator(n) that yields results one at a time to reduce peak memory.
- Document expected behavior for very large n and recommend testing with moderate large values rather than microbenchmarks in unit tests.

## Acceptance criteria
- The repository documents an approach to support large n via a generator or streaming API.
- Unit tests validate the generator yields the correct first and last items for a chosen test n.
