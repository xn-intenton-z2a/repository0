MDN_STRING_ITERATOR

Table of contents:
- Purpose
- Syntax
- Return type
- Iteration semantics (code points)
- Edge cases (surrogate pairs, unpaired surrogates, combining marks)
- Interactions (for...of, spread, Array.from)
- Implementation notes (ECMAScript internal behaviour)
- Supplementary details
- Reference details (method signature, next() shape)
- Digest (retrieved 2026-03-18)
- Attribution and data size

Purpose
The String.prototype[Symbol.iterator]() method implements the iterable protocol for String values and provides an iterator that yields the Unicode code points of the string value as individual string values.

Syntax
String.prototype[Symbol.iterator]()

Return type
An object implementing the iteration protocol: an IterableIterator<string>. Each iteration step returns an object with the shape { value: string, done: boolean }.

Iteration semantics (code points)
- Each iteration step yields a JavaScript string containing a single Unicode code point represented as a JavaScript string value.
- Astral characters (code points outside BMP) encoded as UTF-16 surrogate pairs are returned as a single iteration result: the iterator recognizes a high-surrogate followed by a low-surrogate and yields the two-code-unit pair as one string value representing the single code point.
- The iterator yields code points, not grapheme clusters. Combining marks and sequences that form a single user-perceived grapheme are yielded as separate code points unless the code points themselves are precomposed in the string.

Edge cases
- Unpaired surrogates: an isolated high or low surrogate is yielded as a one-unit string (the unpaired surrogate itself).
- Empty string: the iterator immediately returns done: true.

Interactions
- for...of consumes this iterator; therefore "for (const ch of s)" visits code point strings, not UTF-16 code units.
- Spread syntax [...s] and Array.from(s) use the same iterator and thus produce arrays of code-point strings.

Implementation notes (ECMAScript behavior)
- The iterator is defined by the String Iterator abstract operation in ECMAScript: on each step it obtains the code unit(s) at the current index; if the unit at index is a high surrogate and the next unit is a low surrogate, both are combined into the returned string and the internal index is incremented by 2; otherwise the single code unit is returned and index increments by 1.
- The iterator does not perform normalization; it reads code units as present in the string value.
- When a for...of loop exits early (break, throw, or return), the runtime will attempt to call the iterator's return method if present.

Supplementary details (practical usage)
- To compare two strings by code points, iterate them with for...of or convert to arrays of code points: Array.from(s) yields sequence of code-point strings; compare element-wise.
- To obtain numeric code point values use String.prototype.codePointAt(index) which returns the numeric code point for the code point starting at the specified code unit index.
- To create a string from numeric code points use String.fromCodePoint.
- For algorithms that need numeric code point comparison, use codePointAt on the code-point-starting index obtained while iterating; using index-based access s[i] is unsafe for astral characters.

Reference details (exact API)
- Method signature: String.prototype[Symbol.iterator]() -> IterableIterator<string>
- next() return object: { value: string, done: boolean }
- Parameters: none
- Side-effects: advances the iterator internal index; no thrown exceptions for valid string inputs.

Digest (extracted content)
- The method implements the iterable protocol for strings. It returns an iterator that yields string values, each containing a single Unicode code point. It is the underlying iterator used by for...of loops, spread syntax, and Array.from to consume strings as sequences of characters in code point granularity.
- Retrieval date: 2026-03-18

Attribution
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator
Data retrieved: 160433 bytes (HTTP response body size measured at fetch time)

Notes
This document contains the technical facts required to treat JavaScript strings as sequences of code points when implementing Hamming-distance comparisons that must operate on Unicode code points rather than UTF-16 code units.