NORMALISED EXTRACT
Definition and semantics
JavaScript bitwise operators operate on 32-bit integer representations of Number values (ToInt32/ToUint32 conversions). Operators: &, |, ^, ~, <<, >>, >>>. All convert operands to 32-bit integers, perform the operation, and return a Number (a 64-bit float whose integer value fits in 32-bit range).

Table of contents
1. Operator list and exact semantics
2. Integer conversion rules (ToInt32/ToUint32)
3. Shift behavior and edge cases
4. Implementation tips and JS patterns

Detailed information
1. Operator list
- Bitwise AND: a & b — bitwise conjunction of ToInt32(a) and ToInt32(b).
- Bitwise OR: a | b — bitwise disjunction.
- Bitwise XOR: a ^ b — bitwise exclusive or.
- Bitwise NOT: ~a — bitwise negation; equivalent to -(ToInt32(a)) - 1.
- Left shift: a << b — shifts ToInt32(a) left by (ToUint32(b) & 0x1F) bits, result truncated to 32 bits.
- Signed right shift: a >> b — arithmetic right shift (sign-propagating) by (ToUint32(b) & 0x1F) bits.
- Unsigned right shift: a >>> b — logical right shift; treats ToUint32(a) and returns zero-filled high bits.

2. Integer conversion rules
- ToInt32 and ToUint32 are defined in ECMAScript: Number is converted by truncation modulo 2^32; floating fractions are removed.
- To coerce a number to unsigned 32-bit explicitly use >>> 0; to coerce to signed 32-bit use | 0.

3. Shift behavior and edge cases
- Shift counts are masked to 5 bits (0..31); shifting by >=32 results in modulo wrap: b & 0x1F.
- Large Numbers outside 32-bit range will be converted via modulo 2^32 before the operation, which can surprise callers.

4. Implementation tips and patterns
- Use >>>0 to obtain unsigned 32-bit representation for bitfield math.
- For 64-bit bitwise work, use BigInt and BigInt bitwise ops (supported in modern JS), or simulate with pair of 32-bit words.
- Beware that ~x yields −(x+1) in signed arithmetic semantics; use unsigned coercion when working with bitflags.

SUPPLEMENTARY DETAILS
- Performance: bitwise ops are implemented as integer operations on most engines; repeated conversions between Number and 32-bit integers cost cycles—use TypedArrays or BigInt for heavy bitwise workloads.

REFERENCE DETAILS
- Exact operator behaviors and conversion steps follow ECMAScript ToInt32/ToUint32 algorithms; apply masks and shifts precisely as specified above.

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
Retrieved: 2026-03-14
Extracted content: operator list, ToInt32/ToUint32 coercion, shift masking rules, recommendations (>>>0), and BigInt alternatives. Data size retrieved: ~238.6 KB.

ATTRIBUTION
Content derived from MDN Web Docs (Mozilla); crawl size ~238.6 KB.