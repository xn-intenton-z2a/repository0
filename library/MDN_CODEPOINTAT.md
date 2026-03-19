MDN_CODEPOINTAT

Table of Contents
- Purpose of codePointAt
- Behavior and return values
- Interaction with surrogate pairs
- Implementation notes for safe iteration and indexing
- Examples of use (described)

Purpose of codePointAt
- String.prototype.codePointAt(pos) returns the numeric Unicode code point value starting at the given UTF-16 code unit index.

Behavior and return values
- If pos is out of range return undefined.
- For a surrogate pair at pos (high surrogate followed by low surrogate), codePointAt returns the full code point (value > 0xFFFF).
- Otherwise returns the code unit value at pos.

Interaction with surrogate pairs
- The index param is a UTF-16 code unit index; when working with code-point iteration use for...of or Array.from rather than raw numeric indices unless you handle surrogate pairs explicitly.

Implementation notes for safe iteration and indexing
- Prefer for...of when you need each character as a string; use codePointAt when you must obtain numeric code point values from known code unit indices.
- For normalization and canonical equivalence, call normalize() before codePointAt if needed.

Digest (retrieval)
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
- Retrieved: 2026-03-19
- Data obtained during crawl: 163.2 KB (HTML)

Attribution
Content derived from MDN Web Docs (Mozilla). Data retrieved on 2026-03-19; HTML size as indicated above.
