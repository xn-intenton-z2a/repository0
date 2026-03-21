# UNIT_TESTS

Purpose
Add unit tests that verify correct behaviour for normal cases and all edge cases defined in MISSION.md and VALIDATION.

Specification
- Add tests under tests/unit/main.test.js that import fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- Assert exact array content for fizzBuzz(15) and string outputs for fizzBuzzSingle for sample inputs.
- Test edge cases: fizzBuzz(0), negative inputs (expect RangeError), non-integers (expect TypeError).
- Tests should run via npm test (vitest) and be deterministic.

Acceptance criteria
- [ ] tests/unit/main.test.js exists and imports the named exports from src/lib/main.js
- [ ] tests assert the expected array for fizzBuzz(15)
- [ ] tests assert thrown RangeError for negative inputs and TypeError for non-integers
- [ ] npm test runs the new tests

Notes
Keep tests focused on behaviour; avoid coupling tests to implementation details.
