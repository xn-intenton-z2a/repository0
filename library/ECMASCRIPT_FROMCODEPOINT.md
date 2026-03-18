ECMASCRIPT_FROMCODEPOINT

Normalised extract (key technical points)

- Signature: String.fromCodePoint(...codePoints) -> String.
- Behavior: Accepts zero or more integer code point arguments. For each argument perform range validation: 0 <= cp <= 0x10FFFF and cp is an integer; if invalid, throw RangeError.
- Conversion algorithm: For each valid cp: if cp <= 0xFFFF append the single UTF-16 code unit with that value; otherwise compute cp' = cp - 0x10000; append high surrogate = (cp' >> 10) + 0xD800 and low surrogate = (cp' & 0x3FF) + 0xDC00.
- Return: A String concatenating the resulting code units for all code points in argument order.

Table of contents

1. Signature and parameters
2. Argument coercion and validation
3. Surrogate pair emission algorithm
4. Exceptions and error cases
5. Implementation notes

Detailed technical content

1. Signature and parameters
- String.fromCodePoint(...codePoints) where each codePoints[i] is processed in order.
- No 'this' binding; it is a static factory method on String.

2. Argument coercion and validation
- Each argument is converted to Number then ToIntegerOrInfinity (spec enforces integerness for the range check).
- If an argument is not an integer or not in the inclusive range 0..0x10FFFF, throw RangeError.

3. Surrogate pair emission algorithm
- For cp in 0..0xFFFF: append code unit cp as-is.
- For cp in 0x10000..0x10FFFF: compute cp' = cp - 0x10000; high = (cp' >> 10) + 0xD800; low = (cp' & 0x3FF) + 0xDC00; append high then low.

4. Exceptions and error cases
- RangeError thrown when any argument falls outside 0..0x10FFFF or is not an integer representable as a code point.
- No TypeError from the method itself; invalid inputs are handled by the RangeError rule above.

5. Implementation notes
- For performance, pre-validate all code points before constructing the string to fail-fast.
- Use BigInt-free arithmetic; codepoint math fits within Number safe integer range (0..0x10FFFF).

Reference details (spec-level)

- Method: String.fromCodePoint(...codePoints) -> String
- Parameter types: Number (converted/checked as integer code points)
- Throws: RangeError on out-of-range values

Detailed digest

- Source: https://262.ecma-international.org/13.0/#sec-string.fromcodepoint
- Retrieved: 2026-03-18
- Bytes fetched during crawl: 7181011 bytes
- Extracted: exact validation and surrogate-emission algorithm and exception conditions.

Attribution

- ECMAScript 2022 (ECMA-262) — Section: String.fromCodePoint
- URL: https://262.ecma-international.org/13.0/#sec-string.fromcodepoint
- Data retrieved on 2026-03-18; raw HTML saved for auditing.
