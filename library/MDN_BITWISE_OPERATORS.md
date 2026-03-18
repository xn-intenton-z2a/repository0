MDN_BITWISE_OPERATORS

Table of contents
1. Operators list and semantics
2. ToInt32 / ToUint32 conversion notes
3. Behavioural caveats in JavaScript Numbers
4. BigInt differences
5. Reference details and operator signatures
6. Digest and attribution

Normalised extract
Operators and semantics (Numbers):
- AND: a & b  -> bitwise AND of 32-bit integers after ToInt32 conversion.
- OR: a | b   -> bitwise OR of 32-bit integers.
- XOR: a ^ b  -> bitwise XOR of 32-bit integers.
- NOT: ~a     -> bitwise NOT; result equals -(a + 1) for signed 32-bit representation.
- Left shift: a << b  -> left shift on 32-bit signed integers; lower 5 bits of shift count used.
- Signed right shift: a >> b -> sign-propagating right shift of 32-bit signed integer.
- Unsigned right shift: a >>> b -> zero-fill right shift; result is treated as unsigned 32-bit value.

ToInt32 / ToUint32 conversion notes:
- All standard bitwise operators on Number operands convert operands to 32-bit integers (ToInt32) before the operation; this truncates values above 32 bits and may change sign.
- For unsigned operations like >>>, ToUint32 is used for final result interpretation.
- Therefore for integer Hamming-distance implementations do not rely on Number's ^ when values exceed 32 bits.

Behavioural caveats in JavaScript Numbers:
- Number is a double-precision float; bitwise operators coerce to 32-bit ints first.
- For values above 2^31-1 or negative values, bitwise results reflect the 32-bit representation and higher bits are lost.
- For reliable bitwise operations on large integers, use BigInt.

BigInt differences:
- BigInt operands support similar bitwise operators (&, |, ^, ~, <<, >>) but both operands must be BigInt; mixing BigInt and Number throws TypeError.
- BigInt preserves arbitrary width and therefore is appropriate when counting differing bits for large integers.

Reference details (operator signatures / exact effects):
- a & b: both operands converted via ToInt32(a) & ToInt32(b) -> returns a signed 32-bit Number value.
- a ^ b: same conversion; use with caution for values outside 32-bit.
- ~a: returns ~ToInt32(a) which equals -(ToInt32(a) + 1).
- a >>> b: treat result as unsigned 32-bit value.

Digest (retrieved: 2026-03-18)
- Extracted: operator list, ToInt32 conversion behaviour, and the critical note that Number bitwise operators truncate to 32 bits; BigInt should be used for arbitrary-width bit operations.
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
- Bytes retrieved: 238419
