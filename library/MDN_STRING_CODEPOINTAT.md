MDN_STRING_CODEPOINTAT

Table of contents
1. API summary
2. Behavior with surrogate pairs
3. Iterating code points vs code units
4. Usage patterns for Hamming-distance string comparison
5. Reference details
6. Digest and attribution

Normalised extract
API summary: String.prototype.codePointAt(position) returns a non-negative integer that is the code point value at the given position in the String object.
- Signature: String.prototype.codePointAt(position) -> number | undefined
- Parameters: position (optional integer). If omitted, position defaults to 0.
- Return: the code point number (0 .. 0x10FFFF) if a code point starts at the given position, otherwise undefined if position is out of range.

Behavior with surrogate pairs:
- If the code unit at position is a high surrogate and a following low surrogate exists, codePointAt returns the combined code point (> 0xFFFF). If position indexes the low surrogate directly, it returns the code unit value for that low surrogate.
- This is how to correctly obtain a Unicode scalar value from a JavaScript string at a given position.

Iterating code points vs code units:
- for...of iteration and Array.from(string) iterate strings by code points (they handle surrogate pairs correctly and yield each Unicode scalar value as a string), whereas string[index] and String.prototype.charCodeAt operate on UTF-16 code units and can return surrogate halves.

Usage patterns for Hamming-distance string comparison:
- To compare code points at positions safely, either iterate both strings with for...of in lock-step or convert to arrays of code points: let A = Array.from(a); let B = Array.from(b); then compare A[i] and B[i].
- Do not use string[i] or charCodeAt when correctly handling characters outside BMP or surrogate pairs is required.

Reference details
- Method: String.prototype.codePointAt(pos)
  - Inputs: pos (integer, defaults 0)
  - Output: number or undefined
  - Edge behavior: returns undefined if pos >= length in code units. If surrogate pair present at pos, returns combined code point.

Digest (retrieved: 2026-03-18)
- Extracted: codePointAt semantics, surrogate-pair handling, and recommended iteration patterns (for...of / Array.from) for code-point-accurate traversal.
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
- Bytes retrieved: 162097
