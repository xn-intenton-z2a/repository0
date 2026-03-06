# Hamming utilities — usage report

This short report demonstrates using the hamming utilities added to the library.

Examples:

- Strings (code-point aware): `hammingDistance('karolin', 'kathrin')` returns `3`.
- Binary numbers: `hammingDistanceBits(0, 15)` returns `4` (four 1-bits in 15).

Implementation notes:
- Strings are compared by Unicode code points using `Array.from(str)` to avoid UTF-16 surrogate pair issues.
- Numbers are treated as unsigned 32-bit integers; BigInt support is provided and mixing Number with BigInt coerces the Number into a BigInt via `BigInt(n >>> 0)`.

Evidence files are available under `docs/evidence/` and example outputs under `docs/examples/`.
