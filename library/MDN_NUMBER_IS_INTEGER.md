NORMALISED EXTRACT

API: Number.isInteger

Definition and signature
Number.isInteger(number) -> Boolean
- Parameter: number (any value)
- Return: true if the argument is a number primitive and is an integer value; otherwise false.

Table of contents
1. Call signature
2. Detailed behaviour and edge cases
3. Polyfill and implementation notes
4. Supplementary examples and best practices

Detailed technical content
1. Call signature
- Number.isInteger(number)
- Returns true if typeof number === 'number', isFinite(number) and floor(number) === number (or equivalently number % 1 === 0).

2. Behaviour and edge cases
- NaN -> false
- Infinity and -Infinity -> false
- 3.0 -> true (because 3.0 is an integer value)
- 3.1 -> false
- Non-number primitives (string, boolean, undefined, null, BigInt) -> false
- Objects that are number wrappers (new Number(3)) are objects, not primitives; Number.isInteger(new Number(3)) returns false.

3. Polyfill (conceptual)
- Implement as: if (typeof value !== 'number') return false; return isFinite(value) && Math.floor(value) === value;

4. Best practices
- Use Number.isInteger to validate inputs for integer-only APIs.
- Avoid coercing strings to numbers implicitly before validating; perform explicit parsing + validation.

SUPPLEMENTARY DETAILS

Implementation details relevant for the mission
- Use Number.isInteger(n) to check fizzBuzz input validity. If false, throw TypeError.
- Do not accept numeric strings; require number primitives.

REFERENCE DETAILS

Exact signature
- Number.isInteger(number) : boolean

Detailed digest
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- Retrieved: 2026-03-18
- Bytes downloaded during crawl: 154164

Attribution
Content condensed from MDN Web Docs for Number.isInteger.