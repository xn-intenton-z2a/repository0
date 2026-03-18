# TESTS

Purpose
Describe the unit test surface required to satisfy acceptance criteria and ensure regression protection.

Test locations
- Unit tests must live in tests/unit and target the exported functions directly.
- Core test file(s): tests/unit/hamming.test.js for function-level tests and tests/unit/main.test.js for basic CLI/identity smoke tests.

Required test cases (exact, testable)
- String tests:
  - hammingString("karolin", "kathrin") => 3
  - hammingString("", "") => 0
  - Strings of different code point lengths throw RangeError
  - Non-string inputs throw TypeError
  - Surrogate pair handling: astral code points count as a single code point and differences are counted per code point
- Integer tests:
  - hammingBits(1, 4) => 2
  - hammingBits(0, 0) => 0
  - BigInt inputs: hammingBits(1n, 4n) => 2
  - Negative integers throw RangeError
  - Non-integer Numbers (for example 1.5) and other invalid types throw TypeError
- API tests:
  - Import named exports from src/lib/main.js: hammingString and hammingBits must be present
  - main() must be callable in tests and terminate without throwing

Acceptance criteria
- Tests in tests/unit cover the normal, edge and error cases listed above.
- All tests pass in the project's test runner.
