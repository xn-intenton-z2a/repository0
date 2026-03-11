BITWISE_OPERATORS

TABLE OF CONTENTS
1. Normalised Extract
  1.1 JS operand conversion and widths
  1.2 Operator semantics (XOR, AND, OR, NOT, shifts)
  1.3 Shift count masking rules
2. Supplementary Details
  2.1 Negative numbers and unsigned conversions
  2.2 Implications for Hamming implementations in JS
3. Reference Details (spec-level behaviors, exact transformations)
4. Detailed Digest and Provenance
5. Attribution and Crawl Data

1. NORMALISED EXTRACT

1.1 JS operand conversion and widths
- JavaScript bitwise operators operate on 32-bit integer values. Operands are converted using ToInt32 (except where ToUint32 is specified), computation happens on 32-bit integer representations, and the result is a 32-bit signed integer converted back to Number.

1.2 Operator semantics
- Bitwise XOR (^): ToInt32(a) ^ ToInt32(b) -> 32-bit signed integer result. Use for difference masks prior to popcount.
- Bitwise AND (&), OR (|), NOT (~): operate on 32-bit two's-complement integers with standard binary semantics.
- Left shift (<<): ToInt32((ToUint32(lhs) << (rhs & 0x1F))). High-order bits discarded.
- Signed right shift (>>): sign-propagating right shift on ToInt32(lhs) by (rhs & 0x1F).
- Unsigned right shift (>>>): ToUint32(lhs) >>> (rhs & 0x1F), fills high bits with zeros and returns an unsigned 32-bit result converted to Number.

1.3 Shift count masking rules
- Effective shift count is ToUint32(rhs) & 0x1F (i.e., rhs & 0x1F). Shift counts >=32 wrap modulo 32.

2. SUPPLEMENTARY DETAILS

2.1 Negative numbers and unsigned conversions
- Coerce to unsigned 32-bit view using x >>> 0 to avoid sign-extension when treating values as bit patterns for popcount.
- Two's-complement negative values will have high bits set; to compute expected population counts treat values as unsigned via >>> 0.
- BigInt supports bitwise operations but lacks >>>; handle BigInt unsigned semantics manually (masking or chunked processing).

2.2 Implications for Hamming implementations in JS
- For 32-bit Hamming distance: x = x >>> 0; y = y >>> 0; v = (x ^ y) >>> 0; then popcount(v).
- For >32-bit widths use BigInt and implement popcount across chunks or use BigInt-aware algorithms (Wegner, table, or parallel-add emulation).

3. REFERENCE DETAILS

Spec-level conversions and canonical operator forms
- ToInt32(number): ECMAScript ToInt32 abstract operation used by most bitwise operators.
- ToUint32(number): ECMAScript ToUint32 used by unsigned operators and >>>.
- Effective shift: effectiveShift = ToUint32(rhs) & 0x1F.

Operator canonical forms
- a ^ b  => ToInt32(a) ^ ToInt32(b) -> Number
- a >>> b => ToUint32(a) >>> (ToUint32(b) & 0x1F) -> Number (unsigned 32-bit result)

Utility idioms
- unsigned32 = value >>> 0
- signed32   = value | 0

4. DETAILED DIGEST AND PROVENANCE
Source: MDN Web Docs — Bitwise operators
URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
Retrieved: 2026-03-11T21:26:25.652Z
Extracted: operand conversion rules, operator semantics for ^,&,|,~,<<,>>,>>>; shift count masking behavior; idioms for unsigned coercion.

5. ATTRIBUTION AND CRAWL DATA
Source: MDN Web Docs. Crawl returned page content (full). Approximate retrieved content: ~4 KB (page text).