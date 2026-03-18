# HAMMING_TESTS

Status: IMPLEMENTED

Purpose
Specify the unit and behaviour tests required to guard the library behaviour and acceptance criteria so regressions are detected by CI.

Scope
- Unit tests under tests/unit/ must import named exports from src/lib/main.js and assert return values and thrown exception types.
- Behaviour tests (Playwright) may exercise the web demo; unit tests are the primary guardrails.

Required test vectors
- Strings: karolin vs kathrin => 3
- Strings: empty vs empty => 0
- Strings: unequal code-point lengths => RangeError
- Unicode: emoji handling counts differing code points appropriately
- Numbers: 1 vs 4 => 2
- Numbers: 0 vs 0 => 0
- BigInt: 1n vs 4n => 2
- Mixed Number/BigInt: 3 vs 3n => 0
- Invalid inputs: non-string to string API => TypeError; fractional Number => TypeError; negative integers => RangeError

Acceptance Criteria
- tests/unit/hamming.test.js (or equivalent) exists and asserts the core vectors above
- Dedicated BigInt and Unicode unit tests exist and assert precision and code-point behaviour
- tests that assert error constructors (TypeError, RangeError) are present
- Running npm test exits successfully when implementation meets these criteria

Notes
- Keep tests deterministic and fast; avoid flaky network or timing dependencies in unit tests.
