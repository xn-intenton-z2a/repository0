MDN_STRING

Table of Contents
- String fundamentals relevant to iteration and Unicode
- Iterating over code points (for...of, Array.from)
- Normalization recommendations
- Practical guidance for implementing code-point comparisons
- Edge cases and examples

String fundamentals relevant to iteration and Unicode
- JavaScript strings are sequences of UTF-16 code units. Characters outside the BMP are represented as surrogate pairs (two code units) but are single Unicode code points.
- Many string operations operate on code units; to treat characters as Unicode code points use iteration methods that understand surrogate pairs.

Iterating over code points
- for...of iteration over a string yields Unicode code points (full characters), not individual UTF-16 code units.
- Array.from(str) creates an array of code points; spread syntax [...str] likewise yields code points.
- String.prototype.codePointAt(index) returns the code point value at a position measured in UTF-16 code units; when iterating use code points indices from for...of or Array.from.

Normalization recommendations
- Unicode strings can differ in canonical composition vs decomposition (NFC vs NFD). If semantically comparing characters is required, normalize both strings using str.normalize('NFC') or an explicit chosen form before comparing code points.

Practical guidance for implementing code-point comparisons
- Validate that inputs are strings and apply normalization if required by the API contract.
- Iterate both strings in lockstep using iterators from for...of, comparing each yielded code point string (single-character string) with !==; count mismatches.
- After iteration, if lengths differ in code points throw RangeError.

Edge cases
- Empty strings: two empty strings compare with distance 0.
- Combining marks: normalization may collapse visually-identical sequences into the same code-point sequence; choose normalization policy.

Digest (retrieval)
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
- Retrieved: 2026-03-19
- Data obtained during crawl: 198.7 KB (HTML)

Attribution
Content derived from MDN Web Docs (Mozilla). Data retrieved on 2026-03-19; HTML size as indicated above.
