Title: Bitwise Operators (JavaScript)

Summary

JavaScript bitwise operators operate on 32-bit integer representations of numbers (signed 32-bit two's complement). Operands are converted to 32-bit integers, the operation is performed, and the result is converted back to a JavaScript Number.

Operators

- Bitwise AND: &
- Bitwise OR: |
- Bitwise XOR: ^
- Bitwise NOT: ~
- Left shift: <<
- Signed right shift: >> (preserves sign)
- Unsigned right shift: >>> (fills with zeros)

Key behaviors

- Because of the 32-bit conversion, large (>=2^31) unsigned values may be interpreted as negative when using signed shifts/operations.
- Use >>> 0 to convert a Number to an unsigned 32-bit integer representation.

Use cases

- Implementing low-level bit hacks (masks, shifts, pack/unpack), computing flags and bitfields, efficient integer arithmetic on 32-bit domains.
- Combined with popcount algorithms, bitwise ops allow efficient Hamming weight/distance computations when working with 32-bit chunks.

Caveats

- Bitwise operators coerce to Number and then to Int32 — beware of floating point input and precision loss for 53-bit integers.

Source: MDN: Bitwise Operators (operator list, semantics, shift differences).