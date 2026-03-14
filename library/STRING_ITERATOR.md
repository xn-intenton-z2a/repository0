NORMALISED EXTRACT
Definition
String.prototype[Symbol.iterator] returns an iterator over a string’s Unicode code points; each iteration value is a substring representing a single Unicode character (which may occupy one or two UTF-16 code units).

Table of contents
1. Iterator semantics and signature
2. Handling of surrogate pairs and combining characters
3. Implementation notes and patterns in JS
4. Performance considerations

Detailed information
1. Iterator semantics
- Signature: String.prototype[Symbol.iterator]() -> Iterator<string>
- Each call to next() yields { value: <single-character string>, done: boolean } where value is a string that represents one Unicode code point (not a code unit).
- Iteration covers user-perceived characters at the code point granularity; grapheme clusters (multi-code-point units) are not combined by the iterator.

2. Surrogate pair handling
- If a character is represented by a surrogate pair, the iterator yields the two-code-unit pair as a single string value consisting of both code units, so the value corresponds to the Unicode code point.

3. Implementation notes and patterns
- Typical use: for (const ch of str) { /* ch is one Unicode code point as string */ }
- Prefer this iterator over manual index-based loops when processing Unicode-aware characters to avoid splitting surrogate pairs.
- For grapheme-cluster aware segmentation (e.g., emoji sequences, combining marks), use Intl.Segmenter or third-party libraries; the string iterator does not perform grapheme-cluster segmentation.

4. Performance
- Iterator is implemented natively and is efficient for streaming over characters; converting to arrays via Array.from(str) allocates memory proportional to number of code points.

SUPPLEMENTARY DETAILS
- Use in combination with codePointAt when numeric code point values are required.

REFERENCE DETAILS
- Exact property: String.prototype[Symbol.iterator] -> function returning iterator of string values (each value is a string of length 1 or 2 UTF-16 code units representing one Unicode code point).

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator
Retrieved: 2026-03-14
Extracted content: iterator contract, surrogate pair behavior, distinction from grapheme clusters, recommended usage. Data size retrieved: ~160.9 KB.

ATTRIBUTION
Content derived from MDN Web Docs (Mozilla); crawl size ~160.9 KB.