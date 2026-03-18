# HAMMING_TESTS

Status: PARTIALLY_IMPLEMENTED — core unit tests exist in tests/unit/hamming.test.js; additional tests for BigInt and CLI are pending.

Purpose
Add a focused, comprehensive suite of unit and CLI tests that validate the Hamming library behaviour for strings, integers, BigInt, Unicode, and error conditions.

Scope
- Unit tests under tests/unit/ import named exports from src/lib/main.js and assert correct behaviour across normal, edge, and error cases.
- CLI-level tests should exercise the command-line interface (string and bits modes) verifying stdout content and non-zero exit behaviour for invalid input.
- Add tests for BigInt support if the BigInt feature is implemented.

Test vectors (must be asserted)
- string: karolin vs kathrin => 3
- string: empty string vs empty string => 0
- unequal-length strings => RangeError
- unicode: differing emoji should count as 1
- bits: 1 vs 4 => 2
- bits: 0 vs 0 => 0
- BigInt: 1n vs 4n => 2 (pending until BigInt feature implemented)
- mixed numeric kinds: Number 1 and BigInt 4n => 2 (pending)
- invalid inputs: non-string to string API => TypeError; fractional numbers => TypeError; negative integers => RangeError

Acceptance Criteria
- tests/unit/hamming.test.js exists and asserts core vectors (string, integer, unicode, error cases).
- New tests are added for BigInt inputs (when implemented) and for the CLI behaviour (string and bits modes).
- Tests assert error constructor types (TypeError, RangeError), not only messages.
