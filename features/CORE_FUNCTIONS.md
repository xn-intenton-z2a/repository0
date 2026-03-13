# CORE_FUNCTIONS

Status: pending

Implement the core Hamming distance functions and export them from src/lib/main.js.

Goal

Provide two named exports:

- `hammingDistance(a, b)` — returns the number of positions with differing Unicode code points between strings `a` and `b`. Throws a RangeError if the strings differ in length and TypeError if inputs are not strings.
- `hammingDistanceBits(x, y)` — returns the Hamming distance between two non-negative integers (population count of x ^ y). Throws TypeError for non-integer inputs and RangeError for negative integers.

Acceptance Criteria

- `import { hammingDistance, hammingDistanceBits } from 'src/lib/main.js'` is possible.
- `hammingDistance("karolin", "kathrin")` returns `3`.
- `hammingDistance("", "")` returns `0`.
- `hammingDistanceBits(1, 4)` returns `2`.
- `hammingDistanceBits(0, 0)` returns `0`.
- Functions validate inputs and throw the specified errors.

Notes

- Iterate strings by Unicode code points (e.g., for-of or Array.from) to avoid surrogate-pair splitting.