# HAMMING_DISTANCE

Status: IMPLEMENTED — functionality present in src/lib/main.js and verified by tests/unit/hamming.test.js

Purpose
Provide a focused, testable feature that implements Hamming distance calculations for two use cases: equal-length Unicode strings (count differing code points) and non-negative integers (count differing bits).

Scope
- Implementations must live in src/lib/main.js and be exported as named exports from that file.
- Unit tests must be added to tests/unit/ to cover normal, edge, and error cases.
- README must include usage examples showing the public API.

API
- hammingDistanceString(a, b)
  - Description: Compute the Hamming distance between two strings of equal length by comparing Unicode code points (not UTF-16 code units).
  - Inputs: two strings of equal length.
  - Output: non-negative integer: the count of positions where code points differ.
  - Errors: throw TypeError if either argument is not a string; throw RangeError if the strings are not the same length.

- hammingDistanceInt(a, b)
  - Description: Compute the bit-level Hamming distance between two non-negative integers by computing the XOR and counting set bits.
  - Inputs: two non-negative integers. Accept Number (currently); BigInt support may be added via separate feature.
  - Output: non-negative integer: the count of differing bits.
  - Errors: throw TypeError for non-integer or non-numeric arguments; throw RangeError for negative integers.

Behavior and Implementation Notes
- Unicode handling: iterate strings by Unicode code points (for example using for-of or Array.from) so multi-code-unit characters are treated as single positions.
- Bit counting: compute XOR of the two inputs and count set bits efficiently (Kernighan's algorithm or BigInt loop for correctness).
- Input validation: be explicit about types. For strings, require typeof === 'string'. For integer inputs, require Number.isInteger for Numbers and typeof === 'bigint' for BigInt if supported. Negative values must raise RangeError.
- Exports: export the public functions as named exports from src/lib/main.js so tests can import them directly.

Edge cases and constraints
- Empty strings should return 0 when both are empty.
- Zero and zero should return 0 for bit-level distance.
- Strings of different length must produce a RangeError.
- Non-string inputs to the string API must produce a TypeError.
- Negative integers must produce a RangeError.

Acceptance Criteria
- Hamming distance between "karolin" and "kathrin" is 3.
- Hamming distance between "" and "" is 0.
- Hamming distance between strings of different lengths throws RangeError.
- Bit-level Hamming distance between 1 and 4 is 2.
- Bit-level Hamming distance between 0 and 0 is 0.
- All public API is exported as named exports from src/lib/main.js.
- Functions throw TypeError for invalid argument types and RangeError for invalid numeric ranges or unequal string lengths.
- Unit tests cover normal cases, edge cases (empty strings, zero, large integers within Number range), and error cases.
