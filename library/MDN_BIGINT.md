MDN_BIGINT

Table of Contents
- Overview and purpose
- Literal and constructor forms
- Supported operations and limitations
- Interop with Number and other types
- Supplementary details
- Reference details (API signatures)
- Detailed digest (retrieved: 2026-03-19)
- Attribution and data size

Normalised extract
Overview and purpose
- BigInt is a built-in numeric primitive for arbitrary-precision integers.
- BigInt values are written with an "n" suffix (e.g., 123n) or created with the BigInt(value) constructor.

Literal and constructor forms
- Literal: append "n" to an integer literal: 0n, 1n, 9007199254740993n
- Constructor: BigInt("123") or BigInt(123) — when given a Number, it truncates toward zero; when given a string, it parses decimal/hex/octal/binary prefixes.

Supported operations and limitations
- Arithmetic: +, -, *, **, %, unary -, bitwise shifts (<<, >>), bitwise AND/OR/XOR (~ is supported) operate on BigInt values when both operands are BigInt.
- Mixing BigInt and Number in arithmetic throws TypeError; explicit conversion required (Number(big) or BigInt(number)).
- Math.* functions do not accept BigInt; convert to Number first.
- Relational operators (<, >, <=, >=) work between BigInt and Number by converting Number to BigInt if it is an integer; equality (==) may coerce but strict equality (===) distinguishes types.

Interop with Number and other types
- Use BigInt(value) to convert from string/number; BigInt(3.14) -> 3n (truncates); conversion from floating point is allowed but precise behaviour is truncation.
- Serialization: BigInt cannot be directly JSON.stringify'd; it throws TypeError.

Supplementary details
- Use BigInt to compute Hamming distance for integers larger than Number.MAX_SAFE_INTEGER or when bit-accurate operations are required beyond 53-bit precision.
- For bitwise Hamming distance, use BigInt operators and count set bits on BigInt results.

Reference details
- Constructor: BigInt(value) -> BigInt
- Literal: <integer>n -> BigInt
- Operators: + - * ** % << >> & | ^ ~ (operands must be BigInt)
- Throws TypeError when mixing BigInt and Number in arithmetic without explicit conversion.

Detailed digest
Source: MDN "BigInt"
Retrieved: 2026-03-19
Data obtained: HTML snapshot from MDN (see SOURCES.md)

Attribution
Original source: MDN Web Docs — BigInt

