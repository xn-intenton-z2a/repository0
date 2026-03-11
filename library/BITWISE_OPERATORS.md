BITWISE_OPERATORS

TABLE OF CONTENTS
1. Normalised Extract
  1.1 JS bitwise operand conversion and widths
  1.2 Operator semantics (XOR, AND, OR, shifts)
  1.3 Shift count masking rules
2. Supplementary Details
  2.1 Interactions with negative numbers and unsigned conversions
  2.2 Implications for Hamming bit implementations in JS
3. Reference Details (spec-level behaviors, exact transformations)
4. Detailed Digest and Provenance
5. Attribution and Crawl Data

1. NORMALISED EXTRACT

1.1 JS bitwise operand conversion and widths
- JavaScript bitwise operators operate on 32-bit integer values. Operands are converted using ToInt32 (for most bitwise operators) or ToUint32 where specified; the engine performs number -> 32-bit integer conversion before bitwise computation, and the result is a 32-bit signed integer which is then converted back to a Number.

1.2 Operator semantics
- Bitwise XOR (^): computes bitwise exclusive-or on 32-bit integer representations; commonly used for computing difference mask prior to popcount.
- Bitwise AND (&), OR (|), NOT (~) operate on 32-bit integers with standard binary semantics.
- Left shift (<<): shifts bits left; high-order bits shifted out are discarded; result is ToInt32( (ToUint32(lhs) << (rhs & 0x1F)) ).
- Signed right shift (>>): sign-propagating right shift; preserves sign bit for negative numbers.
- Unsigned right shift (>>>): zero-fill right shift; converts operands to ToUint32 and shifts, filling high bits with zero.

1.3 Shift count masking rules
- Shift count is masked: only the low-order 5 bits of the right-hand operand are used for 32-bit shift operators (equivalent to rhs & 0x1F) — shift counts >=32 wrap modulo 32.

2. SUPPLEMENTARY DETAILS

2.1 Interactions with negative numbers and unsigned conversions
- To obtain an unsigned 32-bit view of a Number use >>> 0 (x >>> 0). This is commonly used before popcount table lookups to avoid sign-extension when treating the value as an unsigned integer.
- Negative Numbers: bitwise operations operate on two's complement 32-bit encodings. Example: -1 ^ 0 yields -1 (0xFFFFFFFF). When counting set bits treat as unsigned values (convert via >>>0) to get expected population count for the two's complement representation.
- BigInt: JavaScript BigInt supports bitwise operations but not >>>(unsigned right shift). BigInt shifts use arithmetic shift semantics and must be handled separately for unsigned semantics.

2.2 Implications for Hamming bit implementations in JS
- For 32-bit integer Hamming distance: ensure inputs are masked to 32-bit unsigned via x = x >>> 0; then compute v = (x ^ y) >>> 0; compute popcount on v using 32-bit-appropriate algorithm.
- For larger-than-32-bit integers, use BigInt and BigInt-aware popcount implementations (e.g., loop over 64-bit chunks or use Wegner with BigInt operations). Avoid naive use of JS bitwise operators on Number for >32-bit widths.

3. REFERENCE DETAILS (spec-level behaviors, exact transformations)

Spec-level conversions:
- ToInt32(number): return 32-bit signed integer per ECMAScript ToInt32 abstract operation.
- ToUint32(number): return 32-bit unsigned integer per ECMAScript ToUint32 abstract operation.
- Shift masking: effectiveShift = ToUint32(rhs) & 0x1F for 32-bit shifts.

Operator canonical forms:
- a ^ b -> perform ToInt32(a) ^ ToInt32(b) -> 32-bit signed result -> convert to Number
- a >>> b -> perform ToUint32(a) >>> (ToUint32(b) & 0x1F) -> 32-bit unsigned result -> convert to Number

Implementation patterns:
- Unsigned extraction: uint32 = value >>> 0
- Signed extraction: int32 = value | 0

4. DETAILED DIGEST AND PROVENANCE
Source: MDN Web Docs — Bitwise operators
URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
Retrieved: 2026-03-11T20:55:48.165Z
Extracted: operand conversion rules, operator semantics for AND/OR/XOR/NOT/<< / >> / >>>, shift count masking behavior, and guidance on using >>>0 to coerce to unsigned.

5. ATTRIBUTION AND CRAWL DATA
Source: MDN Web Docs, content last modified 2025; crawl retrieved ~4KB (truncated note present). Exact byte count not provided by fetch API.
