MDN_REMAINDER_OPERATOR

Table of contents
- Overview
- Semantics and algorithm
- Type conversion and edge cases
- Examples
- Supplementary details
- Reference details (API / operator specification)
- Digest and retrieval
- Attribution and data size

Overview
The JavaScript remainder operator is represented by the percent sign: a % b. It returns the remainder after division of the first operand (dividend) by the second (divisor). The result r satisfies: r = a - q * b, where q is the integer value of a / b truncated toward zero.

Semantics and algorithm
- Operands are converted using ToNumber before computation. If either operand is NaN, the result is NaN.
- Division quotient q is computed as trunc(a / b) where trunc rounds toward zero (fractional part removed). 
- Remainder r is computed as r = a - q * b.
- The sign of r is the same as the sign of the dividend (the first operand). Examples: -5 % 3 => -2, 5 % -3 => 2.
- If the divisor is +0 or -0, the result is NaN.
- If divisor is Infinity or -Infinity, the result is the dividend (because trunc(a / Infinity) is 0), subject to ToNumber conversions.

Type conversion and edge cases
- Non-number operands are coerced via ToNumber. Strings that parse to numeric values are allowed: "6" % 4 => 2.
- BigInt operands are not allowed with Number operands; mixing BigInt and Number with % throws a TypeError at runtime.
- Floating point operands produce IEEE-754 style results; remainder is based on floating division and truncation toward zero.
- If a or b is NaN -> result NaN. If b is 0 -> result NaN.

Examples
- 5 % 2 => 1
- 5 % -2 => 1
- -5 % 2 => -1
- -5 % -2 => -1
- 7.5 % 2 => 1.5
- 7 % Infinity => 7
- 7 % 0 => NaN
- "10" % 3 => 1

Supplementary details
- Implementation pattern: compute dividend = ToNumber(a), divisor = ToNumber(b); if divisor === 0 -> return NaN; if either is NaN -> NaN; q = trunc(dividend / divisor); return dividend - q * divisor.
- trunc(x) is equivalent to sign(x) * floor(abs(x)). In practice, use integer truncation toward zero.
- For languages/environments that lack trunc, use (x > 0 ? Math.floor(x) : Math.ceil(x)).

Reference details (operator specification)
- Operator: % (Remainder)
- Syntax: LeftOperand % RightOperand
- Operand conversions: ToNumber applied to both operands (ECMAScript ToNumber abstract operation)
- Step-by-step (ECMAScript-like pseudocode):
  1. Let lnum be ToNumber(lhs).
  2. Let rnum be ToNumber(rhs).
  3. If either lnum or rnum is NaN, return NaN.
  4. If rnum is +0 or -0, return NaN.
  5. Let quotient be trunc(lnum / rnum).
  6. Return lnum - quotient * rnum.
- Return type: Number (IEEE-754 double precision), except when operands are BigInt (separate BigInt modulo semantics; mixing types throws).

Digest and retrieval
- Source: MDN — Remainder (%) page
- Retrieved: 2026-03-19
- Crawl note: HTML fetched via curl; parsed for operator definition, examples, and edge cases.

Attribution and data size
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
- Data fetched: approximately 193.9 KB of HTML (raw page content) during crawl
- Attribution: Content condensed and normalised from MDN documentation (Remainder (%)).
