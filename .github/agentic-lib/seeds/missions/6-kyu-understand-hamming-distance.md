# Mission

A JavaScript library exporting Hamming distance functions.

## Core Functions

- `hammingDistance(a, b)` — compute the Hamming distance between two strings of equal length (number of positions where characters differ). Throw an error if the strings have different lengths.
- `hammingDistanceBits(x, y)` — compute the Hamming distance between two non-negative integers (count the number of differing bits).

## Requirements

- Handle Unicode strings correctly (compare code points, not UTF-16 code units).
- Validate inputs: throw `TypeError` for non-string/non-integer arguments, `RangeError` for unequal-length strings or negative integers.
- Export both functions as named exports from `src/lib/main.js`.
- Comprehensive unit tests covering normal cases, edge cases (empty strings, zero, large integers), and error cases.
- README with usage examples and API documentation.

## Acceptance Criteria

- [ ] `hammingDistance("karolin", "kathrin")` returns `3`
- [ ] `hammingDistance("", "")` returns `0`
- [ ] `hammingDistance("a", "bb")` throws `RangeError`
- [ ] `hammingDistanceBits(1, 4)` returns `2` (binary: 001 vs 100)
- [ ] `hammingDistanceBits(0, 0)` returns `0`
- [ ] All unit tests pass
- [ ] README documents usage with examples
