ECMASCRIPT_CODEPOINTAT

Normalised extract (key technical points)

- Signature: String.prototype.codePointAt(position) -> integer (0..0x10FFFF) or undefined.
- Input coercions: the receiver is converted to String (ToString), position is converted using ToIntegerOrInfinity.
- Behavior summary: if position < 0 or position >= String.length return undefined. Let first be the UTF-16 code unit value at index position. If first is a high surrogate (0xD800..0xDBFF) and position+1 < length and the code unit at position+1 is a low surrogate (0xDC00..0xDFFF), then return the computed supplementary code point: (first - 0xD800) * 0x400 + (second - 0xDC00) + 0x10000. Otherwise return first.
- Return type: Number (integer in 0..0x10FFFF) or undefined; no exceptions thrown by the abstract operation itself.

Table of contents

1. Signature and types
2. Input coercion
3. Surrogate-pair detection algorithm
4. Return values and numeric ranges
5. Implementation notes and edge cases

Detailed technical content

1. Signature and types
String.prototype.codePointAt(position)
- Parameters: position (converted via ToIntegerOrInfinity). If omitted defaults to 0 via ToIntegerOrInfinity(undefined) -> 0.
- Returns: a Number representing the code point value or undefined when index out of range.

2. Input coercion
- Receiver is ToString(this value).
- Position is ToIntegerOrInfinity(position). Negative positions are treated as out-of-range and return undefined.

3. Surrogate-pair detection algorithm
- Fetch UTF-16 code unit at index position (first).
- If first in [0xD800, 0xDBFF] (high surrogate) AND position+1 < length AND code unit at position+1 (second) in [0xDC00, 0xDFFF] (low surrogate) then
  return ((first - 0xD800) * 0x400) + (second - 0xDC00) + 0x10000.
- Else return first (a BMP code point 0..0xFFFF).

4. Return values and numeric ranges
- Possible return values: 0..0x10FFFF (Number) or undefined.
- No RangeError or TypeError is thrown by this operation on normal inputs; coercion can throw only if ToString or ToIntegerOrInfinity throws on exotic receivers.

5. Implementation notes and edge cases
- Use String[Symbol.iterator] or Array.from(string) when iterating code points rather than indexing with codePointAt for grapheme-aware iteration.
- When comparing characters by code point, iterate by code points (for...of) or use codePointAt on successive indices accounting for surrogate pairs.

Supplementary details

- Surrogate numeric ranges: high surrogate: 0xD800..0xDBFF, low surrogate: 0xDC00..0xDFFF. Supplementary code points (outside BMP) are encoded as a pair and map to values >= 0x10000.
- ToIntegerOrInfinity conversion rules: non-integral numbers are truncated toward zero; NaN -> 0; Infinity stays Infinity (treated as out-of-range).

Reference details (spec-level)

- Method: String.prototype.codePointAt(position)
- Parameter: position (ToIntegerOrInfinity)
- Returns: Number (integer code point) | undefined
- Exact surrogate-to-codepoint formula: codePoint = (high - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000

Detailed digest

- Source: https://262.ecma-international.org/13.0/#sec-string.prototype.codepointat
- Retrieved: 2026-03-18
- Bytes fetched during crawl: 1152021 bytes
- Extracted: algorithm steps for conversion, surrogate detection ranges, return semantics (Number or undefined).

Attribution

- ECMAScript 2022 (ECMA-262) — Section: String.prototype.codePointAt
- URL: https://262.ecma-international.org/13.0/#sec-string.prototype.codepointat
- Data retrieved on 2026-03-18; raw HTML saved for auditing.
