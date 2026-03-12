Title: Iterating Over Strings (JavaScript)

Summary

JavaScript strings are sequences of UTF‑16 code units. Iteration semantics differ: indexing and split("") operate on UTF‑16 code units (may split surrogate pairs), while the string iterator (used by for...of and the spread operator) iterates by Unicode code points.

Key points

- String length and indices count UTF‑16 code units, not user‑perceived characters (grapheme clusters).
- Surrogate pairs (high + low surrogates) represent code points > U+FFFF; indexing can visit each half separately.
- For‑of and String[Symbol.iterator] iterate by code points; to iterate grapheme clusters use Intl.Segmenter or a grapheme library.

Practical guidance

- To iterate code points: for (const ch of str) { /* ch is a string representing one code point */ }
- To get numeric code points: for-of or spread the string then call codePointAt(0) on each element.

Examples

[..."😄"].map(cp => cp.codePointAt(0).toString(16)); // ['1f604']
"😄".split("") // may produce surrogate halves

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#iterating_over_strings
