# HAMMING_DISTANCE_TESTS

Status: implemented and pruned

This feature specified the unit tests required to validate the Hamming distance API. The repository includes unit tests covering normal, edge, and error cases.

Acceptance Criteria (verified)

- Unit tests exist in tests/unit/ that import the functions from src/lib/main.js. (Verified)
- Tests cover normal cases: hammingDistance("karolin", "kathrin") -> 3; hammingDistanceBits(1, 4) -> 2. (Verified)
- Tests cover edge cases: empty strings ("", "") -> 0; zero integers (0, 0) -> 0; large integers using BigInt. (Verified)
- Tests cover error cases: hammingDistance("a","bb") throws RangeError; non-string inputs throw TypeError; negative integers throw RangeError; non-integer numbers throw TypeError. (Verified)
- All tests are runnable with `npm test` and included in the repository. (Verified)

Notes

Feature pruned; tests present in tests/unit/.