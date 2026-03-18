JAVASCRIPT_UNICODE

Normalised extract

Table of contents
- JS string internal representation (UTF-16 code units)
- Code unit vs code point
- Surrogate pairs and numeric ranges
- Iteration semantics (for..of and String iterator)
- Key APIs: charCodeAt, codePointAt, fromCodePoint, length pitfalls
- Combining marks, grapheme clusters, and normalization
- Best practices for comparison and iteration

JS string internal representation (UTF-16 code units)
JavaScript strings are sequences of UTF-16 code units. Each element in the string's indexed sequence is a 16-bit code unit. Many common APIs (for example, the length property and charCodeAt) operate on code units rather than Unicode code points.

Code unit vs code point
A Unicode code point is an abstract scalar value in the range U+0000..U+10FFFF. Code points above U+FFFF are represented in UTF-16 as a surrogate pair (two 16-bit code units). Therefore string.length reports the number of code units, not the number of user-perceived characters (grapheme clusters) or Unicode code points.

Surrogate pairs and numeric ranges
High surrogates: 0xD800–0xDBFF. Low surrogates: 0xDC00–0xDFFF. Supplementary-plane code points (above 0xFFFF) are encoded as a high surrogate followed by a low surrogate. The valid Unicode scalar range is 0..0x10FFFF; surrogate code points are reserved and not valid scalar values on their own.

Iteration semantics (for..of and String iterator)
The String iterator (used by for..of and by Array.from on strings) iterates over Unicode code points, combining surrogate pairs into single iteration yields for supplementary characters. This makes for..of suitable for basic code-point-aware iteration. It does not, however, yield grapheme clusters for composed characters with combining marks; such grapheme clusters can require additional segmentation (for example Intl.Segmenter in modern runtimes).

Key APIs
- String.prototype.charCodeAt(index): returns the 16-bit code unit value at index, not a full code point; for supplementary characters it returns the high surrogate at the index of the pair.
- String.prototype.codePointAt(index): returns a full Unicode code point value for the UTF-16 code unit sequence starting at index, combining a surrogate pair if present; returns undefined when index is out of range.
- String.fromCodePoint(...codePoints): constructs a string from one or more Unicode code point values (see separate reference document).
- String.prototype.normalize(form): performs Unicode normalization; form values are 'NFC', 'NFD', 'NFKC', 'NFKD'. Normalization is required for canonical equivalence comparisons.

Combining marks, grapheme clusters, and normalization
User-perceived characters (grapheme clusters) can be sequences of multiple code points (base character plus combining marks). Two visually identical strings can have different code point sequences (e.g., precomposed character vs base + combining mark). Use String.prototype.normalize with a chosen form (commonly 'NFC') before equality comparisons when equivalence across compositions is required.

Best practices for comparison and iteration
- For code-point-correct iteration use for..of or Array.from(string) to get code points rather than indexing and charCodeAt.
- When comparing strings for user-visible equality, normalize both operands to the same canonical form (for example, call normalize('NFC') on each) before strict equality check.
- Do not rely on length to indicate the number of user-perceived characters; use segmentation APIs (Intl.Segmenter) or grapheme cluster libraries when exact grapheme counts are required.

Supplementary details
- Use codePointAt to obtain numeric code points when analysis or bitwise operations require numeric values from characters.
- Regular expressions with the Unicode (u) flag operate on code points correctly; ensure the u flag is present when patterns need to match supplementary characters.

Reference details (signatures and effects)
- charCodeAt(index) -> Number (0..65535) returns code unit value or NaN if out of bounds
- codePointAt(index) -> Number (0..0x10FFFF) returns code point value or undefined if out of bounds
- fromCodePoint(...codePoints) -> String
- normalize([form]) -> String where form is one of 'NFC'|'NFD'|'NFKC'|'NFKD'

Detailed digest
Source: https://mathiasbynens.be/notes/javascript-unicode
Retrieved: 2026-03-18
Data size fetched during crawl: approximately 80.4 KB

Attribution
Content extracted and condensed from Mathias Bynens' article "JavaScript has a Unicode problem" and related notes. This extract focuses on the technical specifics required to handle Unicode correctly in JavaScript implementations and libraries.