# Usage Report

This short report demonstrates the library's API and example outputs.

Examples (see `docs/examples/hamming-example.txt` for plain-text outputs):

- `hammingDistance('karolin', 'kathrin')` → `3`
- `hammingDistance('', '')` → `0`
- `hammingDistance('a😊', 'a😃')` → `1` (Unicode code point aware)

- `hammingDistanceBits(1, 4)` → `2`
- `hammingDistanceBits(0, 0)` → `0`
- `hammingDistanceBits(1n, 4n)` → `2` (BigInt support)

The functions return plain JavaScript numbers and throw clear exceptions for invalid input types and ranges, making them simple to use in pipelines and for evidence capture.