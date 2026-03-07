BITWISE_OPERATORS

TABLE OF CONTENTS
1. NORMALISED EXTRACT
  1.1 Operators for Number (32-bit integer coercion)
  1.2 Operators for BigInt (arbitrary precision)
  1.3 Differences and incompatibilities (>>> and unary +)
2. SUPPLEMENTARY DETAILS
  2.1 ToInt32 coercion and consequences
  2.2 BigInt bitwise semantics and asInt/asUint helpers
3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)
  3.1 Operator signatures and return types
  3.2 Exact coercion rules (ToInt32) for Number operands
  3.3 Unsupported combinations and TypeError cases
4. TROUBLESHOOTING AND PROCEDURES
  4.1 Debugging unexpected signedness or overflow
  4.2 Converting between BigInt and Number safely
5. SOURCE DIGEST AND RETRIEVAL METADATA
6. ATTRIBUTION

1. NORMALISED EXTRACT

1.1 Operators for Number (32-bit integer coercion)
- Binary bitwise operators on Number operands (&, |, ^) coerce operands to 32-bit signed integers via ToInt32, operate bitwise on the 32-bit representation, and return a Number (still in IEEE-754 but representing the 32-bit signed result).
- Shift operators:
  - << and >> operate on ToInt32(left) and ToUint32(right mod 32) and return Number.
  - >>> is unsigned right shift: treats left as ToUint32(left) then shifts and returns Number (non-negative).

1.2 Operators for BigInt (arbitrary precision)
- BigInt supports bitwise operators &, |, ^, ~ and shifts << and >>; results are BigInt.
- Unsigned right shift >>> is not available for BigInt; unary plus + is not available for BigInt.
- Mixing BigInt with Number in bitwise/arithmetic operators throws TypeError.

1.3 Differences and incompatibilities (>>> and unary +)
- >>> is only defined for Number (32-bit unsigned shift). BigInt lacks >>> because BigInt values are signed arbitrary-precision.
- Unary + cannot be used to coerce BigInt to Number; using +bigint would throw.

2. SUPPLEMENTARY DETAILS

2.1 ToInt32 coercion and consequences
- ToInt32(x) maps Number to signed 32-bit wrap-around; large numbers lose high-order bits when used with bitwise operators. To preserve logical unsigned behavior, use >>>0 to coerce to unsigned 32-bit Number.

2.2 BigInt bitwise semantics and asInt/asUint helpers
- For operations that require fixed-width semantics on BigInt use BigInt.asIntN(width, value) or BigInt.asUintN(width, value) before/after operations to emulate N-bit registers.

3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)

3.1 Operator signatures and return types
- For Numbers: a & b, a | b, a ^ b => Number (result of ToInt32 bitwise operation)
- For BigInt: a & b, a | b, a ^ b => bigint
- Shift: (Number) a << b, a >> b, a >>> b => Number; (BigInt) a << b, a >> b => bigint

3.2 Exact coercion rules (ToInt32) for Number operands
- ToInt32: Take ToNumber(value), convert to 32-bit signed integer via modulo 2^32 and twos-complement mapping. Effectively value | 0 produces ToInt32(value).

3.3 Unsupported combinations and TypeError cases
- Using mixed operands where one operand is BigInt and the other a Number for arithmetic/bitwise operations causes a TypeError; explicit conversion required.

4. TROUBLESHOOTING AND PROCEDURES

4.1 Debugging unexpected signedness or overflow
- If bitwise operations on Number produce negative results, remember Number bitwise ops are signed 32-bit; coerce with >>>0 to view unsigned value.

4.2 Converting between BigInt and Number safely
- To convert BigInt to Number: Number(big) but will lose precision if magnitude > 2^53-1. To convert Number to BigInt: BigInt(number) only valid for integer Numbers; otherwise round or error.

5. SOURCE DIGEST AND RETRIEVAL METADATA
- Source: MDN Bitwise Operators and MDN BigInt pages; retrieved 2026-03-07T20:27:36.378Z. Fetch truncated for long pages.

6. ATTRIBUTION
- Derived from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators and BigInt docs.
