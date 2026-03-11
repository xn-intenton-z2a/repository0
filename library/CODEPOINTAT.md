CODEPOINTAT

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Signature and return semantics
  1.2 Surrogate-pair behaviour
  1.3 Index conversion rules
2. Supplementary Details
  2.1 Iteration recommendations
  2.2 Edge-cases and interoperability
3. Reference Details (API signature, parameters, return types)
4. Detailed Digest and Provenance
5. Attribution and Crawl Data

1. NORMALISED EXTRACT

1.1 Signature and return semantics
Method: String.prototype.codePointAt(index)
- Input: index — converted to integer; undefined converted to 0.
- Return: a non-negative integer representing the Unicode code point at the specified index, or undefined if index is out of range.

1.2 Surrogate-pair behaviour
- If the UTF-16 code unit at index is a leading surrogate (high surrogate) and followed by a trailing surrogate, codePointAt returns the combined code point of the pair (value in range 0..0x10FFFF).
- If the code unit at index is a trailing surrogate (low surrogate), codePointAt returns the trailing surrogate's code unit value (0..0xFFFF) — it does not backtrack to the preceding high surrogate.

1.3 Index conversion rules
- index is first coerced to integer per ECMAScript number-to-integer conversions; indices outside 0..str.length-1 yield undefined.
- Use codePointAt(0) on elements produced by string iteration (for..of or Array.from) to get numeric code points for each yielded code-point string.

2. SUPPLEMENTARY DETAILS

2.1 Iteration recommendations
- Avoid looping by numeric indices when dealing with Unicode code points because surrogate pairs span two code units and will be visited twice; instead use for...of or Array.from to iterate by code points and then call codePointAt(0) on each element if numeric value required.

2.2 Edge-cases and interoperability
- For grapheme-cluster aware processing (user-perceived characters), codePointAt is insufficient because combining marks and ZWJ sequences are split; use Intl.Segmenter or a grapheme segmentation library to obtain grapheme clusters.
- codePointAt does not perform normalization; comparisons of code points across normalized/unnormalized strings require explicit normalization (String.prototype.normalize).

3. REFERENCE DETAILS (API signature, parameters, return types)

ECMAScript canonical signature:
- String.prototype.codePointAt(index: number | value-convertible) -> number | undefined

Parameter behavior:
- index: ToInteger(index) as per ECMAScript; undefined -> 0.

Return behavior:
- Returns a non-negative integer (0..1114111) if index references a code point (single or surrogate pair).
- Returns undefined when index < 0 or index >= str.length.

4. DETAILED DIGEST AND PROVENANCE
Source: MDN Web Docs — String.prototype.codePointAt
URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
Retrieved: 2026-03-11
Extracted: syntax, parameters, return value, description, usage notes, recommendations to use for...of or spread for iteration.

5. ATTRIBUTION AND CRAWL DATA
Source: MDN Web Docs, last modified Jul 10, 2025 (MDN metadata). Crawl retrieved ~3KB of page content; fetch returned full page content within max_length constraints.
