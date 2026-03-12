Title: Iterating Over Strings (JavaScript)

Summary

JavaScript strings are sequences of UTF-16 code units. Iteration semantics differ depending on the method: indexing and split("") operate on UTF-16 code units (may split surrogate pairs), while the string iterator ([Symbol.iterator]) used by for...of and the spread operator iterates by Unicode code points.

Key points

- String length and indices count UTF-16 code units, not user-perceived characters (grapheme clusters).
- Surrogate pairs (high + low surrogates) represent code points > U+FFFF; indexing can visit each half separately.
- Grapheme clusters (e.g., emoji sequences joined by ZWJ) may consist of multiple code points; neither codePointAt nor for...of produces grapheme clusters by default.

Practical guidance

- To iterate code points: use for (const ch of str) { /* ch is a string of one code point */ }
- To get code point numeric values: for-of or spread and then call .codePointAt(0) on each element.
- To operate on grapheme clusters (user-perceived characters), use Intl.Segmenter or a grapheme library.

Examples

[..."😄"].map(cp => cp.codePointAt(0).toString(16)); // ['1f604']
"😄".split(""); // may produce surrogate halves

Source: MDN: String reference — iterating over strings; notes about UTF-16, surrogate pairs, code points, grapheme clusters.