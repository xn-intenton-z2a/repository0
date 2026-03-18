MDN_STRING_ITERATOR

Table of contents
- Purpose and overview
- Signature and iterator return type
- Iteration semantics (Unicode code points vs UTF-16 code units)
- Related APIs (codePointAt, normalize)
- Hamming-distance guidance for Unicode strings
- Implementation patterns and examples (text steps)
- Edge cases and normalization recommendations
- Digest and retrieval metadata
- Attribution

Purpose and overview
The String iterator yields successive string elements corresponding to Unicode code points; it enables for...of and spread (...) to iterate characters as user-perceived glyphs (code points), not raw UTF-16 code units.

Signature
- String.prototype[Symbol.iterator]() -> Iterator<string>
  - returns an iterator producing strings where each produced string represents a single Unicode code point (which may be one or two UTF-16 code units).

Iteration semantics
- Iterating a string with for...of or spread returns sequences of code point strings.
- Surrogate pairs (for characters outside the BMP) are correctly combined into a single iteration element; this prevents breaking a single Unicode character across iterations.
- To obtain numeric code point values use String.prototype.codePointAt(index) (returns a Number representing the code point value).

Related APIs
- String.prototype.codePointAt(pos) -> Number | undefined
  - Returns the code point number starting at pos, correctly handling surrogate pairs.
- String.prototype.normalize(form) -> string
  - Recommended forms: 'NFC' (compose) or 'NFD' (decompose); normalization affects how sequences of combining marks are represented and therefore affects code point sequences and equality checks.

Hamming-distance guidance for Unicode strings
- Compare strings by code points, not UTF-16 code units. Use iteration via for...of, spread ([...s]) or Array.from(s) to obtain code-point-aligned arrays.
- Normalize both strings to a chosen normalization form (prefer NFC) before comparing to avoid false mismatches caused by canonically equivalent but differently composed sequences.
- Validation rule: strings must have equal length in code points after normalization; if lengths differ, throw RangeError per mission requirements.

Implementation patterns (text steps)
1. Normalize both inputs: a = a.normalize('NFC'); b = b.normalize('NFC')
2. Convert to code-point arrays: A = Array.from(a) or [...a]; B = Array.from(b)
3. If A.length !== B.length: throw RangeError('Strings must be the same length in code points')
4. Iterate i from 0..A.length-1 and increment diffCount when A[i] !== B[i]
5. Return diffCount (Number)

Edge cases and normalization recommendations
- Empty strings: length 0 => zero differences.
- Combining marks: normalization ensures sequences like 'e' + '´' vs 'é' compare equal when NFC is used.
- Do not compare using String.length (UTF-16 code units) for Unicode correctness.

Digest and retrieval metadata
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator
- Retrieved: 2026-03-18T21:45:18.698Z
- Bytes downloaded during crawl: 160433 bytes

Attribution
Content derived from MDN Web Docs (String.prototype[Symbol.iterator]) and related String pages (codePointAt, normalize) covering Unicode-aware string iteration and normalization.
