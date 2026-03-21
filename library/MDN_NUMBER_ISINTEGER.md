Table of contents
1. Purpose
2. Method signature
3. Behaviour and examples
4. Edge cases
5. Implementation notes
6. Digest and retrieval

1. Purpose
Number.isInteger(value) determines whether value is an integer (ECMAScript specification semantics: a number with no fractional component and within the safe numeric range for Number type usage for integer checks).

2. Method signature
Number.isInteger(value) -> Boolean
Parameters: value - any JavaScript value
Return: true if typeof value === 'number' and value is finite and floor(value) === value; otherwise false.

3. Behaviour and examples
- Number.isInteger(3) -> true
- Number.isInteger(3.0) -> true
- Number.isInteger(3.1) -> false
- Number.isInteger(NaN) -> false

4. Edge cases
- Non-number types return false (does not coerce). Use Number() explicitly when coercion desired.
- Very large numbers outside IEEE-754 integer representable range may still pass structural integer test (but use safe-integer checks if required).

5. Implementation notes
- For input validation in fizzBuzzSingle and fizzBuzz, call Number.isInteger(n) and throw TypeError when it returns false for non-integers.

6. Digest and retrieval
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Retrieved: 2026-03-21
Size: MDN HTML retrieved (truncated) ~30KB
Attribution: MDN Web Docs
