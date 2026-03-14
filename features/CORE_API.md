# CORE_API

Overview

The core Hamming library API: two small, well-documented functions exported as named exports from src/lib/main.js. This feature defines signatures, expected behaviour, and the acceptance criteria required by the mission.

Deliverables

- Named exports from src/lib/main.js: hammingDistanceStrings and hammingDistanceBits.
- Behaviour: strings compared by code point; integers compared by bits; input validation and error classes as specified in the mission.
- README usage examples and unit tests added under tests/unit/ to verify each acceptance criterion.

API

- hammingDistanceStrings(a, b)
  - Inputs: two strings.
  - Returns: non-negative integer equal to the number of code points that differ between the two strings.
  - Errors: TypeError if either argument is not a string; RangeError if strings have different code point lengths.

- hammingDistanceBits(a, b)
  - Inputs: two non-negative integers.
  - Returns: non-negative integer equal to the number of differing bits between a and b.
  - Errors: TypeError if either argument is not a number or not an integer; RangeError if either integer is negative.

Acceptance Criteria

- Hamming distance between karolin and kathrin is 3.
- Hamming distance between empty string and empty string is 0.
- Hamming distance between strings of different lengths throws RangeError.
- Bit-level Hamming distance between 1 and 4 is 2.
- Bit-level Hamming distance between 0 and 0 is 0.
- All public API items are exported as named exports from src/lib/main.js.
- README contains example calls demonstrating both functions and expected outputs.

Notes

Keep functions small and purely functional to make unit testing straightforward. Prefer standard, widely-supported JS techniques for code point iteration to ensure compatibility with Node 24 and modern browsers.