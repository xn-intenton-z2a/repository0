TITLE: CODEPOINTAT

TABLE OF CONTENTS
1. Purpose
2. Behavior and semantics
3. Algorithm for surrogate pair handling
4. Edge cases
5. Reference details (signature)
6. Detailed digest (source: MDN — String.prototype.codePointAt) — retrieved 2026-03-14
7. Attribution and data size

NORMALISED EXTRACT
1. Purpose
String.prototype.codePointAt(pos) returns the numeric Unicode code point value starting at the given position in the string. It returns the full code point when the position points at a surrogate pair, otherwise the UTF-16 code unit value.

2. Behavior and semantics
- Signature: codePointAt(pos: number) -> integer | undefined
- If pos is out of range (pos < 0 or pos >= string.length) returns undefined.
- If code unit at pos is a high surrogate (0xD800–0xDBFF) and the following code unit is a low surrogate (0xDC00–0xDFFF), the return value is the combined code point:
  cp = ((high - 0xD800) << 10) + (low - 0xDC00) + 0x10000
- Otherwise, returns the code unit value at pos (0..0xFFFF).

3. Algorithm for surrogate pair handling (explicit)
- Let hi = string.charCodeAt(pos). If hi in [0xD800, 0xDBFF] and pos+1 < length then let lo = string.charCodeAt(pos+1); if lo in [0xDC00,0xDFFF] then return combined cp formula above; else return hi.

4. Edge cases
- Unpaired surrogates return their code unit value.
- For iterating real Unicode code points, prefer for...of which yields actual code points, or manage indices manually when using codePointAt.

REFERENCE DETAILS
- JS: String.prototype.codePointAt(pos) -> number | undefined
- Use with: to inspect code points at specific string indices; do not rely on numeric index increments when surrogate pairs may be present.

DETAILED DIGEST
Source: MDN — String.prototype.codePointAt — retrieved 2026-03-14
Data obtained: exact surrogate pair combination formula, return semantics, and usage notes regarding Unicode iteration.

ATTRIBUTION
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt — retrieved 2026-03-14. Data size retrieved: ~160 KB (HTML). License: MDN content (Creative Commons/MDN policies).