# UNIT_TESTS

Summary
Add unit tests that fully cover normal and edge-case behaviour of the FizzBuzz library.

Implementation
- Create or update tests/unit/main.test.js to include tests for:
  - All core acceptance cases listed in FIZZBUZZ_CORE
  - All edge cases listed in EDGE_CASES
  - Additional property tests such as: first element is "1" and array length equals n when n > 0
- Use Vitest and the existing npm test script for running tests.

Acceptance Criteria
- [ ] tests/unit/main.test.js exists and imports the named exports from src/lib/main.js
- [ ] Running npm test exits successfully with zero status
- [ ] Tests assert the specific return values and thrown errors described by the other feature specs

Notes
- Keep tests small and deterministic; avoid flaky or environment-dependent assertions.