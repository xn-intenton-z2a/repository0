REGEX_VALIDATION

Table of contents
- Canonical validation regex
- Explanation of each group
- Usage in production parsing
- Failure modes and examples
- Digest and attribution

Canonical validation regex (exact)
^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$

Explanation of each group
- M{0,3}: thousands (0..3000)
- (CM|CD|D?C{0,3}): hundreds (900,400 or 0..300 with optional D)
- (XC|XL|L?X{0,3}): tens (90,40 or 0..30 with optional L)
- (IX|IV|V?I{0,3}): ones (9,4 or 0..3 with optional V)

Usage in production parsing
1. Trim and uppercase input.
2. Apply regex.test(s) — if false, reject (TypeError).
3. If true, parse deterministically (scan for two-char tokens first).

Failure modes and examples
- "IIII" fails (four repeats)
- "IL" fails (invalid subtraction)
- Lowercase or surrounding whitespace should be normalized before validation; embedded invalid characters fail.

Digest and attribution
- Source: StackOverflow discussion on regex for valid Roman numerals
- Retrieval date: 2026-03-19
- Retrieved size: ~44.8 KB (HTML) saved during crawl
- URL: https://stackoverflow.com/questions/267399/how-do-you-match-only-valid-roman-numerals-with-a-regular-expression
