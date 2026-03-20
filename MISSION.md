# Mission

A JavaScript library for computing Hamming distances — between equal-length strings (character positions that differ) and between non-negative integers (differing bits).

## Required Capabilities

- Compute the Hamming distance between two strings of equal length.
- Compute the Hamming distance between two non-negative integers by counting differing bits.
- Handle Unicode strings correctly (compare code points, not UTF-16 code units).
- Validate inputs: throw `TypeError` for non-string/non-integer arguments, `RangeError` for unequal-length strings or negative integers.

## Requirements

- Export all public API as named exports from `src/lib/main.js`.
- Comprehensive unit tests covering normal cases, edge cases (empty strings, zero, large integers), and error cases.
- README with usage examples and API documentation.

## Acceptance Criteria

- [x] Hamming distance between `"karolin"` and `"kathrin"` is `3`
- [x] Hamming distance between `""` and `""` is `0`
- [x] Hamming distance between strings of different lengths throws `RangeError`
- [x] Bit-level Hamming distance between `1` and `4` is `2` (binary: 001 vs 100)
- [x] Bit-level Hamming distance between `0` and `0` is `0`
- [ ] All unit tests pass
- [x] README documents usage with examples
