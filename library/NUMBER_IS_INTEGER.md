NORMALISED EXTRACT

Table of contents
1. Function signature
2. Exact semantics
3. Examples
4. Use in validation
5. Polyfill notes

1. Function signature
Number.isInteger(value) -> boolean

2. Exact semantics
- Returns true if and only if Type(value) is Number, value is finite, and the mathematical value has no fractional component.
- Equivalently: typeof value === 'number' && isFinite(value) && Math.trunc(value) === value
- Returns false for NaN, Infinity, non-number types (including numeric strings), and fractional numbers.

3. Examples
- Number.isInteger(3) -> true
- Number.isInteger(3.0) -> true
- Number.isInteger(3.1) -> false
- Number.isInteger('3') -> false
- Number.isInteger(NaN) -> false

4. Use in validation
- For the FizzBuzz API validate inputs at the top of each function with: if (!Number.isInteger(n)) throw new TypeError('n must be an integer')
- Avoid relying on typeof alone; Number.isInteger prevents accepting numeric strings or floats.

5. Polyfill notes
- If targeting older environments, polyfill using: typeof value === 'number' && isFinite(value) && Math.trunc(value) === value (Math.trunc can be polyfilled via Math.floor for positives and Math.ceil for negatives).

DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Retrieved: 2026-03-19
Extract (technical): Number.isInteger determines whether the passed value is an integer. It does not coerce the argument; it returns false for non-number types.

ATTRIBUTION
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- Retrieved: 2026-03-19
- Bytes downloaded: 158936
