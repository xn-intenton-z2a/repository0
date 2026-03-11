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
- Method: String.prototype.codePointAt(index)
- Parameter: index is converted to integer; undefined -> 0.
- Return: non-negative integer 0..0x10FFFF for the code point at index, or undefined if index out of range.

1.2 Surrogate-pair behaviour
- If UTF-16 code unit at index is a high-surrogate and followed by a low-surrogate, returns combined code point (0..0x10FFFF).
- If code unit at index is a low-surrogate, returns the low-surrogate code unit value (0..0xFFFF) and does not backtrack.

1.3 Index conversion rules
- index coerced via ToInteger; indices <0 or >= str.length -> undefined.

2. SUPPLEMENTARY DETAILS

2.1 Iteration recommendations
- Avoid numeric-index loops over strings when needing code points; use for...of or Array.from to iterate by code points and then call codePointAt(0) on each iterated string to get numeric values.

2.2 Edge-cases and interoperability
- codePointAt is not grapheme-cluster aware; combining marks and ZWJ sequences require Intl.Segmenter or a grapheme library when user-perceived characters are needed.
- codePointAt does not normalize strings; explicit String.prototype.normalize is required when comparing across normalization forms.

3. REFERENCE DETAILS

ECMAScript canonical signature
- String.prototype.codePointAt(index: number|value-convertible) -> number | undefined

Parameter behaviour
- index: ToInteger(index); undefined -> 0.

Return behaviour
- Returns integer 0..1114111 on success; undefined when index out of range.

4. DETAILED DIGEST AND PROVENANCE
Source: MDN Web Docs — String.prototype.codePointAt
URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
Retrieved: 2026-03-11T21:26:25.652Z
Extracted: syntax, parameter coercion, surrogate-pair handling, iteration guidance and examples.

5. ATTRIBUTION AND CRAWL DATA
Source: MDN Web Docs. Crawl returned full page content. Approximate retrieved content: ~3 KB.