# BigInt support for integer Hamming

This feature file documents the BigInt support added to `hammingDistanceInt`.

- The function accepts Number integers and BigInt values.
- Mixing Number and BigInt inputs is supported (Numbers are coerced to BigInt for bit operations).
- Negative values throw `RangeError`.
- Non-integer Numbers throw `TypeError`.
