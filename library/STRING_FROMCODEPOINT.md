STRING_FROMCODEPOINT

Table of contents
- Purpose
- Syntax
- Parameters
- Return value
- Behavior and edge cases
- Unicode/code point handling notes
- Examples (concise)
- Supplementary details
- Reference details (exact signatures)
- Retrieval
- Attribution and data size

Purpose
Provide the exact technical details needed to implement Unicode-aware code point iteration and conversion that the Hamming string distance routine requires.

Syntax
String.fromCodePoint(...codePoints)

Parameters
...codePoints: sequence of one or more integer code points (Number or BigInt convertible) in the Unicode range 0..0x10FFFF.

Return value
A string made by concatenating the UTF-16 code unit sequence for each code point provided. Surrogate pairs are created for code points > 0xFFFF.

Behavior and edge cases
- Accepts multiple numeric arguments; each argument is a code point.
- Throws RangeError if any code point is outside 0..0x10FFFF or is not a finite number.
- Non-integer numeric values are converted to integers (ToInteger operation); NaN and infinities cause RangeError.
- Handles code points in supplementary planes by returning surrogate pairs in the resulting string.
- Using fromCodePoint is the correct way to produce characters by Unicode code point; avoid String.fromCharCode for code points > 0xFFFF.

Unicode/code point handling notes
- Use fromCodePoint together with String.prototype[@@iterator] or codePointAt to work in terms of Unicode code points instead of UTF-16 code units.
- For Hamming distance on Unicode strings, iterate strings by code points (for...of or spread [...str]) to compare actual code points.

Examples (concise)
- String.fromCodePoint(0x1F600) returns a string containing the grinning face emoji (surrogate pair in UTF-16).

Supplementary details
- Implementation in engines maps codePoints to UTF-16 code units using algorithm: if cp <= 0xFFFF, emit single unit; else subtract 0x10000, high = 0xD800 + (cp >> 10), low = 0xDC00 + (cp & 0x3FF), emit high and low.
- Validate inputs with Number.isFinite and cp >= 0 && cp <= 0x10FFFF before conversion.

Reference details
- Signature: String.fromCodePoint(...codePoints) -> string
- Throws: RangeError for invalid code point values
- Effects: creates surrogate pairs for supplementary code points

Retrieval
Content retrieved from MDN String.fromCodePoint on 2026-03-20.

Attribution and data size
Source: MDN Web Docs — String.fromCodePoint (developer.mozilla.org). HTML crawled (approx 163 KB). Retrieved: 2026-03-20.
