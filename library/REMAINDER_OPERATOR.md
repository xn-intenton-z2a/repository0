NORMALISED EXTRACT

Table of contents
1. Operator semantics (remainder versus mathematical modulo)
2. Formal ECMAScript definition
3. Negative operands behaviour
4. Non-integer behaviour
5. Divisibility checks and idioms
6. Pitfalls and fixes

1. Operator semantics
- In JavaScript the binary operator a % b computes the remainder r from dividing a by b. The sign of the result follows the dividend a, not the divisor.
- Use a % b === 0 to test integer divisibility when a and b are integers.

2. Formal ECMAScript definition
- The remainder result is computed as: r = a - b * trunc(a / b) where trunc(x) rounds toward zero.
- If either operand is NaN, or if b is 0, the result is NaN (division semantics apply for special values).

3. Negative operands behaviour
- Because trunc rounds toward zero, negative dividends can yield negative remainders. Example math: (-1) % 3 === -1.
- Divisibility still holds: if a is integer and a % b === 0, then a is divisible by b regardless of sign.

4. Non-integer behaviour
- For floating point operands, the remainder is a floating point result and exact equality comparisons may be unsafe; avoid using remainder with fractional inputs unless normalized first.

5. Divisibility checks and idioms
- Combined check: i % 15 === 0 for checking multiples of both 3 and 5.
- Positive modulo idiom: ((a % b) + b) % b yields a non-negative result in all cases; use when you need mathematical modulo in range [0, b-1].

6. Pitfalls and fixes
- Do not rely on a % b for non-integer inputs; validate with Number.isInteger first.
- For safety when b can be zero, explicitly check divisor !== 0 before using %.

REFERENCE DETAILS
- Exact semantics: remainder r = a - b * trunc(a / b)
- Edge cases: a or b NaN => result NaN; b === 0 => result NaN; non-finite operands follow IEEE-754 rules
- Implementation pattern for FizzBuzz: use strict equality to 0 on integer inputs

DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
Retrieved: 2026-03-19
Extract (technical): The remainder operator returns the remainder left over when one operand is divided by a second operand. The result has the same sign as the dividend; use trunc(a / b) in the formal definition. For mathematical modulo use the positive modulo idiom.

ATTRIBUTION
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
- Retrieved: 2026-03-19
- Bytes downloaded: 198540
