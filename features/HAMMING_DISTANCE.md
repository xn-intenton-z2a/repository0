# HAMMING_DISTANCE

## Overview

Provide a small, well-documented JavaScript library implementing Hamming distance operations for strings and integers. The implementation is intended to live in a single source file src/lib/main.js, exported as named exports, and covered by unit tests in tests/unit. The feature directly realizes the project mission: a JavaScript library exporting Hamming distance functions.

## Specification

1. Purpose

   - Compute the Hamming distance between two Unicode strings of equal length.
   - Compute the Hamming distance between two non-negative integers by comparing their binary representations.

2. Public API

   - hammingDistance(a, b)
     - Parameters: a string a, a string b.
     - Returns: integer count of positions where corresponding Unicode code points differ.
     - Errors: throw TypeError if either argument is not a string. Throw RangeError if strings are of different lengths.

   - hammingDistanceBits(x, y)
     - Parameters: a non-negative integer x, a non-negative integer y.
     - Returns: integer count of differing bits in the binary representations of x and y.
     - Errors: throw TypeError if either argument is not a number or not an integer. Throw RangeError if either integer is negative.

3. Behavior and validation details

   - Unicode handling: Strings must be compared by Unicode code points (not UTF-16 code units). Implement using iteration that decodes code points (for example, using iteration over the string or codePointAt and advancing by the code point length) so surrogate pairs are treated as single characters.
   - Empty strings are valid and have Hamming distance 0 when both are empty.
   - For integers, treat values as natural numbers. Zero is valid. Large integers should be handled within JavaScript Number safe-integer limits; validate that inputs are integers and not NaN or Infinity.
   - For bitwise comparison, compute the XOR of the two integers and count set bits of the result using an efficient algorithm (e.g., Kernighan's bit counting loop) suitable for 32-bit and larger safe integers.

4. Error types and messages

   - TypeError messages should clearly state the expected types, e.g., expected strings for hammingDistance or expected non-negative integers for hammingDistanceBits.
   - RangeError messages should explain why the inputs are invalid, e.g., unequal string lengths or negative integers.

5. Exports and file locations

   - Export both functions as named exports from src/lib/main.js.
   - Add or maintain tests in tests/unit that validate the functionality and error cases.
   - Update README.md to include API documentation and usage examples referring to these exported functions.

## Examples

- Example usage demonstrating expected results and error behaviour:

  - Calling hammingDistance("karolin", "kathrin") returns 3.
  - Calling hammingDistance("", "") returns 0.
  - Calling hammingDistance("a", "bb") throws RangeError due to unequal lengths.
  - Calling hammingDistanceBits(1, 4) returns 2.
  - Calling hammingDistanceBits(0, 0) returns 0.

## Acceptance Criteria

The feature is complete when all of the following are true:

- hammingDistance is exported as a named export from src/lib/main.js and behaves as specified.
- hammingDistanceBits is exported as a named export from src/lib/main.js and behaves as specified.
- Unicode strings are compared by code points, not UTF-16 code units.
- Input validation is in place with appropriate TypeError and RangeError throws as described.
- Unit tests cover normal cases, edge cases (empty strings, zero, large integers within Number safe range), and error cases.
- README documents usage and examples for both functions.
- Tests asserting the following pass:
  - hammingDistance("karolin", "kathrin") returns 3
  - hammingDistance("", "") returns 0
  - hammingDistance("a", "bb") throws RangeError
  - hammingDistanceBits(1, 4) returns 2
  - hammingDistanceBits(0, 0) returns 0

## Implementation notes

- All logic should fit in src/lib/main.js as a focused library module to keep the feature self-contained.
- Prefer straightforward, well-tested algorithms over micro-optimizations; use Kernighan's bit counting loop for clarity and efficiency.
- Keep error messages consistent and helpful to developers and tests.

## Tests and docs to add or update

- tests/unit/main.test.js should include thorough unit tests mapping to the acceptance criteria.
- README.md should be updated with a short API section showing function names, parameter expectations, return values, and the examples listed above.

## Related considerations

- Do not introduce new dependencies for the core feature; rely on standard JavaScript capabilities only.
- Ensure compatibility with Node.js version constraints defined in package.json.

