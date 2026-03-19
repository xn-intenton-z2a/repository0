# VALIDATION

Summary

Define strict Roman numeral validation rules and edge cases so that romanToInt rejects invalid input with a TypeError and tests can assert invalid cases precisely.

Goal

Provide a precise validation specification that enforces canonical Roman numeral formation (characters, allowed subtractive pairs, repetition limits, and order). Tests will use these rules to verify romanToInt throws TypeError for invalid inputs.

Validation rules

1. Allowed characters: only uppercase I, V, X, L, C, D, M. Any other character (including lowercase) is invalid.
2. Repetition limits:
   - I, X, C, M may repeat up to three times in a row (III, XXX, CCC, MMM) but not four (IIII is invalid).
   - V, L, D may never repeat consecutively (VV, LL, DD invalid).
3. Subtractive notation:
   - Only these subtractive pairs are permitted: IV (4), IX (9), XL (40), XC (90), CD (400), CM (900).
   - A subtractive pair must consist of a single smaller-value symbol immediately followed by a larger-value symbol. Other combinations such as IL, IC, XM, or VX are invalid.
   - Subtractive usage may not be chained (e.g., IIX is invalid).
4. Ordering rules:
   - Symbols must appear in descending value order except where a valid subtractive pair occurs.
   - After a subtractive pair, ordering resumes according to numeric values.
5. Empty string or non-string input is invalid.

Examples

- Valid: I, II, III, IV, IX, XL, XC, CD, CM, MCMXCIV.
- Invalid: IIII (too many repeats), VX (invalid order/subtractive), IC (invalid subtractive pair), empty string, "mcm" (lowercase not allowed).

Acceptance criteria (testable)

1. romanToInt("IIII") throws TypeError.
2. romanToInt("VX") throws TypeError.
3. romanToInt("") throws TypeError.
4. romanToInt("mcmxciv") throws TypeError.
5. Allowed subtractive pairs (IV, IX, XL, XC, CD, CM) parse correctly and produce expected values.

Implementation notes

- Validation may be implemented via a deterministic parser rather than a single regex to provide clearer error messages in tests.
- Tests should enumerate both valid and invalid cases explicitly.

Files to change

- src/lib/main.js (validation logic inside romanToInt)
- tests/unit/main.test.js (add failing-case tests and valid-case tests for validation rules)
