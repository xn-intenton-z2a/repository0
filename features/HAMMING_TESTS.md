# HAMMING_TESTS

Status: IMPLEMENTED — unit tests exist and cover core vectors, Unicode code-point behaviour, BigInt integers, and validation error cases.

Purpose
Provide a comprehensive, deterministic suite of unit tests that assert the public API behaviour for strings and integers (Number and BigInt). Tests must verify correct values and thrown error types.

Scope
- Unit tests in tests/unit/ examine named exports from src/lib/main.js.
- Behaviour tests (Playwright) validate the web UI where present.
- Tests must assert TypeError and RangeError constructors for invalid inputs.

Test vectors
- string: "karolin" vs "kathrin" => 3
- string: "" vs "" => 0
- unequal-length strings => RangeError
- unicode: emoji differing count as 1
- bits: 1 vs 4 => 2
- bits: 0 vs 0 => 0
- BigInt: 1n vs 4n => 2
- mixed numeric kinds: 3 vs 3n => 0
- invalid inputs: non-string to string API => TypeError; fractional numbers => TypeError; negative integers => RangeError

Acceptance Criteria
- tests/unit/hamming.test.js exists and asserts the core string and integer vectors.
- tests/unit/hamming.bigint-and-unicode.test.js exists and asserts BigInt and Unicode vectors.
- tests/unit/main.test.js or equivalent asserts main(--version) and main(--identity) behaviour.
- Tests assert error constructor types (TypeError, RangeError).
- Running npm test exits successfully (CI passes) when repository is in a compliant state.

Notes
- If additional test files exist, list them in the test index; maintain coverage thresholds per agentic-lib configuration.
