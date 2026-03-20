# STRING_HAMMING

## Goal
Compute the Hamming distance between two strings measured in Unicode code points (not UTF-16 code units). Provide a clear, testable API, exact validation rules, and guidance on normalization for callers.

## Behavior and API
- Exported function: named export stringHamming(a: string, b: string): number
- Operation: iterate Unicode code points (for example via for..of or Array.from) and count positions where corresponding code points differ
- Normalization: the function does not perform Unicode normalization; callers should normalize using String.prototype.normalize when canonical equivalence is desired
- Purity: function must be pure and side-effect free

## Validation
- Throw TypeError when either argument is not a string
- Throw RangeError when the code point lengths differ

## Acceptance Criteria (Testable)
1. stringHamming('karolin', 'kathrin') === 3
2. stringHamming('', '') === 0
3. stringHamming('abc', 'abc') === 0
4. stringHamming('açd', 'acd') === 1
5. stringHamming('a😀b', 'a😁b') === 1
6. stringHamming('ab', 'abc') throws RangeError
7. stringHamming(123 as any, 'abc') throws TypeError
8. stringHamming('é', 'e\u0301') returns 1 unless inputs are normalized by the caller

## Tests to include
- Unit tests covering ASCII, BMP, and non-BMP characters (surrogate pairs and emoji)
- Edge cases: empty strings and long strings
- Error tests for non-string inputs and unequal code-point lengths

## Implementation notes
- Iterate code points using for..of or Array.from(string) to handle surrogate pairs correctly
- Compare code points by strict equality and count mismatches
- Do not perform normalization implicitly; document this clearly in README

## Related changes when implementing
- Export stringHamming from src/lib/main.js as a named export
- Add unit tests in tests/unit/ to assert the acceptance criteria above
- Update README.md with usage examples and a note about normalization
