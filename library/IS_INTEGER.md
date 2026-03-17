NORMALISED EXTRACT:
Function signature and semantics
- Signature: Number.isInteger(value) -> boolean
- Purpose: determine whether the provided argument is an integer value of the Number primitive without type coercion.
- Exact behaviour: returns true if and only if typeof value is "number", value is finite, and the mathematical value is an integer (no fractional component).

TABLE OF CONTENTS:
1. Function signature
2. Definition and algorithm
3. Edge cases and examples
4. Polyfill expression
5. Compatibility and notes

DETAILED CONTENT:
1. Function signature
- Number.isInteger(value): boolean

2. Definition and algorithm
- Preconditions: argument may be any JavaScript value.
- Step-by-step: if typeof value !== "number" return false; if value is NaN or Infinity return false; if Math.trunc(value) === value return true; otherwise return false.
- Equivalent integer test: value === Math.floor(value) for finite non-negative numbers; Math.trunc handles negative integers consistently.

3. Edge cases and examples
- Number.isInteger(3) -> true
- Number.isInteger(3.0) -> true
- Number.isInteger(3.1) -> false
- Number.isInteger(NaN) -> false
- Number.isInteger(Infinity) -> false
- Number.isInteger('3') -> false (no coercion)

4. Polyfill expression (direct implementation as an expression):
Number.isInteger = function(value) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value; }

5. Compatibility and notes
- Does not coerce strings or other primitives; use Number(value) then Number.isInteger if coercion is required.
- Useful when strict integer checks are required (array lengths, integer-based indices, protocol numeric fields).

SUPPLEMENTARY DETAILS:
- Performance: single numeric checks and floor/trunc operation, constant time.
- Validation pattern: when accepting user input, coerce or reject before calling Number.isInteger depending on application policy.

REFERENCE DETAILS (SPEC):
- Parameters: value any JavaScript value.
- Return: boolean true when value is a finite number with no fractional part, false otherwise.
- Implementation note: Math.trunc is recommended for exact integer test because it removes fractional digits consistently for negative values.

DETAILED DIGEST:
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Retrieved: 2026-03-17
Data retrieved: 154.6 KB (HTML)
Extracted technical points: exact return conditions, non-coercion behaviour, polyfill pattern, representative examples.

ATTRIBUTION:
Content extracted and condensed from MDN Web Docs (Number.isInteger). Data size obtained during crawling: 154.6 KB.