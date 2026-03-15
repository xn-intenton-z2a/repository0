REMAINDER

Table of contents
- Operator semantics
- Mathematical definition used by JavaScript
- Behavior with negative operands
- Use cases for divisibility checks
- Implementation examples (patterns)

Operator semantics
The JavaScript remainder operator is expressed as a % b. It computes the remainder r = a - trunc(a / b) * b where trunc is truncation toward zero. The result has the sign of the dividend (a).

Mathematical definition used by JavaScript
Given finite numeric operands a and b (b !== 0): let q = trunc(a / b); remainder r = a - q * b. For integer a and b this produces the conventional modulo remainder for divisibility checks when comparing r === 0.

Behavior with negative operands
- (-7) % 3 -> -1 because trunc(-7/3) = -2 and -7 - (-2)*3 = -1. -7 % -3 -> -1. 7 % -3 -> 1. Divisibility checks should use r === 0; sign differences are irrelevant for zero-checks.

Use cases for divisibility checks
- Check integer a divisible by b: (a % b) === 0. - When b is ±3 or ±5 for fizzbuzz style checks, use strict equality to zero.

Implementation examples (patterns)
- Use r3 = (i % 3) === 0 and r5 = (i % 5) === 0. - Prefer Number.isInteger on operands before remainder operations to avoid fractional remainder semantics.

Reference details
- Operator: %  (a % b)  -> numeric remainder or NaN if operands are NaN or if b is 0 result is NaN/Infinity semantics per IEEE-754 and JS spec.

Detailed digest
Source: MDN — Remainder (%) (retrieved 2026-03-15). Raw HTML size: 197879 bytes.

Attribution and crawl data
- MDN Web Docs — Remainder (%). Retrieved 2026-03-15. 197879 bytes.
