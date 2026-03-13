# TESTS_AND_CI

Status: pending

Create comprehensive unit tests for both functions and ensure they run with `npm test` (vitest).

Test Coverage Requirements

- Normal cases:
  - `hammingDistance("karolin", "kathrin")` -> 3
  - `hammingDistanceBits(1, 4)` -> 2
- Edge cases:
  - Empty strings: `""`, `""` -> 0
  - Zero integers: `0, 0` -> 0
  - Large integers (Numbers within safe integer range and BigInt variants) — ensure correct popcount behavior.
  - Unicode supplementary characters and emoji.
- Error cases:
  - Unequal-length strings -> `RangeError`.
  - Non-string inputs -> `TypeError`.
  - Negative integers -> `RangeError`.
  - Non-integer numeric inputs -> `TypeError`.

Acceptance Criteria

- Tests exist in `tests/unit/` importing from `src/lib/main.js`.
- `npm test` runs the tests and they pass locally/CI.
- Tests explicitly assert the specified error types are thrown for invalid inputs.