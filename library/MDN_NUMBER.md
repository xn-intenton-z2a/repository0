TABLE OF CONTENTS
1. Overview
2. Number constructor and properties
3. Parsing and conversion
4. Numeric operations and methods
5. Special numeric values
6. Precision and limits
7. Supplementary details
8. Reference details
9. Digest

1. Overview
Number is the numeric primitive type representing IEEE 754 double-precision floating point values in JavaScript.

2. Number constructor and properties
- Number(value) coerces to numeric value
- Static properties: Number.MAX_VALUE, Number.MIN_VALUE, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.EPSILON

3. Parsing and conversion
- parseInt(string, radix) and parseFloat(string)
- Number.prototype.toString(radix?) -> string
- Number.isNaN, Number.isFinite, Number.isInteger

4. Numeric operations and methods
- Math.* for operations (Math.floor, Math.ceil, Math.round, Math.trunc, Math.abs, Math.pow, Math.sqrt)
- toFixed(digits), toExponential, toPrecision

5. Special numeric values
- NaN: not-equal to itself; use Number.isNaN to detect
- ±Infinity: results of overflow or division by zero

6. Precision and limits
- Integer-safe range: Number.isSafeInteger and Number.MAX_SAFE_INTEGER (2^53 - 1)
- Floating point rounding issues: prefer integer arithmetic or BigInt where exact integers beyond safe range are required

7. Supplementary details
- Use BigInt for exact integer arithmetic beyond 2^53-1
- Use Number.EPSILON-aware comparisons for floating equality checks

8. Reference details
- Method signatures:
  Number.isNaN(value) -> boolean
  Number.isInteger(value) -> boolean
  Number.parseInt(string, radix?) -> number
  Number.prototype.toFixed(fractionDigits) -> string

9. Digest
Source: MDN Number reference page. Retrieved: 2026-03-14
Attribution: MDN Web Docs
Data size fetched: ~173KB raw HTML
