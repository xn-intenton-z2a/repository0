MDN_BIGINT_ASINTN

Table of contents
- Signature
- Parameters
- Return value
- Algorithm (spec-accurate)
- Examples
- Edge cases and validation
- Supplementary details
- Reference and retrieval digest
- Attribution and data size

Normalised extract

Signature
BigInt.asIntN(bits, bigint) -> BigInt

Parameters
- bits: non-negative integer (Number) specifying the result width in bits. In ECMAScript the argument is processed as an integer index (ToIndex), i.e., converted to Number then validated as a non-negative integer in range; negative values or non-finite values throw as specified by ToIndex.
- bigint: value converted to BigInt using ToBigInt (values with a BigInt coercion or BigInt literal, e.g., 3n). Non-coercible values produce a TypeError.

Return value
- A BigInt representing the two's-complement signed integer value of the input 'bigint' truncated to 'bits' bits.

Algorithm (implementation pattern, spec-accurate)
1. Let n be ? ToIndex(bits).
2. Let x be ? ToBigInt(bigint).
3. Let twoToN be 2n ** n (computed as a BigInt exponentiation).
4. Let modResult be x modulo twoToN (same sign convention as BigInt modulo: modResult = x % twoToN, result in range 0 .. twoToN-1).
5. Let twoToNMinus1 be 2n ** (n - 1) (if n is 0, twoToNMinus1 is 0.5 omitted; the check below handles n==0).
6. If modResult >= twoToNMinus1 then return modResult - twoToN; otherwise return modResult.

This matches the ECMAScript definition: compute the unsigned n-bit value (BigInt.asUintN) then if the highest bit (sign bit) is set, subtract 2**n to get the signed two's-complement result.

Examples
- BigInt.asIntN(3, 1n) -> 1n (binary 001)
- BigInt.asIntN(3, 4n) -> -4n (4 mod 8 = 4, sign bit set -> 4 - 8 = -4)
- BigInt.asIntN(0, 1234n) -> 0n (0-bit width produces zero)
- BigInt.asIntN(64, 2n**63) -> -2n**63 (the highest bit becomes sign bit)

Edge cases and validation
- bits is processed using ToIndex: non-integer, negative, or out-of-range values will cause the standard ToIndex behaviour (RangeError for negative or too large). Implementations should follow ToIndex semantics.
- bigint must be convertible to BigInt; passing non-integer Numbers without explicit BigInt conversion is invalid; use BigInt(number) or integer literals with n.
- For bits == 0, result is always 0n.

Supplementary details
- Relationship to BigInt.asUintN: BigInt.asIntN(bits, x) is equivalent to:
  let u = BigInt.asUintN(bits, x);
  let sign = (u & (1n << (bits - 1))) !== 0n;
  return sign ? u - (1n << bits) : u;
- Implementations may use bit-masking: mask = (1n << bits) - 1n; u = x & mask; then adjust for sign.
- Use BigInt.asIntN when you need a fixed-width signed two's-complement interpretation of a BigInt.

Reference details
- ECMAScript specification algorithm: https://262.ecma-international.org/13.0/#sec-bigint.asintn
- MDN reference page: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt/asIntN

Digest
- Source: MDN and ECMAScript spec sections listed above.
- Retrieved: 2026-03-18

Attribution and data size
- Source pages: MDN (BigInt.asIntN) and ECMA-262 spec (BigInt.asIntN). Crawl size: small (single method pages), approx. ~10KB combined.
