MDN_STRING_CODEPOINTAT

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
Retrieved: 2026-03-18
Bytes fetched (approx): 163.2 KB

Table of contents:
1. Purpose and signature
2. Behavior with surrogate pairs
3. Return values and edge cases
4. Usage patterns for correct Unicode handling
5. Interaction with normalization
6. Implementation notes for Hamming-distance string compare
7. Reference details
8. Detailed digest and attribution

1. Purpose and signature
String.prototype.codePointAt(position)
 - position: integer index into the string (UTF-16 code unit index)
 - returns: integer Unicode code point value at that position, or undefined if out of range

2. Behavior with surrogate pairs
- If position indexes a high surrogate and a low surrogate follows, codePointAt returns the full code point represented by the surrogate pair.
- If position indexes a low surrogate without a preceding high surrogate, it returns the code unit value for that low surrogate.

3. Return values and edge cases
- When position < 0 or >= string.length, returns undefined.
- codePointAt differs from charCodeAt in that it returns the actual code point for pairs; charCodeAt returns the 16-bit code unit.

4. Usage patterns for correct Unicode handling
- For iteration over user-perceived characters and for comparing strings by code point, prefer Array.from(str) or for-of or spread [...str] which iterate by Unicode code point, not by code unit.
- To obtain code points at specific logical positions, use codePointAt with care (index is code-unit index). For code-point index operations, use Array.from or build an index mapping.

5. Interaction with normalization
- Use String.prototype.normalize('NFC'|'NFD' etc.) when canonical equivalence (precomposed vs decomposed forms) should be considered equal before comparison.

6. Implementation notes for Hamming-distance string compare
- To compare strings by code point index: let A = Array.from(a); let B = Array.from(b); then compare A[i] !== B[i]. This avoids counting surrogate pairs twice.
- Validation: if Array.from(a).length !== Array.from(b).length throw RangeError.

7. Reference details
- Exact JS method: codePointAt(pos) -> number | undefined
- Iteration helpers: for (const ch of str) { } yields code-point strings; Array.from(str) returns array of code-point strings.

8. Detailed digest
- codePointAt provides access to Unicode code point values and handles surrogate pairs per the ECMAScript spec; MDN documents behaviors and examples for correct usage.

Attribution
Content extracted from MDN codePointAt page (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt), retrieved 2026-03-18. Data fetched ~163.2 KB (HTML).