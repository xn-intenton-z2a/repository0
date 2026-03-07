STRING_ITERATION

TABLE OF CONTENTS
1. NORMALISED EXTRACT
  1.1 UTF-16 storage and code units
  1.2 Surrogate pairs: high and low ranges
  1.3 Iteration semantics: code units vs code points vs grapheme clusters
  1.4 Practical iteration patterns in JavaScript
2. SUPPLEMENTARY DETAILS
  2.1 Converting strings to bytes (TextEncoder / UTF-8)
  2.2 Well-formed strings and lone surrogates
3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)
  3.1 String.prototype[@@iterator]() → iterates code points
  3.2 for-of iteration contract
  3.3 String.length and index-based access semantics
4. TROUBLESHOOTING AND PROCEDURES
  4.1 Detecting and sanitizing lone surrogates
  4.2 Choosing correct iteration level for application (code point vs grapheme cluster)
5. SOURCE DIGEST AND RETRIEVAL METADATA
6. ATTRIBUTION

1. NORMALISED EXTRACT

1.1 UTF-16 storage and code units
- JavaScript strings are sequences of UTF-16 code units (16-bit). Each string index references a single UTF-16 code unit; length counts code units.

1.2 Surrogate pairs: high and low ranges
- High (leading) surrogate range: 0xD800..0xDBFF
- Low (trailing) surrogate range: 0xDC00..0xDFFF
- A Unicode code point > 0xFFFF is encoded as a pair: high then low.

1.3 Iteration semantics: code units vs code points vs grapheme clusters
- String index and methods charAt/charCodeAt/at return single code units.
- The string iterator ([Symbol.iterator], used by for-of and spread) iterates by Unicode code points (returns full code point characters, combining surrogate pairs into one iteration element).
- Grapheme clusters (user-perceived characters) are composed of multiple code points and require specialized libraries (Intl.Segmenter, third-party grapheme-splitter) to iterate correctly.

1.4 Practical iteration patterns in JavaScript
- Index-based loop with codePointAt handling:
  For (let i = 0; i < s.length; i++) { let cp = s.codePointAt(i); if (cp > 0xFFFF) i++; /* handle cp */ }
- Use for-of or [...s] to iterate code points directly: for (const ch of s) { /* ch is one code point string */ }
- To convert to bytes, use TextEncoder (UTF-8): const bytes = new TextEncoder().encode(s);

2. SUPPLEMENTARY DETAILS

2.1 Converting strings to bytes (TextEncoder / UTF-8)
- Use TextEncoder for UTF-8 bytes; TextEncoder throws on lone surrogates in some implementations — ensure string is well-formed or call toWellFormed().

2.2 Well-formed strings and lone surrogates
- Lone surrogates occur when a surrogate code unit appears without its pair; functions like isWellFormed() and toWellFormed() can detect/sanitize.
- encodeURI and TextEncoder may throw on lone surrogates; sanitize before interop.

3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)

3.1 String.prototype[@@iterator]()
- Signature: string[Symbol.iterator]()
- Behavior: returns an iterator that yields substrings each representing a single Unicode code point (length 1 or 2 code units).
- Return type: iterator over string values.

3.2 for-of iteration contract
- for (const ch of s) { ... } invokes the string iterator; ch is a string representing one Unicode code point.

3.3 String.length and index-based access semantics
- length returns number of UTF-16 code units.
- s[i] or s.charAt(i) returns a string of exactly one UTF-16 code unit.

4. TROUBLESHOOTING AND PROCEDURES

4.1 Detecting and sanitizing lone surrogates
- Use s.isWellFormed() to test for lone surrogates; use s.toWellFormed() to replace lone surrogates with replacement code points.

4.2 Choosing correct iteration level for application
- For bitwise/string-difference algorithms like Hamming over bytes: encode to UTF-8 or use normalized code unit arrays depending on intended semantics.
- For user-facing UI operations use grapheme cluster segmentation (Intl.Segmenter or grapheme-splitter) to avoid splitting emoji sequences.

5. SOURCE DIGEST AND RETRIEVAL METADATA
- Source: MDN String reference "Iterating over strings" and string unicode sections; retrieved 2026-03-07T20:27:36.378Z. Some content truncated in fetch.

6. ATTRIBUTION
- Derived verbatim technical points from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
