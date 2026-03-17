# UNICODE_SUPPORT

Summary

Defines expectations for correct Unicode handling when computing Hamming distances between strings. The library must operate on Unicode code points so that surrogate pairs and astral-plane characters are treated as single units.

Behavior

- All string-based APIs (hammingDistanceStrings) operate on Unicode code points.
- Implementations must transform strings into code point arrays (Array.from or [...str]) before length checks and position comparisons.
- Grapheme cluster equivalence (user-perceived characters composed of multiple code points) is explicitly out of scope for this mission; tests validate code-point correctness only.

Acceptance criteria (testable)

1. hammingDistanceStrings("a𝄞c", "a𝄟c") === 1 where 𝄞 and 𝄟 are different astral musical symbols (each counts as one code point).
2. hammingDistanceStrings("😀", "😁") === 1 for differing emoji.
3. hammingDistanceStrings("💩", "x") throws RangeError when code point counts differ.
4. TypeError is thrown when non-strings are supplied to string API.

Examples for unit tests

- const a = Array.from("a𝄞c"); // a.length === 3
- assert(hammingDistanceStrings("a😀", "a😁") === 1)
- assert.throws(() => hammingDistanceStrings(123, "a"), TypeError)

Notes for implementer

- Avoid comparing code units; use Array.from or the spread operator to derive code points. This ensures surrogate pairs are handled correctly in tests and demo output.
- Document that future work may address grapheme clusters if needed, but for now code points are the required granularity.