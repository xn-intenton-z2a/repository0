ECMASCRIPT_BIGINT

Normalised extract (key technical points)

- Type: BigInt is an ECMAScript numeric type representing arbitrary precision integers (signed). Values are mathematical integers with no fixed upper bound.
- Creation: BigInt(value) and numeric literal syntax (e.g., 123n) produce BigInt values per spec.
- Operators: Most arithmetic and bitwise operators are defined for BigInt operands; mixing BigInt and Number with ordinary arithmetic or bitwise operators is disallowed and results in a TypeError in expressions where operands are of mixed types.
- Key APIs: BigInt.asUintN(width, bigint) and BigInt.asIntN(width, bigint) — canonical operations for truncating to a fixed-width unsigned/signed representation.

Table of contents

1. BigInt overview and creation
2. Operator and mixing semantics
3. Fixed-width helpers (asUintN/asIntN)
4. Bitwise and integer algorithms useful for Hamming computations
5. Implementation notes and best practices

Detailed technical content

1. BigInt overview and creation
- BigInt is an integer numeric type; use literal suffix n (e.g., 1n) or the BigInt function/constructor-like call to produce values.
- BigInt has full-precision integer semantics; use for numbers beyond Number.MAX_SAFE_INTEGER when integer arithmetic is required.

2. Operator and mixing semantics
- Spec requires that arithmetic and bitwise operations applied to BigInt operands operate with BigInt semantics.
- Mixing BigInt and Number without explicit conversion is not permitted; implementations throw TypeError for runtime mixed-type binary operations.
- Comparison operators (==, ===) follow usual ECMAScript semantics (=== distinguishes types; == does not coerce BigInt to Number).

3. Fixed-width helpers
- BigInt.asUintN(width, bigint): returns a BigInt representing the low 'width' bits of bigint interpreted as an unsigned integer (i.e., bigint modulo 2^width).
- BigInt.asIntN(width, bigint): returns a BigInt representing the low 'width' bits of bigint interpreted as a two's-complement signed integer.
- Use asUintN/asIntN when you must mask/truncate BigInt values to a fixed-width domain for bitwise algorithms.

4. Bitwise and integer algorithms useful for Hamming computations
- To compute bit-level Hamming distance between two non-negative BigInt values a and b:
  - Compute xor = a ^ b (both operands must be BigInt).
  - Count set bits in xor. Use Kernighan's loop generalized to BigInt: initialize count = 0; while xor != 0n: xor = xor & (xor - 1n); count += 1; return count.
- Alternative: iterate until xor == 0n: count += Number(xor & 1n); xor >>= 1n; this shifts bits out one at a time and converts small counts to Number.
- When working with very large bit widths, prefer Kernighan's loop as it iterates only set bits, not all positions.

5. Implementation notes and best practices
- Always ensure operands are BigInt before applying bitwise or integer arithmetic; coerce with BigInt(x) explicitly, but avoid coercing float Numbers that are non-integers (spec rules may throw).
- Use BigInt.asUintN to restrict values to a known width before bitwise operations when interoperability with fixed-width algorithms is required.
- Avoid converting BigInt to Number for counts until the final result is guaranteed to fit safely in Number; counts can be converted using Number(count) when count is known to be within safe integer range.

Reference details (spec-level)

- BigInt(value) -> BigInt
- BigInt.asUintN(width, bigint) -> BigInt (returns bigint modulo 2^width, unsigned interpretation)
- BigInt.asIntN(width, bigint) -> BigInt (two's-complement signed interpretation of low width bits)
- Operators: arithmetic and bitwise operators are defined for BigInt operands; mixing BigInt and Number in arithmetic/bitwise operators is disallowed.

Detailed digest

- Source: https://262.ecma-international.org/13.0/#sec-bigint-objects
- Retrieved: 2026-03-18
- Bytes fetched during crawl: 7181011 bytes
- Extracted: definition of the BigInt numeric type, creation patterns, asUintN/asIntN helpers, and operator-type mixing rules.

Attribution

- ECMAScript 2022 (ECMA-262) — BigInt object and type sections
- URL: https://262.ecma-international.org/13.0/#sec-bigint-objects
- Data retrieved on 2026-03-18; raw HTML saved for auditing.
