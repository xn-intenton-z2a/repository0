Title: MATH
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math

TABLE OF CONTENTS:
1. Overview
2. Constants
3. Method categories
4. Method signatures (detailed)
5. Edge cases and numeric semantics
6. Supplementary details
7. Reference details (explicit signatures)
8. Detailed digest (retrieval metadata)
9. Attribution

NORMALISED EXTRACT:
Overview:
- Math is a built-in global object (not a constructor). All properties and methods are static: access via Math.<name>.
- Inputs are coerced using ECMAScript ToNumber semantics; outputs are Numbers (IEEE 754 double precision) unless otherwise specified.

Constants (exact numeric values):
- Math.E = 2.718281828459045
- Math.LN2 = 0.6931471805599453
- Math.LN10 = 2.302585092994046
- Math.LOG2E = 1.4426950408889634
- Math.LOG10E = 0.4342944819032518
- Math.PI = 3.141592653589793
- Math.SQRT1_2 = 0.7071067811865476
- Math.SQRT2 = 1.4142135623730951

Method categories (groups of related functions):
- Absolute/Sign: abs, sign
- Trigonometry: sin, cos, tan, asin, acos, atan, atan2, sinh, cosh, tanh, asinh, acosh, atanh
- Exponentials & logarithms: exp, expm1, log, log1p, log10, log2, pow, sqrt, cbrt
- Rounding & integer ops: ceil, floor, round, trunc, fround, imul, clz32
- Aggregates: max, min, hypot
- Random: random

METHOD SIGNATURES (concise actionable list):
- Math.abs(x: number) -> number
  Returns the absolute value. NaN -> NaN; -0 -> +0.

- Math.sign(x: number) -> number
  Returns 1, -1, +0, -0 or NaN to indicate the sign of x.

- Math.max(...values: number[]) -> number
  Returns the largest numeric value. If no arguments -> -Infinity. If any argument is NaN, result is NaN.

- Math.min(...values: number[]) -> number
  Returns the smallest numeric value. If no arguments -> +Infinity. If any argument is NaN, result is NaN.

- Math.floor(x: number) -> number
  Returns largest integer <= x.

- Math.ceil(x: number) -> number
  Returns smallest integer >= x.

- Math.round(x: number) -> number
  Rounds to nearest integer; ties to +Infinity (i.e., 0.5 -> 1).

- Math.trunc(x: number) -> number
  Truncates fractional part toward zero.

- Math.fround(x: number) -> number
  Rounds to nearest 32-bit float and returns Number value representing that float.

- Math.imul(a: number, b: number) -> number
  Returns the result of a 32-bit C-like multiplication of the two 32-bit integers.

- Math.clz32(x: number) -> number
  Returns the count of leading zero bits in the 32-bit binary representation of x.

- Math.hypot(...values: number[]) -> number
  Returns sqrt(sum(values[i]^2)). If any arg is Infinity return Infinity; NaN behavior per spec.

- Math.pow(base: number, exp: number) -> number
  Equivalent to base ** exp (with IEEE 754 rules). Edge cases: 0 ** 0 -> 1 per spec.

- Math.sqrt(x: number) -> number
  Square root. x < 0 -> NaN.

- Math.cbrt(x: number) -> number
  Cube root (including negative inputs).

- Math.exp(x: number) -> number
  e**x.

- Math.expm1(x: number) -> number
  Returns e**x - 1 with precision for small x.

- Math.log(x: number) -> number
  Natural logarithm. x <= 0 -> NaN (x === 0 -> -Infinity).

- Math.log1p(x: number) -> number
  Returns ln(1 + x) with precision for small x.

- Math.log10(x: number) -> number
  Base-10 logarithm.

- Math.log2(x: number) -> number
  Base-2 logarithm.

- Math.random() -> number
  Returns a pseudo-random number in the range [0, 1). Do not use for cryptographic purposes.

- Trigonometric signatures follow the pattern: Math.sin(x: number) -> number, Math.cos(x) -> number, Math.tan(x) -> number, etc. Inverse and hyperbolic variants accept and return numbers in radians.

EDGE CASES AND NUMERIC SEMANTICS:
- ToNumber conversion: all Math methods first coerce inputs using ToNumber; non-coercible values become NaN.
- IEEE 754 semantics apply: NaN propagates, Infinity and -Infinity behave as per mathematical extension.
- Signed zero: operations distinguish +0 and -0 in some outputs (e.g., 1 / -Infinity => -0 behavior in intermediate steps); many results preserve +0.

SUPPLEMENTARY DETAILS:
- Math is specified in ECMAScript (ECMA-262). Implementations must follow the spec-defined algorithms for functions such as clz32 and imul to preserve cross-engine compatibility.
- For high-precision needs, use dedicated big-number libraries; Math operates on double-precision floats only.

REFERENCE DETAILS (explicit signatures and short descriptions):
List below is a machine-friendly reference of commonly used methods and their exact parameter / return types.
- Math.abs(x: number) -> number
- Math.acos(x: number) -> number
- Math.acosh(x: number) -> number
- Math.asin(x: number) -> number
- Math.asinh(x: number) -> number
- Math.atan(x: number) -> number
- Math.atan2(y: number, x: number) -> number
- Math.atanh(x: number) -> number
- Math.cbrt(x: number) -> number
- Math.ceil(x: number) -> number
- Math.clz32(x: number) -> number
- Math.cos(x: number) -> number
- Math.cosh(x: number) -> number
- Math.exp(x: number) -> number
- Math.expm1(x: number) -> number
- Math.floor(x: number) -> number
- Math.fround(x: number) -> number
- Math.hypot(...values: number[]) -> number
- Math.imul(a: number, b: number) -> number
- Math.log(x: number) -> number
- Math.log1p(x: number) -> number
- Math.log10(x: number) -> number
- Math.log2(x: number) -> number
- Math.max(...values: number[]) -> number
- Math.min(...values: number[]) -> number
- Math.pow(base: number, exponent: number) -> number
- Math.random() -> number
- Math.round(x: number) -> number
- Math.sign(x: number) -> number
- Math.sin(x: number) -> number
- Math.sinh(x: number) -> number
- Math.sqrt(x: number) -> number
- Math.tan(x: number) -> number
- Math.tanh(x: number) -> number
- Math.trunc(x: number) -> number

DETAILED DIGEST (crawl metadata):
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
- Retrieved: 2026-03-15 (UTC)
- Crawled byte-size: 160491 bytes (HTML)

ATTRIBUTION:
Content extracted from MDN Web Docs (Mozilla) — page: Global_Objects/Math — retrieved 2026-03-15. Use MDN license and attribution if republishing raw content.