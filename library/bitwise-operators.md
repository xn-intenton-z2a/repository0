Title: Bitwise Operators (JavaScript)

Summary

JavaScript bitwise operators operate on 32‑bit integer representations of Numbers (signed 32‑bit two's complement). Operands are coerced to 32‑bit integers, the operation runs, and the result is converted back to a Number.

Operators

- Bitwise AND: &
- Bitwise OR: |
- Bitwise XOR: ^
- Bitwise NOT: ~
- Left shift: <<
- Signed right shift: >> (preserves sign)
- Unsigned right shift: >>> (fills with zeros)

Key behaviors

- Because of ToInt32 coercion, large unsigned values (>= 2^31) may be interpreted as negative when used with signed operations.
- Use >>> 0 to convert a Number to an unsigned 32‑bit representation: (n >>> 0).

Use cases

- Low‑level bit hacks (masks, shifts, packing/unpacking), flags, and efficient 32‑bit integer arithmetic.

Caveats

- Bitwise ops coerce to Number then to Int32 — floating inputs may lose high precision; do not rely on them for 53‑bit integer arithmetic.

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
