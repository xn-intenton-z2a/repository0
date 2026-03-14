NORMALISED EXTRACT
Definition and semantics
String.prototype.codePointAt(pos) returns an integer code point value at the given position in a string, interpreting UTF-16 surrogate pairs when necessary. If pos is out of range, it returns undefined.

Table of contents
1. Method signature and return
2. Surrogate-pair handling rules
3. Edge cases and numeric ranges
4. JavaScript usage patterns and examples (signature-level)

Detailed information
1. Method signature
- Signature: String.prototype.codePointAt(position)
- Parameter: position (Number) — coerced to integer; defaults to 0 when omitted in usage patterns.
- Return: integer code point (0..0x10FFFF) or undefined if position is outside [0, length-1] when measured in UTF-16 code units.

2. Surrogate-pair handling
- If the code unit at position is a high surrogate (0xD800..0xDBFF) and it is followed by a low surrogate (0xDC00..0xDFFF), codePointAt returns the combined code point: 0x10000 + ((high - 0xD800) << 10) + (low - 0xDC00).
- If a low surrogate appears without a preceding high surrogate at the examined index, the returned value is the numeric value of the low surrogate code unit.

3. Edge cases and coercion
- position is coerced via ToInteger; negative values behave as out-of-range and yield undefined.
- The returned number is a finite integer; callers should test for undefined before using the value.

4. Usage patterns
- To iterate Unicode code points by index, use while loop and advance by 1 for BMP code points, by 2 when a surrogate-pair was found (or use string iterator or codePointAt-based logic to compute the next index).
- For safe character-level operations prefer String.prototype[Symbol.iterator] or Array.from(str) to operate on user-perceived characters rather than UTF-16 code units.

SUPPLEMENTARY DETAILS
- Useful for decoding UTF-16 sequences and for implementing custom iterators or index arithmetic over Unicode strings.

REFERENCE DETAILS
- Exact method name and signature: String.prototype.codePointAt(pos) -> (number | undefined)
- Returns combined code point calculation formula for surrogate pairs shown above.

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
Retrieved: 2026-03-14
Extracted content: method signature, surrogate pair combination formula, behavior on out-of-range indices and coercion rules. Data size retrieved: ~162.6 KB.

ATTRIBUTION
Content derived from MDN Web Docs (Mozilla); crawl size ~162.6 KB.