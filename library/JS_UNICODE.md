TABLE OF CONTENTS

- JavaScript Unicode fundamentals
- String code points vs UTF-16 code units
- APIs: String.prototype.codePointAt, String.prototype.normalize, iteration
- Practical patterns for Hamming distance over strings
- Normalization forms and effects
- Edge cases and validation
- References and crawl digest


JAVASCRIPT UNICODE FUNDAMENTALS

- JavaScript strings are sequences of UTF-16 code units; characters outside the Basic Multilingual Plane are represented by surrogate pairs (two code units).
- Many operations (string indexing, length) operate on UTF-16 code units; this can miscount characters for astral symbols and surrogate pairs.

STRING CODE POINTS VS UTF-16 CODE UNITS

- string.length returns the number of UTF-16 code units, not code points.
- To iterate or split a string by Unicode code points use for..of, Array.from(string), or spread [...string]; each yields strings representing single Unicode code points (not code units).

APIS & BEHAVIOUR

String.prototype.codePointAt(pos)
- Signature: codePointAt(pos: number) -> number | undefined
- pos indexes UTF-16 code units; when a surrogate pair starts at pos, the returned number is the full code point value (>= 0x10000). Returns undefined for out-of-range pos.

String.prototype.normalize(form?)
- Signature: normalize(form?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD') -> string
- Default form is 'NFC'.
- Normalization produces a canonical composed or decomposed form; use to ensure canonically-equivalent sequences compare equal.
- Invalid normalization form parameter throws RangeError.

Iteration and conversion
- for (const ch of s) { /* ch is a string containing one code point */ }
- Array.from(s) produces an array of code-point strings. Use these when counting characters or comparing positions.

PRACTICAL PATTERNS FOR HAMMING DISTANCE

- Normalize both input strings to NFC (or a chosen form) to avoid false mismatches caused by different combining sequences.
- Use Array.from(s.normalize('NFC')) to obtain arrays whose indices correspond to Unicode code points; compare element-wise.
- Do not rely on string.length or indexing s[i] for Unicode-correct position handling.

EDGE CASES

- Grapheme clusters (user-perceived characters) may include multiple code points (e.g., a base character plus combining marks). Hamming distance defined on code points will count differences at code-point granularity, not grapheme-granularity. If grapheme-aware comparison is required, use a grapheme segmentation library (Intl.Segmenter or third-party library) and compute distances over segments.

REFERENCES AND CRAWL DIGEST

Sources used (retrieved 2026-03-18):
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt  (retrieved 2026-03-18; bytes downloaded: 167129)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize  (retrieved 2026-03-18; bytes downloaded: 171989)

Attribution: MDN pages cited above for API semantics, return values, and normalization behavior.
