NORMALISED EXTRACT

This document extracts the technical behaviour of the JavaScript static method BigInt.asUintN(width, bigint) from the MDN reference and the ECMAScript specification and presents the exact operational steps, conversion rules, examples, implementation notes and the authoritative spec pseudocode needed for implementation.

Table of contents
- Function signature
- Parameter conversions (ToIndex, ToBigInt) and exceptions
- Operational algorithm (exact steps)
- Return values and range
- Related API: BigInt.asIntN (signed interpretation)
- Examples
- Implementation notes and best practices
- Reference details (ECMAScript steps)
- Detailed digest (retrieval date and bytes)
- Attribution and crawl size

Function signature
BigInt.asUintN(width, bigint)
- Static method on the BigInt constructor.
- Returns a BigInt representing the unsigned value formed by taking the low-order width bits of bigint.

Parameter conversions
- width is converted using ToIndex(width) (ECMAScript conversion):
  - ToIndex coerces width to an integer index value >= 0. If width is negative, not finite, or not representable as a non-negative integer index, ToIndex throws a RangeError.
  - Practically: width must be a non-negative integer (Number, BigInt or other convertible value); negative or non-finite widths are disallowed.
- bigint is converted using ToBigInt(bigint):
  - ToBigInt converts primitive values to BigInt. If the argument cannot be converted to a BigInt (for example a non-integer Number when conversion is ambiguous), a TypeError is thrown by the conversion.

Operational algorithm (exact steps)
1. Let intWidth be ? ToIndex(width).
2. Let bigIntValue be ? ToBigInt(bigint).
3. Let twoToWidth be 2n ** BigInt(intWidth).
4. Let result be bigIntValue modulo twoToWidth (result = bigIntValue % twoToWidth).
5. If result < 0 then result = result + twoToWidth.
6. Return result.

Notes on step semantics
- The modulo operation yields a value in the mathematical range -(2**width - 1) .. (2**width - 1). The following adjustment ensures the returned value is in the unsigned range 0 .. 2**width - 1.
- All arithmetic is BigInt arithmetic (use BigInt literals 0n, 1n, etc.).
- The method always returns a non-negative BigInt in the inclusive range [0, 2**width - 1].

Return values and range
- Return type: BigInt.
- Returned value is always 0n <= result <= (2n ** BigInt(width)) - 1n.
- For width === 0 the returned result is 0n (since twoToWidth == 1n and any bigint modulo 1n yields 0n).

Related API: BigInt.asIntN(width, bigint)
- BigInt.asIntN performs a signed interpretation of the low width bits using two's-complement representation.
- Equivalent algorithm (summary):
  - int = bigint modulo 2**width
  - if int >= 2**(width-1) then return int - 2**width else return int
- Use asIntN when a signed width-limited integer is required; use asUintN to interpret low bits as an unsigned value.

Examples
- BigInt.asUintN(3, 7n) => 7n  (7 in binary: 111, low 3 bits -> 111 => 7)
- BigInt.asUintN(3, -1n) => 7n  (-1 modulo 8 is 7)
- BigInt.asUintN(0, 123n) => 0n  (width 0 truncates to zero)
- Mixing numeric types: BigInt.asUintN(8, BigInt(255)) => 255n

Implementation notes and best practices
- Use explicit BigInt literals and operations: twoToWidth = 1n << BigInt(intWidth) is efficient and avoids floating arithmetic.
- Avoid using Number for bit-width arithmetic when width may exceed Number.MAX_SAFE_INTEGER; ToIndex typically constrains width to a safe integer index, but operations should still use BigInt arithmetic for correctness.
- For truncation you can implement result = (bigIntValue & (twoToWidth - 1n)) where & is BigInt bitwise-and; however using modulo as in the spec is simpler and language-portable.
- When implementing hammingDistance on integers, after computing xor = a ^ b (BigInt-aware), call BigInt.asUintN(bitWidth, xor) only if you need to bound the result; generally computing popcount on xor is sufficient and does not require asUintN.
- For performance-critical code consider fast-popcount implementations (table lookup, WebAssembly) when the integer widths are large; for BigInt use Kernighan's loop with BigInt arithmetic: while (x !== 0n) { x &= x - 1n; count++; }

Reference details (ECMAScript pseudocode)
- Pseudocode taken from the ECMAScript abstract operations used by the language:
  - Let intWidth be ? ToIndex(width).
  - Let bigIntValue be ? ToBigInt(bigint).
  - Let twoToWidth be 2n ** BigInt(intWidth).
  - Let result be bigIntValue modulo twoToWidth.
  - If result < 0 then result = result + twoToWidth.
  - Return result.

Exceptions and edge-cases
- RangeError: thrown by ToIndex when width is negative, not an integer index, or otherwise out of allowed range.
- TypeError: thrown by ToBigInt when the bigint argument cannot be converted to a BigInt.
- Width 0: valid and returns 0n for all inputs.

Detailed digest
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt/asUintN
- Retrieval date: 2026-03-18
- Raw bytes downloaded during crawl: 155447
- Extracted sections used: method signature, parameter conversion notes, operational steps, examples, and implementation hints.

Attribution
- Source: MDN Web Docs (MDN) — BigInt.asUintN()
- Crawl size: 155447 bytes (raw HTML retrieved via curl)

