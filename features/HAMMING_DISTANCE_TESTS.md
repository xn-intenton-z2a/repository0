# HAMMING_DISTANCE_TESTS

Specification

This feature specifies the unit tests required to validate the Hamming distance API implementation.

Acceptance Criteria

- Unit tests exist in tests/unit/ that import the functions from src/lib/main.js.
- Tests cover normal cases: hammingDistance("karolin", "kathrin") -> 3; hammingDistanceBits(1, 4) -> 2.
- Tests cover edge cases: empty strings ("", "") -> 0; zero integers (0, 0) -> 0; large integers using BigInt.
- Tests cover error cases: hammingDistance("a","bb") throws RangeError; non-string inputs throw TypeError; negative integers throw RangeError; non-integer numbers throw TypeError.
- All tests are runnable with `npm test` and included in the repository.

Notes

Keep tests focused and use descriptive test names so CI failures are actionable.