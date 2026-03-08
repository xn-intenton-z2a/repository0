HAMMING_DISTANCE

# Summary

Add a clear, testable feature specification for the Hamming distance library API and behaviour. This feature ensures the library exports two functions, hammingDistance and hammingDistanceBits, with precise input validation, Unicode-aware behaviour, and examples suitable for the README and unit tests.

# Motivation

The repository's mission is to provide a JavaScript library exporting Hamming distance functions. This feature consolidates requirements, acceptance criteria and usage examples so implementers and tests can be created and validated consistently.

# Specification

- Exports
  - Named export hammingDistance(a, b)
  - Named export hammingDistanceBits(x, y)

- Behaviour: hammingDistance(a, b)
  - Accepts two strings a and b.
  - Compares by Unicode code points (not UTF-16 code units).
  - Returns the number of positions where corresponding code points differ.
  - If either argument is not a string, throws TypeError.
  - If strings have different lengths (in code points), throws RangeError.

- Behaviour: hammingDistanceBits(x, y)
  - Accepts two non-negative integers x and y.
  - Returns the number of differing bits in their binary representation (Hamming weight of x XOR y).
  - If either argument is not a number or not an integer, throws TypeError.
  - If either argument is negative, throws RangeError.

- Error types must be the exact built-in errors specified above.

- Examples for README and tests
  - hammingDistance("karolin", "kathrin") -> 3
  - hammingDistance("", "") -> 0
  - hammingDistance("a", "bb") -> throws RangeError
  - hammingDistanceBits(1, 4) -> 2
  - hammingDistanceBits(0, 0) -> 0

# Acceptance Criteria

- The project exports both functions as named exports from src/lib/main.js.
- Unicode strings are compared by code points; tests must cover astral plane characters and combining sequences.
- Input validation uses TypeError for invalid types and RangeError for negative integers or unequal-length strings.
- Unit tests exist under tests/unit/ covering normal, edge and error cases including the examples above.
- README contains API documentation and the examples listed in this spec.
- All unit tests pass when npm test is run.

# Testable Cases (explicit)

1. hammingDistance("karolin", "kathrin") returns 3
2. hammingDistance("", "") returns 0
3. hammingDistance("a", "bb") throws RangeError
4. hammingDistance("𝄞", "𝄢") compares single code point characters and returns expected result
5. hammingDistanceBits(1, 4) returns 2
6. hammingDistanceBits(0, 0) returns 0
7. hammingDistanceBits(-1, 1) throws RangeError
8. hammingDistance(123, "abc") throws TypeError

# Implementation notes

- Use ECMAScript modules and iterate strings with for...of or Array.from to get code points.
- Use Number.isInteger and bitwise XOR with a loop counting set bits (or use built-in popcount when available) for bit distance.
- Keep library API minimal and suitable for inclusion in src/lib/main.js, README and unit tests.

# Files to update when implementing

- src/lib/main.js: implement exports
- tests/unit/main.test.js: unit tests matching Testable Cases
- README.md: add API docs and usage examples

