MDN_BIGINT

Table of contents
1. Purpose and summary
2. Syntax and creation
3. Arithmetic and bitwise operations
4. Interoperability with Number
5. Implementation patterns for popcount and XOR
6. Reference details
7. Digest and attribution

Normalised extract
Purpose: BigInt provides arbitrary-precision integer arithmetic in JavaScript. Use BigInt when integer values exceed Number.MAX_SAFE_INTEGER or when bitwise operations must preserve bits beyond 32-bit truncation.

Syntax and creation:
- Literal: 123n creates a BigInt with value 123.
- Constructor: BigInt(value) converts a value to BigInt (string or number) when possible.
- Note: BigInt cannot be used with decimals; BigInt(1.2) will throw.

Arithmetic and bitwise operations:
- BigInt supports +, -, *, /, %, **, and bitwise operators &, |, ^, ~, <<, >>, but both operands must be BigInt for each operation.
- Mixing BigInt with Number in an operation throws TypeError; explicit conversion is required.

Interoperability with Number:
- Convert Number to BigInt via BigInt(n) when n is an integer or within safe integer limits. Convert BigInt to Number via Number(big) but beware overflow/precision loss if BigInt exceeds Number.MAX_SAFE_INTEGER.

Implementation patterns for popcount and XOR using BigInt (explicit and actionable):
- Compute XOR: let diff = BigInt(x) ^ BigInt(y); // both operands converted to BigInt
- Count set bits (Kernighan for BigInt): let count = 0; while (diff !== 0n) { diff &= diff - 1n; count++; } return Number(count);
- This pattern avoids 32-bit truncation and supports arbitrarily large integers.

Reference details
- Constructor: BigInt(value) -> bigint
- Example operator: 5n ^ 3n -> 6n
- Throws when mixing types: 1n + 2 -> TypeError

Digest (retrieved: 2026-03-18)
- Extracted: BigInt syntax, requirement that both operands must be BigInt for bitwise ops, and recommended pattern for XOR + popcount using BigInt and Kernighan loop.
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
- Bytes retrieved: 171537
