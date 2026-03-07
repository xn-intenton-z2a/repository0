CODEPOINTAT

TABLE OF CONTENTS
1. NORMALISED EXTRACT
  1.1 Signature and return semantics
  1.2 Surrogate pair handling algorithm (exact steps)
  1.3 Return values and undefined cases
2. SUPPLEMENTARY DETAILS
  2.1 Looping patterns and index-based pitfalls
  2.2 Interaction with for-of and spread
3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)
  3.1 String.prototype.codePointAt(index): number | undefined
  3.2 Exact algorithm (ECMAScript spec steps)
4. TROUBLESHOOTING AND PROCEDURES
  4.1 When codePointAt returns a surrogate
  4.2 Safe looping recipe
5. SOURCE DIGEST AND RETRIEVAL METADATA
6. ATTRIBUTION

1. NORMALISED EXTRACT

1.1 Signature and return semantics
- Syntax: codePointAt(index)
- Parameter: index converted to integer (undefined -> 0)
- Return: non-negative integer representing Unicode code point at the specified index, or undefined if index out of bounds.

1.2 Surrogate pair handling algorithm (exact steps)
- Let first = str.charCodeAt(pos). If first is NaN (pos out of range) return undefined.
- If first is in 0xD800..0xDBFF (leading surrogate):
    - Let second = str.charCodeAt(pos + 1).
    - If second is in 0xDC00..0xDFFF (trailing surrogate):
        - codePoint = ((first - 0xD800) << 10) + (second - 0xDC00) + 0x10000
        - return codePoint
    - Else return first (the leading surrogate code unit value)
- If first is not a leading surrogate, return first.

1.3 Return values and undefined cases
- Returns a Number 0..0x10FFFF when a code point or leading surrogate pair present; returns the trailing surrogate code unit value when called on the low surrogate index.
- Returns undefined for index < 0 or index >= str.length.

2. SUPPLEMENTARY DETAILS

2.1 Looping patterns and index-based pitfalls
- Index-based loops visiting each code unit will see surrogate halves separately; codePointAt will return full code point on the leading index but only trailing surrogate unit on the trailing index. To avoid duplication, when codePointAt(i) > 0xFFFF increment i by 1 additional step.

2.2 Interaction with for-of and spread
- Prefer for-of or [...str] which already iterate by code points, avoiding manual codePointAt bookkeeping in most cases.

3. REFERENCE DETAILS (API SIGNATURES, PARAMETERS, RETURN TYPES, EFFECTS)

3.1 String.prototype.codePointAt(index): number | undefined
- Parameter: index Number converted via ToInteger. If omitted, treated as 0.
- Return: Number (non-negative integer) or undefined.
- Effects: none; pure read of string code units.

3.2 Exact algorithm (ECMAScript spec steps)
- Implementation steps are the same as described in 1.2; use charCodeAt to read UTF-16 code units and combine surrogate pair as ((H - 0xD800) << 10) + (L - 0xDC00) + 0x10000 when present.

4. TROUBLESHOOTING AND PROCEDURES

4.1 When codePointAt returns a surrogate
- If codePointAt(i) returns value in surrogate ranges, the caller is indexing a lone surrogate or the low half; check indices and prefer iterator-based approaches.

4.2 Safe looping recipe
- Use: for (let i = 0; i < s.length; i++) { const cp = s.codePointAt(i); handle(cp); if (cp > 0xFFFF) i++; }
- Or: for (const ch of s) { const cp = ch.codePointAt(0); handle(cp); }

5. SOURCE DIGEST AND RETRIEVAL METADATA
- Source: MDN String.prototype.codePointAt page; retrieved 2026-03-07T20:27:36.378Z. Examples and algorithmic steps taken from MDN and ECMAScript references included there.

6. ATTRIBUTION
- Derived from MDN documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
