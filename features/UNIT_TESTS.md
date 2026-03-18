# UNIT_TESTS

Summary
Define the required unit tests that verify correctness, input validation, Unicode handling, and BigInt support for the hamming library.

Specification
- Test runner: Vitest; place tests in tests/unit/main.test.js (or tests/unit/hamming.test.js).
- Tests must import named exports from src/lib/main.js: hammingString and hammingBits (or the exact exported identifiers defined in API_EXPORTS.md).
- Test cases (each must be a separate test with precise assertions):
  - Strings:
    - hammingString("karolin", "kathrin") === 3
    - hammingString("", "") === 0
    - hammingString("a😊b", "a😢b") === 1
    - hammingString("a", "ab") throws RangeError
    - hammingString(123, "a") throws TypeError
    - When options.normalize is 'NFC', composed vs decomposed inputs compare equal where appropriate
  - Integers / bits:
    - hammingBits(1, 4) === 2
    - hammingBits(0, 0) === 0
    - hammingBits(0n, 1n) === 1
    - hammingBits(1n << 100n, 0n) === 1
    - hammingBits(1.5, 1) throws TypeError
    - hammingBits(-1, 1) throws RangeError
- Edge cases:
  - Extremely large BigInt values should be tested for correctness (no overflow, use BigInt arithmetic)
  - Empty string and zero integer cases included above
- Test hygiene:
  - Use explicit import statements (named imports) from src/lib/main.js
  - Avoid modifying global state; tests must run in isolation

Acceptance criteria
- A test file with the above tests exists in tests/unit/ and asserts the listed expectations
- Tests assert thrown error types (TypeError or RangeError) exactly where specified
- Test suite runs under npm test and the new tests pass in a correctly implemented library

Notes
These unit tests form the baseline acceptance suite referenced by feature specs and the README examples.