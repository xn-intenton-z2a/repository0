MDN_NUMBER

Normalised extract:
- Signature: Number.isInteger(number) -> boolean
- Behavior: Returns true iff the input is a JavaScript number and has no fractional component; specifically: typeof number === "number" AND isFinite(number) AND Math.trunc(number) === number.
- False for NaN, Infinity and non-number values; negative zero is treated as an integer by this test.
- Primary use: integer input validation for APIs that require integers.

Table of contents:
1. Signature
2. Semantics
3. Edge cases
4. Polyfill
5. Usage for input validation

Details:
1. Signature
   - Number.isInteger(number) -> boolean
   - Parameter: number (any value)
   - Return: boolean indicating whether parameter is an integer number

2. Semantics
   - The method performs a strict numeric check; it does not coerce strings or other types.
   - Under the spec it checks numeric type, finiteness and whether the value is mathematically integral.

3. Edge cases
   - Number.isInteger(NaN) => false
   - Number.isInteger(Infinity) => false
   - Number.isInteger('3') => false
   - Number.isInteger(-0) => true

4. Polyfill
   - Polyfill pattern: typeof v === 'number' && isFinite(v) && Math.floor(v) === v (or Math.trunc(v) === v).
   - Use the polyfill only for environments lacking Number.isInteger.

5. Usage for input validation
   - In fizzBuzz functions: if (!Number.isInteger(n)) throw new TypeError('n must be an integer');

Supplementary details:
- Complexity: constant-time check per value.
- Implementation note: prefer Number.isInteger for clarity and spec-correctness; polyfill uses Math.floor/Math.trunc and isFinite when needed.

Reference details (API specification):
- Method: Number.isInteger(number: any) -> boolean
- Parameters:
  - number: any value to be tested for integer-ness
- Return type: boolean
- Example behaviors: Number.isInteger(3) -> true; Number.isInteger(3.0) -> true; Number.isInteger(3.1) -> false

Detailed digest:
- Source: MDN "Number.isInteger()" (developer.mozilla.org)
- Retrieval date: 2026-03-21
- Bytes fetched during crawl: 154170

Attribution:
- MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
