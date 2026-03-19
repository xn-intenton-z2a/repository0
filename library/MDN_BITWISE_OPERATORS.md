MDN_BITWISE_OPERATORS

Table of Contents
- Overview
- Operators and semantics
- Operand conversions and integer width
- Unsigned right shift behaviour
- Use with BigInt
- Implementation notes for counting differing bits
- Reference details (operators and effects)
- Detailed digest (retrieved: 2026-03-19)
- Attribution and data size

Normalised extract
Overview
- JavaScript bitwise operators perform operations on 32-bit integers after converting operands to signed 32-bit integers ( ToInt32 ).

Operators and semantics
- AND: a & b — bitwise AND of 32-bit representations.
- OR: a | b — bitwise OR.
- XOR: a ^ b — bitwise XOR.
- NOT: ~a — bitwise NOT (one's complement) on 32-bit value.
- Left shift: a << b — shifts left, low-order bits discarded, fills with zeros on right.
- Signed right shift: a >> b — preserves sign bit.
- Unsigned right shift: a >>> b — shifts zeroes into leftmost bits, result is non-negative 32-bit unsigned value converted back to Number.

Operand conversions and integer width
- Operands are converted using ToInt32 semantics producing a 32-bit signed value; results are 32-bit signed integers (except >>> which yields unsigned 32-bit result represented as Number).
- For values outside 32-bit range, ToInt32 truncates modulo 2^32.

Unsigned right shift behaviour
- >>> interprets operands as unsigned 32-bit values and shifts right, inserting zeros; useful when treating values as bit patterns rather than signed integers.

Use with BigInt
- BigInt supports bitwise operators in ES2020+ context where both operands are BigInt; semantics operate on arbitrary-width integers and do not coerce to 32-bit.
- Mixing BigInt and Number with bitwise operators throws TypeError.

Implementation notes for counting differing bits
- To compute bit-level Hamming distance for Number inputs safely for up to 32-bit values use xor = a ^ b; then count set bits in xor (popcount).
- For values beyond 32 bits, convert to BigInt and use BigInt xor (aBig ^ bBig) then count set bits on BigInt.

Reference details
- Operators: &, |, ^, ~, <<, >>, >>> (Number operands use 32-bit ToInt32 conversion)
- BigInt operators: &, |, ^, ~, <<, >> (operands must be BigInt)

Detailed digest
Source: MDN "Bitwise operators"
Retrieved: 2026-03-19
Data obtained: HTML snapshot from MDN (see SOURCES.md)

Attribution
Original source: MDN Web Docs — Bitwise operators

