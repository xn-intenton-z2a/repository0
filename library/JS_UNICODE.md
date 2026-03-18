TABLE OF CONTENTS

- JavaScript Unicode fundamentals
- String code points vs UTF-16 code units
- APIs: String.prototype.codePointAt, String.prototype.normalize, iteration, Array.from, String.fromCodePoint
- Grapheme cluster segmentation (Unicode TR29)
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

Array.from (string -> code points)
- Signature: Array.from(arrayLike, mapFn?: function, thisArg?: any) -> Array
- When arrayLike is a string, Array.from uses the string's @@iterator to obtain elements; the iterator yields strings each containing a single Unicode code point as per String iterator semantics. Therefore Array.from(str) produces an array where each element is one code-point string (surrogate pairs kept intact as one element).
- mapFn, if provided, is applied to each element after iteration and before placing into the result array.
- Implementation note: Array.from(s.normalize('NFC')) is a reliable pattern to obtain arrays of code points for comparison.

String.fromCodePoint
- Signature: fromCodePoint(...codePoints: number) -> string
- Accepts one or more numeric code point values (e.g., 0x1F600) and returns a string constructed from those code points. For code points > 0xFFFF the returned string contains the appropriate surrogate pair sequence.
- Does not accept BigInt as code point arguments; values are Number and must be valid Unicode scalar values (0..0x10FFFF).

Grapheme cluster segmentation (Unicode TR29)

- Purpose: define user-perceived characters (grapheme clusters) and precise rules to determine cluster boundaries across sequences of Unicode code points.
- Key data: uses the Grapheme_Cluster_Break (GCB) property for each code point. Common GCB values: CR, LF, Control, Extend, ZWJ, SpacingMark, Prepend, Regional_Indicator, L, V, T, LV, LVT, etc.
- Boundary rules (high level, exact rule names used in UAX #29):
  - GB1/GB2: start and end of text are boundaries.
  - GB3: Don't break between CR and LF (treat CR+LF as a single cluster boundary exception).
  - GB4/GB5: Break before and after controls, CR, LF (these always form separate clusters).
  - GB9/GB9a: Do not break between a base character and Extend or SpacingMark (combining marks attach to base).
  - GB9b: Do not break between Prepend and the following character.
  - GB11: Handle emoji zwj sequences and extended pictographic sequences when ZWJ appears (ZWJ joins sequences to form single grapheme clusters in specific conditions).
  - GB12/GB13: Regional indicator (RI) pairs form emoji flag sequences (pairing rules for RIs).
- Implementation guidance: for grapheme-aware Hamming distance use a segmentation library or the platform API Intl.Segmenter (if available) with granularity 'grapheme', then compare segments rather than code points.
- Exact reference: Unicode Standard Annex #29, "Unicode Text Segmentation" includes the canonical ordered list of GB rules (GB1..GB999) and algorithm steps to determine boundaries.

PRACTICAL PATTERNS FOR HAMMING DISTANCE

- Normalization: Normalize both inputs to the same form (recommended: NFC) to avoid mismatches from canonically equivalent sequences.
- Code-point granularity: Use Array.from(s.normalize('NFC')) or [...s.normalize('NFC')] to obtain arrays of code-point strings; compare element-by-element for Hamming distance when code-point granularity is required.
- Grapheme granularity: If user-perceived characters are required, use Intl.Segmenter with granularity 'grapheme' or a third-party grapheme segmentation library, then compute Hamming distance over the resulting segments.
- Validation: Ensure inputs are strings; if not, throw TypeError. If strings differ in segment count (code points or graphemes depending on chosen granularity) throw RangeError.

EDGE CASES

- Combining marks: sequences like "e + combining-accent" may be represented as two code points but are canonically equal to a composed single code point; normalizing to NFC removes false mismatches for equivalence purposes.
- Surrogate pairs: characters above U+FFFF must be treated as single code points — use iteration or codePointAt rather than indexing or length checks.
- Zero-length strings: two empty strings normalised are equal and Hamming distance is 0.

REFERENCES AND CRAWL DIGEST

Sources used (retrieved 2026-03-18):
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt  (retrieved 2026-03-18; approx 167.6 KB)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize  (retrieved 2026-03-18; approx 172.0 KB)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from  (retrieved 2026-03-18; approx 167.6 KB)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint  (retrieved 2026-03-18; approx 162.9 KB)
- https://www.unicode.org/reports/tr29/  (UAX #29 Unicode Text Segmentation — retrieved 2026-03-18; approx 152.3 KB)

Attribution: MDN and Unicode Consortium pages above for API signatures, semantics, iterator behaviour, and grapheme segmentation rules.
