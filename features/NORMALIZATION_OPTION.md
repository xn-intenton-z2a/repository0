NORMALIZATION_OPTION

# Summary

Add an explicit normalization option to the hammingDistance API so callers can opt-in to Unicode normalization when comparing code points. This feature clarifies default behaviour, provides a documented options.normalize flag, updates unit tests and README examples, and preserves backwards compatibility by making normalization opt-in.

# Motivation

Unicode text can represent the same user-perceived character with different code-point sequences (precomposed vs combining marks). Consumers need a simple, opt-in way to compare strings either raw (code points as-is) or normalized (NFC/NFD) so the library is safe for text processing tasks without surprising callers.

# Specification

1. API change
   - Update hammingDistance signature to accept an optional third argument options: hammingDistance(a, b, options?).
   - options is optional; when omitted behaviour remains as today (compare raw code points without normalization).
   - options.normalize may be false, 'NFC', or 'NFD'. Default is false.

2. Validation
   - If a or b is not a string, throw TypeError with a message containing the word "string".
   - If options is provided and is not an object (including null), throw TypeError mentioning "options".
   - If options.normalize is provided and is not one of false, 'NFC', or 'NFD', throw TypeError mentioning "normalize".

3. Normalization behaviour
   - When options.normalize is 'NFC' or 'NFD', call String.prototype.normalize(form) on both inputs before converting to code-point arrays.
   - After optional normalization, compare code points using Array.from or spread([...]) so surrogate pairs and astral characters are treated as single code points.
   - If the resulting code-point arrays have different lengths, throw RangeError mentioning "length" or "equal".

4. Backwards compatibility
   - Omitting options preserves current behaviour to avoid breaking existing callers.
   - Tests must cover both default (no normalization) and normalized cases.

5. Documentation
   - Update README.md API section to document the new options parameter, valid normalize values, and examples demonstrating difference between raw and normalized comparisons (for example, a + combining acute vs precomposed á).

6. Tests
   - Extend tests/unit/main.test.js to include normalization tests:
     - hammingDistance('a\u0301', 'á') without options returns non-zero distance.
     - hammingDistance('a\u0301', 'á', { normalize: 'NFC' }) returns 0.
     - Validate TypeError is thrown for invalid options type and invalid normalize values.
   - Keep existing acceptance tests for core examples (karolin/kathrin, empty strings, unequal lengths) and bit-distance tests unchanged.

# Acceptance Criteria

- hammingDistance has signature accepting optional options parameter.
- Passing { normalize: 'NFC' } makes precomposed and decomposed sequences compare equal where appropriate.
- Calling hammingDistance('a\u0301','á') without options returns a non-zero distance and with { normalize: 'NFC' } returns 0.
- TypeError is thrown for invalid options (non-object) and invalid normalize values.
- Existing acceptance tests (karolin/kathrin, empty strings, unequal-length errors, bit-distance examples) still pass unchanged.
- README contains a short section describing options.normalize with examples.

# Files to change

- src/lib/main.js: extend exported hammingDistance to accept options and implement optional normalization as specified.
- tests/unit/main.test.js: add normalization tests and invalid-options tests; ensure other tests remain.
- README.md: add options.normalize documentation and examples showing normalized vs raw comparisons.

# Implementation notes

- Use Array.from(string) for code-point aware iteration.
- Use String.prototype.normalize when options.normalize is 'NFC' or 'NFD'.
- Keep error messages concise but containing keywords: "string", "options", "normalize", "length" to make test assertions robust.
- Do not change hammingDistanceBits behaviour.
- Make minimal code changes and add tests; avoid altering other files.

# Motivation alignment

This feature directly advances the mission by improving correctness for Unicode inputs and providing an explicit, documented mechanism for callers to opt into normalization where necessary.