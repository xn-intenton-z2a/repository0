# TESTS

Purpose
Describe the unit test surface required to satisfy acceptance criteria and ensure regression protection.

Test locations
- Unit tests must live in tests/unit and target the exported functions directly.

Required test cases
- String tests:
  - karolin vs kathrin -> 3
  - empty vs empty -> 0
  - composed vs decomposed -> 0
  - unequal lengths -> RangeError
  - non-string types -> TypeError
- Integer tests:
  - 1 vs 4 -> 2
  - 0 vs 0 -> 0
  - large BigInt values -> correct bit count
  - negative -> RangeError
  - fractional Number -> TypeError
- API tests:
  - Import named exports from src/lib/main.js
  - CLI invocation returns expected numeric output for sample inputs

Acceptance criteria
- Tests cover normal, edge and error cases listed above.
- All tests pass in the project's test runner.
