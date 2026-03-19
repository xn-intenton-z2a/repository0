NORMALISED EXTRACT

Unicode code point handling in JavaScript strings
- JavaScript strings are sequences of UTF-16 code units; characters outside BMP are surrogate pairs.
- To iterate by Unicode code points: use String.prototype[@@iterator] (for...of) or String.prototype.codePointAt(index) paired with code point iteration.
- To get the length in code points: iterate and count code points; String.length returns UTF-16 code unit count and can be larger than code point count.

TABLE OF CONTENTS
1. Code point extraction
2. Iteration patterns
3. Measuring equal-length by code points
4. Error handling and validation

DETAILED CONTENT
1. Code point extraction
- codePointAt(pos): returns the code point value at given UTF-16 code unit index; returns undefined if out of range.
- When encountering a high surrogate followed by a low surrogate, codePointAt returns the combined code point.

2. Iteration patterns
- for (const ch of str) { } iterates over code points, yielding full Unicode characters (including astral plane) as single items.
- To walk two strings in lockstep by code point, use iterators: const ai = s[Symbol.iterator](); const bi = t[Symbol.iterator](); then call ai.next().value and bi.next().value.

3. Measuring equal-length by code points
- Determine code point lengths by iterating both strings and counting steps; if counts differ, throw RangeError.
- For per-position comparison, advance both iterators in parallel and compare code points (string values from iterator) using strict equality.

4. Error handling and validation
- If inputs are not of type string, throw TypeError.
- If code point lengths differ, throw RangeError.

SUPPLEMENTARY DETAILS

Implementation caveats
- Avoid indexing by numeric index assuming code points align with indices; surrogate pairs break this assumption.
- Using spread operator [...str] yields array of code points and can be used for random access but copies the whole string (O(n) memory).

REFERENCE DETAILS

API specifics
- String.prototype.codePointAt(index): signature (index: number) => number | undefined.
- String.prototype[@@iterator]: returns an iterator with NextResult<string> yielding single Unicode characters.

DIGEST

Sources: MDN codePointAt and String iterator pages
Retrieved: 2026-03-19
Size fetched: (MDN pages combined) ~6 KB

ATTRIBUTION
MDN Web Docs: String.prototype.codePointAt and String iteration. URLs: https://developer.mozilla.org/.../String/codePointAt and https://developer.mozilla.org/.../String/Symbol.iterator
