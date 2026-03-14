# VALIDATION_AND_TESTS

Overview

Define strict input validation rules and a complete unit test plan that satisfies the mission acceptance criteria and edge cases.

Deliverables

- Validation behaviour documented and tested: TypeError for wrong argument types, RangeError for unequal string lengths or negative integers.
- Unit tests to cover normal cases, edge cases, and error cases. Tests live in tests/unit/ and assert both return values and thrown errors.
- Examples included in README demonstrating error behaviour.

Validation rules

- Strings: both arguments must be strings. If not, throw TypeError with a clear message.
- Strings length check: measure code point length. If lengths differ, throw RangeError.
- Integers: both arguments must be numbers that are safe integers; if not numbers or not integers, throw TypeError. If negative, throw RangeError.

Testing checklist

- Normal string cases: karolin vs kathrin => 3; identical strings => 0; empty vs empty => 0.
- String error cases: different lengths raise RangeError; non-string inputs raise TypeError.
- Bit cases: 1 vs 4 => 2; 0 vs 0 => 0; large integers compared correctly.
- Integer error cases: negative integers raise RangeError; non-integer or non-number inputs raise TypeError.

Acceptance Criteria

- Unit tests exist that assert the exact acceptance examples from the mission.
- Tests explicitly assert thrown errors and message substrings to avoid brittle matches.
- Test coverage covers both code point and bit-level logic.

Notes

Keep test descriptions short and deterministic. Use small, explicit values for bit tests and a variety of Unicode examples for string tests.