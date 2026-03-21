NORMALISED EXTRACT
- Operator: Remainder operator expressed as a % b.
- Definition: Returns the remainder after integer division where result has the sign of the dividend (a).
- Edge behaviour: If b is 0 the result is NaN; negative dividends produce negative remainder values consistent with truncation toward zero.

TABLE OF CONTENTS
1. Syntax
2. Mathematical semantics
3. Behaviour with negative operands
4. Edge cases (division by zero)
5. Examples relevant to FizzBuzz

1. Syntax
- Expression: a % b
- Returns: numeric remainder value following ECMAScript semantics.

2. Mathematical semantics
- Effectively: remainder = a - Math.trunc(a / b) * b where Math.trunc rounds toward zero.
- The remainder has the same sign as a (the dividend).

3. Behaviour with negative operands
- -5 % 3 -> -2
- 5 % -3 -> 2
- Use strict checks (i % 3 === 0) to test divisibility; divisibility test is unaffected by sign because zero remainder is identical.

4. Edge cases (division by zero)
- a % 0 -> NaN in JavaScript. Guard against modulus by zero when implementing generic routines.

5. Examples relevant to FizzBuzz
- For positive integers i, (i % 3 === 0) and (i % 5 === 0) are the canonical checks.

SUPPLEMENTARY DETAILS
- Use the remainder operator for divisibility tests only; when using negative values be aware the remainder sign follows the dividend. For FizzBuzz (positive integers) typical behaviour is straightforward.

REFERENCE DETAILS
- Operator syntax: a % b -> Number
- Parameters: a (Number), b (Number)
- Return value: numeric remainder or NaN for invalid operations (e.g., modulus by 0).

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
Retrieved: 2026-03-21
Data size (bytes): 193068
Extracted technical lines: "The remainder operator (%) returns the remainder left over when one operand is divided by a second operand." (MDN)

ATTRIBUTION
Content derived from MDN Web Docs (Remainder (%)); retrieved 2026-03-21; data size: 193068 bytes.