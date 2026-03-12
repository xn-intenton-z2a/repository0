Title: String.prototype.codePointAt (JavaScript)

Summary

String.prototype.codePointAt(index) returns the Unicode code point value (Number) starting at the given UTF-16 code unit index. If the code unit at index is a leading (high) surrogate, codePointAt returns the full code point constructed from the surrogate pair; if it's a trailing surrogate it returns the trailing surrogate code unit value.

Key points

- Syntax: str.codePointAt(index)
- Returns a non-negative integer code point or undefined when index is out of range.
- Behavior with surrogate pairs: codePointAt handles pairs by returning the correct code point when called at the leading surrogate; called at the trailing surrogate it returns the trailing code unit's numeric value.

Practical advice

- Avoid iterating strings by numeric indices when working with Unicode supplementary characters (surrogate pairs). Use for...of or spread to iterate by Unicode code points.
- Example:

const s = "\uD83D\uDE0D"; // '😍' as surrogate pair
s.codePointAt(0); // 128525 (0x1F60D)
s.codePointAt(1); // 56845 (0xDE0D) — trailing surrogate only

Source: MDN: String.prototype.codePointAt (examples and behavior notes).