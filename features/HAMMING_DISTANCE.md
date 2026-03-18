# HAMMING_DISTANCE

Status: IMPLEMENTED — functionality present in src/lib/main.js and verified by tests/unit/hamming.test.js

Purpose
Provide a focused, testable feature that implements Hamming distance calculations for two use cases: equal-length Unicode strings (count differing code points) and non-negative integers (count differing bits).

Scope
- Implementations must live in src/lib/main.js and be exported as named exports from that file.
- Unit tests must be added to tests/unit/ to cover normal, edge, and error cases.
- README must include usage examples showing the public API.

API
- hammingDistanceStrings(a, b)
  - Description: Compute the Hamming distance between two strings of equal length by comparing Unicode code points (not UTF-16 code units).
  - Inputs: two strings of equal length.
  - Output: non-negative integer: the count of positions where code points differ.
  - Errors: throw TypeError if either argument is not a string; throw RangeError if the strings are not the same length.

- hammingDistanceBits(a, b)
  - Description: Compute the bit-level Hamming distance between two non-negative integers by computing the XOR and counting set bits.
  - Inputs: two non-negative integers. Accept Number or BigInt types; both arguments must be of the same numeric kind or the implementation may coerce safely (implementation guidance below).
  - Output: non-negative integer: the count of differing bits.
  - Errors: throw TypeError for non-integer or non-numeric arguments; throw RangeError for negative integers.

Behavior and Implementation Notes
- Unicode handling: iterate strings by Unicode code points (for example using for-of or Array.from) so multi-code-unit characters are treated as single positions.
- Bit counting: compute XOR of the two inputs and count set bits efficiently (Kernighan's algorithm or built-in population count if available). Support BigInt XOR and loop when inputs are BigInt.
- Input validation: be explicit about types. For strings, require typeof === "string". For integer inputs, require Number.isInteger for Numbers and typeof === "bigint" for BigInt. Negative values must raise RangeError.
- Exports: export the public functions as named exports from src/lib/main.js so tests can import them directly.

Edge cases and constraints
- Empty strings should return 0 when both are empty.
- Zero and zero should return 0 for bit-level distance.
- Strings of different length must produce a RangeError.
- Non-string inputs to the string API must produce a TypeError.
- Negative integers must produce a RangeError.

Acceptance Criteria
- Hamming distance between karolin and kathrin is 3.
- Hamming distance between an empty string and an empty string is 0.
- Hamming distance between strings of different lengths throws RangeError.
- Bit-level Hamming distance between 1 and 4 is 2.
- Bit-level Hamming distance between 0 and 0 is 0.
- All public API is exported as named exports from src/lib/main.js.
- Functions throw TypeError for invalid argument types and RangeError for invalid numeric ranges or unequal string lengths.
- Unit tests cover normal cases, edge cases (empty strings, zero, large integers), and error cases.
- README documents usage with examples for both APIs.

Testing notes
- Add unit tests that assert values and that errors are thrown with the correct error constructors (TypeError, RangeError).
- Include tests that specifically verify Unicode handling: e.g., strings with emoji or astral plane characters where code points differ but UTF-16 code units may differ in length.

Implementation guidance
- Keep the API small and focused; prefer clear names hammingDistanceStrings and hammingDistanceBits.
- Implement string comparison by converting to arrays of code points before comparing lengths; then iterate indices and compare values.
- Implement integer comparison by normalizing to either Number or BigInt (prefer preserving BigInt when either input is BigInt), XOR them, and count set bits.

Notes
- This feature is designed to be implemented entirely within this repository (src/lib/main.js, tests/unit/, README). No infrastructure changes are required.
- Keep exports named and documented so examples in README can import the functions directly.
