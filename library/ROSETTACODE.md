ROSETTACODE

Table of contents
- Implementations overview
- Variant algorithms and edge-case handling
- Test cases gathered from examples
- Integration guidance for unit tests
- Digest and attribution

Implementations overview
- Rosetta Code contains multiple implementations in different languages demonstrating both greedy lookup (values->symbols) and parsing by scanning with subtractive checks.
- Common JS pattern: arrays of values and symbols then greedy loop; alternative uses repeated replace operations or regex-based parsing.

Variant algorithms and edge-case handling
- Greedy lookup (values descending) produces canonical subtractive form and is simplest to implement.
- Alternative approaches include building per-place lookup tables (thousands/hundreds/tens/ones) or iterative subtraction with symbol appends.
- When parsing, prefer validating with the strict regex first to reject malformed numerals, then scanning left-to-right with two-character subtractive token checks.

Test cases gathered from examples
Include canonical examples: 1 (I), 4 (IV), 9 (IX), 40 (XL), 90 (XC), 400 (CD), 900 (CM), 1984 (MCMLXXXIV), 3999 (MMMCMXCIX), invalid examples: 0, 4000, IIII, IL, IC.

Integration guidance for unit tests
- Use Rosetta examples as cross-language consistency checks.
- Add round-trip tests for all numbers 1..3999 (sampling or full loop in unit tests as acceptance criteria).

Digest and attribution
- Source: Rosetta Code Roman numerals
- Retrieval date: 2026-03-19
- Retrieved size: ~657.1 KB (HTML)
- URL: https://rosettacode.org/wiki/Roman_numerals
