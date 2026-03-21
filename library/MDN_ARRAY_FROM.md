NORMALISED EXTRACT
- Signature: Array.from(arrayLike[, mapFn[, thisArg]]) -> Array
- Purpose: Construct a new Array instance from an array-like or iterable object. Optionally map elements with a map function.
- Common use for FizzBuzz: creating a 1..n integer sequence using Array.from({ length: n }, (_, i) => i + 1).

TABLE OF CONTENTS
1. Syntax and parameters
2. Return value and behavior
3. mapFn and thisArg details
4. Implementation patterns for sequence generation

1. Syntax and parameters
- Array.from(arrayLike, mapFn?, thisArg?)
- arrayLike: an array-like object or iterable to convert.
- mapFn: optional function invoked as mapFn(element, index) to produce each element of the new array.
- thisArg: optional this value when invoking mapFn.

2. Return value and behavior
- Returns: a new Array containing the mapped elements.
- Preserves iterator order for iterables; for array-like objects uses numeric indices from 0..length-1.

3. mapFn and thisArg details
- mapFn called for each element with signature (element, index) and its returned value becomes the corresponding element in the result array.
- If mapFn is missing, elements are copied (shallow).

4. Implementation patterns for sequence generation
- Create 1..n: Array.from({ length: n }, (_, i) => i + 1)
- Use in-place mapping to compute Fizz/Buzz/FizzBuzz values: Array.from({ length: n }, (_, i) => fizzBuzzSingle(i+1))

SUPPLEMENTARY DETAILS
- Array.from is ES6; safe to use in Node >=6 with polyfills or in modern Node versions (this repo targets Node >=24).
- Avoid creating huge arrays for large n; memory scales with n.

REFERENCE DETAILS
- Full signature: Array.from(arrayLike[, mapFn[, thisArg]]) -> Array
- Parameters: arrayLike (Array-like or iterable), mapFn (optional Function), thisArg (optional any)
- Returns: Array

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
Retrieved: 2026-03-21
Data size (bytes): 166362
Extracted technical lines: "Array.from() creates a new, shallow-copied Array instance from an array-like or iterable object." (MDN)

ATTRIBUTION
Content derived from MDN Web Docs (Array.from); retrieved 2026-03-21; data size: 166362 bytes.