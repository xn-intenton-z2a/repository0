TABLE OF CONTENTS
1. Purpose
2. API: Number.isInteger
3. Usage details
4. Edge behaviour
5. Examples
6. Supplementary and reference details
7. Digest and retrieval

1. Purpose
Provide exact behaviour and usage of Number.isInteger to validate integer inputs for FizzBuzz functions.

2. API: Number.isInteger(value)
- Signature: Number.isInteger(value)
- Returns: boolean
- Description: returns true if value is of type 'number' and is an integer (no fractional component); false otherwise.

3. Usage details
- To validate input n: if (!Number.isInteger(n)) throw new TypeError('n must be an integer')
- Accepts finite numbers only; NaN and Infinity return false

4. Edge behaviour
- Number.isInteger(3) -> true
- Number.isInteger(3.0) -> true
- Number.isInteger(3.1) -> false
- Number.isInteger('3') -> false
- Number.isInteger(NaN) -> false
- Number.isInteger(Infinity) -> false

5. Examples
- if (!Number.isInteger(n)) throw new TypeError('n must be an integer')

6. Supplementary and reference details
- This is an ES6 standard method available in modern Node.js versions; for older environments a polyfill would be Number.isInteger = function(v) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v; }

7. Digest and retrieval
Source: MDN Number.isInteger
Retrieved: 2026-03-21
Attribution: MDN Web Docs
Data size: small (API reference extraction)
