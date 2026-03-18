MDN_BIGINT

Table of contents
- Overview
- Syntax and creation
- Operators relevant to Hamming-distance (bitwise usage)
- Interoperability and type rules
- Algorithms for counting set bits (BigInt)
- Edge cases and errors
- Supplementary details
- Reference (API signatures)
- Digest and retrieval metadata
- Attribution

Overview
BigInt is a JavaScript primitive for arbitrary-precision integers. Use BigInt when integer values may exceed 2^53-1 or when exact integer bitwise semantics are required across wide ranges.

Syntax and creation
- Literal form: integer-literal followed by n (example: 42n)
- Constructor form: BigInt(value) where value is a String or Number or BigInt; BigInt('123') -> 123n; BigInt(123) -> 123n
- Result type: BigInt

Operators relevant to Hamming-distance (bitwise usage)
- BigInt supports bitwise operators with BigInt operands: &, |, ^, ~, <<, >>. Each operator takes BigInt and returns BigInt.
- XOR semantics: a ^ b produces a BigInt with bits set where a and b differ; use XOR to produce the mask of differing bits between two integers.
- Shifts: left and right shifts operate on BigInt operands and return BigInt; shift amounts should be BigInt-compatible.

Interoperability and type rules
- BigInt and Number are distinct types; combining them with arithmetic/bitwise operators throws TypeError. Convert explicitly: BigInt(42) or Number(42n).
- Negative BigInts are supported, but for Hamming distance the mission restricts to non-negative integers; validate inputs and throw RangeError for negative values.

Algorithms for counting set bits (BigInt)
- XOR then count set bits in the result X = A ^ B.
- Kernighan (bit-clear) algorithm (recommended for memory):
  1. count = 0
  2. while X != 0n: X = X & (X - 1n); count++
  3. return count
- Alternative (string-based): convert X to binary string: bin = X.toString(2); count = number of '1' characters in bin. Simpler but allocates a string of length bit-length(X).
- Both produce a JavaScript Number for the count; for extremely large bit counts the count can exceed Number.MAX_SAFE_INTEGER only if operating on integers with more than ~2^53 set bits which is unrealistic for typical inputs.

Edge cases and errors
- BigInt('not-a-number') throws SyntaxError on conversion. BigInt(1.5) is invalid (fractional numbers cannot be converted without explicit truncation) — prefer supplying integer inputs or validating with Number.isInteger before conversion.
- Mixing BigInt and Number operands in bitwise/arithmetic operators throws TypeError.
- For Hamming-distance functions: require non-negative integers and throw RangeError if negative; throw TypeError if inputs are not integers or BigInts.

Supplementary details
- Performance: Kernighan algorithm performs a loop proportional to the number of set bits. Using binary-string counting costs O(bit_length) memory/time but can be simpler and faster for dense masks.
- Use BigInt for correctness across >32-bit ranges; built-in 32-bit bitwise operators on Number coerce operands to 32-bit signed integers and lose high bits.

Reference (API signatures)
- BigInt(value) -> BigInt
  - value: string | number | BigInt
  - returns: BigInt representing the integer value
- Literal: <digits>n (e.g., 0n, 1n, 42n)
- Bitwise XOR: (BigInt) ^ (BigInt) -> BigInt
- Bitwise AND: (BigInt) & (BigInt) -> BigInt
- Bitwise OR: (BigInt) | (BigInt) -> BigInt
- Shift right: (BigInt) >> (BigInt) -> BigInt

Digest and retrieval metadata
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
- Retrieved: 2026-03-18T21:45:18.698Z
- Bytes downloaded during crawl: 171537 bytes

Attribution
Content derived from MDN Web Docs (BigInt) — canonical JavaScript reference on BigInt semantics and operators.
