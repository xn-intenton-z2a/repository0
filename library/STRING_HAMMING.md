STRING_HAMMING

Table of contents
1. Overview
2. Input validation
3. Unicode code point iteration (implementation detail)
4. Comparison algorithm (code-point-wise)
5. Complexity and limits
6. Supplementary details
7. Reference details
8. Digest (source sections and retrieval date)
9. Attribution and data size

1. Overview
Compute Hamming distance between two equal-length strings by comparing Unicode code points at each position and counting positions that differ. Strings must be compared by code points (not UTF-16 code units) to handle surrogate pairs and extended characters correctly.

2. Input validation
- Both inputs must be of type string; otherwise throw TypeError.
- If strings have different numbers of code points, throw RangeError.
- Empty strings are valid and return distance 0.

3. Unicode code point iteration (implementation detail)
- Use the string iterator (for...of) to iterate actual Unicode code points in JavaScript. The iterator yields full code points, including surrogate pairs, as single items.
- Alternative: use codePointAt with manual index advancement by codePoint length (1 or 2 UTF-16 code units), but iterator is simpler and reliable.
- Converting to arrays: Array.from(string) yields an array of code point strings; length is number of code points.

4. Comparison algorithm (code-point-wise)
- Normalize: Do not normalize Unicode forms automatically; require caller to normalize if canonical equivalence matters.
- Steps:
  a. Convert both strings to arrays of code points: a = Array.from(s1); b = Array.from(s2).
  b. If a.length !== b.length throw RangeError.
  c. Initialize count = 0.
  d. Loop i from 0..a.length-1: if a[i] !== b[i] then count++.
  e. Return count.
- This compares code point identity; grapheme clusters are not compared. For grapheme-aware comparison, use Intl.Segmenter or a library; that is out of scope for basic Hamming distance.

5. Complexity and limits
- Time: O(n) where n is number of code points (Array.from costs O(n)).
- Space: O(n) for the arrays; streaming comparison achievable by simultaneous iterators to avoid full array allocation: create two iterators via s[Symbol.iterator]() and advance in lockstep, counting unequal yielded values.
- Works with large strings; for extremely large inputs prefer streaming iterator to avoid memory spikes.

6. Supplementary details
- Implementation choices:
  - Array.from yields code points as strings; comparing those strings is correct and locale-independent.
  - Using for...of with manual counters avoids creating arrays: create iterators it1, it2; repeatedly call next() and compare values until both done; if one finishes before the other compute length mismatch and throw RangeError.
- Edge cases:
  - Presence of combining marks: combining sequences are separate code points; two canonically equivalent sequences may be unequal. Document this behavior.

7. Reference details
- String iteration
  - Use s[Symbol.iterator]() or for (const cp of s) to iterate full code points.
  - Array.from(s) returns an array of code point strings; length equals code point count.
- API signatures to export (JS):
  - function hammingString(s1: string, s2: string): number
    - Throws TypeError if s1 or s2 is not string.
    - Throws RangeError if code point counts differ.
    - Returns non-negative integer count of differing code point positions.

8. Digest (source sections and retrieval date)
- Wikipedia: Hamming distance — definition and use for symbol sequences. Retrieved 2026-03-20.
- MDN: String.codePointAt and String iterator — details on code points and iteration. Retrieved 2026-03-20.
- NPM: hamming-distance package used as reference for behavior. Retrieved 2026-03-20.

9. Attribution and data size
- Sources used: Wikipedia (Hamming distance), MDN docs (codePointAt, String iterator), npm hamming-distance.
- Total crawled content size approximate: 6.5 KB combined (HTML/text snippets extracted).