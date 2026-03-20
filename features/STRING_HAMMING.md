# String Hamming Distance

Goal
----
Compute the Hamming distance between two strings measured in Unicode code points (not UTF-16 code units). Keep API minimal, testable, and consistent with MISSION.md validation rules.

Behavior & API
--------------
- Function: `stringHamming(a: string, b: string): number`
- Inputs: two strings `a` and `b`.
- Output: non-negative integer representing the number of positions at which the corresponding Unicode code points differ.
- Validation: throw TypeError if inputs are not strings; throw RangeError if the strings have unequal code point length.
- The function compares code points (use Array.from or for..of to iterate code points). Normalization (NFC/NFD) is not performed by default and should be done by callers when canonical equivalence is desired.

Acceptance Criteria (Testable)
------------------------------
1. Hamming distance: stringHamming('karolin', 'kathrin') === 3
2. Empty strings: stringHamming('', '') === 0
3. Exact match: stringHamming('abc', 'abc') === 0
4. Single difference: stringHamming('açd', 'acd') === 1
5. Emoji difference: stringHamming('a😀b', 'a😁b') === 1
6. Unequal lengths: stringHamming('ab', 'abc') throws RangeError
7. Type validation: stringHamming(123 as any, 'abc') throws TypeError
8. Combining characters: stringHamming('é', 'e\u0301') is 1 unless caller normalizes inputs

Tests to include
----------------
- Unit tests for ASCII and Unicode strings including BMP and non-BMP characters
- Edge cases: empty strings, surrogate pairs, combining sequences
- Error tests: non-string inputs and unequal code point length

Implementation Notes
--------------------
- Use Array.from(a) and Array.from(b) to obtain arrays of code points.
- If lengths differ, throw RangeError per mission validation rules.
- Compare corresponding code points using strict equality and count differences.
- Keep function pure and side-effect free; document normalization guidance in README.

Alignment with MISSION.md
-------------------------
- Implements required string Hamming capability using code point iteration
- Validates types and lengths as required by the mission (TypeError and RangeError)
- Includes clear, testable acceptance criteria to be used by unit tests
