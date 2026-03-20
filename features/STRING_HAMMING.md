STRING_HAMMING

Goal
----
Compute the Hamming distance between two strings measured in Unicode code points (not UTF-16 code units). Provide a clear, testable API that validates inputs exactly as required by MISSION.md and documents normalization guidance for callers.

Behavior and API
----------------
- Exported function: stringHamming(a: string, b: string): number
- Inputs: two strings a and b
- Operation: iterate Unicode code points (not UTF-16 code units) and count positions where corresponding code points differ
- Validation: throw TypeError when either argument is not a string; throw RangeError when the code point lengths differ
- Normalization: function does not perform Unicode normalization; callers should normalize inputs using String.prototype.normalize when canonical equivalence is required
- Purity: function must be pure and side-effect free

Acceptance Criteria (Testable)
------------------------------
1. stringHamming('karolin', 'kathrin') === 3
2. stringHamming('', '') === 0
3. stringHamming('abc', 'abc') === 0
4. stringHamming('açd', 'acd') === 1
5. stringHamming('a😀b', 'a😁b') === 1
6. stringHamming('ab', 'abc') throws RangeError
7. stringHamming(123 as any, 'abc') throws TypeError
8. Combining sequences: stringHamming('é', 'e\u0301') returns 1 unless inputs are normalized by the caller

Tests to include
----------------
- Unit tests covering ASCII, BMP, and non-BMP characters (including emoji and surrogate pairs)
- Edge cases: empty strings and long strings
- Error tests for non-string inputs and unequal code-point lengths

Implementation Notes
--------------------
- Use Array.from(string) or for..of to iterate code points safely
- Compare code points by strict equality and count mismatches
- Ensure precise error types per mission requirements

Related files to update when implementing
-----------------------------------------
- src/lib/main.js: export named function stringHamming
- tests/unit/: add tests that assert the acceptance criteria above
- README.md: add usage examples and note about normalization
