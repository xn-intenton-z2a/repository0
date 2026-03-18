# HAMMING_TESTS

Purpose
Add a focused, comprehensive suite of unit and CLI tests that validate the Hamming library behaviour for strings, integers, BigInt, Unicode, and error conditions.

Scope
- Add unit tests under tests/unit/ that import named exports from src/lib/main.js and assert correct behaviour across normal, edge and error cases.
- Add CLI tests under tests/unit/ that exercise the command-line interface (string and bits modes) verifying stdout content and non-zero exit behaviour for invalid input.
- Test vectors and cases to include (each must be asserted exactly in tests):
  - string: karolin vs kathrin => 3
  - string: empty string vs empty string => 0
  - unequal-length strings must throw RangeError
  - unicode: 😀 vs 😁 must be treated as single code points; differing emoji pair should produce 1 when they differ at that position
  - bits: 1 vs 4 => 2
  - bits: 0 vs 0 => 0
  - BigInt: 1n vs 4n => 2
  - mixed numeric kinds: Number 1 and BigInt 4n coerced/handled and return 2
  - invalid inputs: non-string to string API throws TypeError; fractional numbers (1.5) throw TypeError; negative integers throw RangeError

Acceptance Criteria
- tests/unit/hamming.test.js exists and contains assertions for all items listed in "Test vectors and cases to include" and uses the library's named exports.
- tests/unit/cli.test.js exists and verifies the CLI prints the expected numeric outputs for valid invocations and prints concise error messages and non-zero exits for invalid invocations.
- Running npm test executes the new tests (in addition to existing ones) and they pass when the library conforms to the mission requirements.

Notes
- Tests should assert error constructor types (TypeError, RangeError), not only error messages.
- Prefer small, deterministic test files with explicit input and expected output values for traceability.
