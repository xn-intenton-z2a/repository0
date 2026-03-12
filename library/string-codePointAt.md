Title: String.prototype.codePointAt (JavaScript)

Summary

String.prototype.codePointAt(index) returns the Unicode code point value (Number) starting at the given UTF‑16 code unit index. If the code unit at index is a leading surrogate, codePointAt returns the full code point constructed from the surrogate pair; if it's a trailing surrogate it returns the trailing surrogate code unit value.

Key points

- Syntax: str.codePointAt(index)
- Returns a non‑negative integer code point or undefined when index is out of range.
- When called at a leading surrogate, it returns the full code point; called at the trailing surrogate it returns the trailing surrogate code unit value.

Practical advice

- Avoid iterating over string indices when handling supplementary characters; use for...of or spread to iterate by Unicode code points and call .codePointAt(0) on each element if you need numeric values.

Examples

"😍".codePointAt(0) // 128525
"\ud83d\ude0d".codePointAt(0) // 128525
"\ud83d\ude0d".codePointAt(1) // 56845 (trailing surrogate)

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt