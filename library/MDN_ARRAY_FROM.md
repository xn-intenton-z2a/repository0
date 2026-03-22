MDN_ARRAY_FROM

Table of contents:
- Signature
- Parameters and their semantics
- Return value
- Use-cases for sequence generation
- Implementation patterns for FizzBuzz
- Supplementary details
- Detailed digest and retrieval info

NORMALISED EXTRACT
Signature
Array.from(arrayLike[, mapFn[, thisArg]]) -> Array

Parameters and their semantics
- arrayLike: An array-like or iterable object to convert. An array-like object is any object that has a non-negative integer "length" property and indexed elements (0..length-1), or an iterable providing values via the iterator protocol.
- mapFn (optional): A mapping function called for every element with signature (element, index) and returning the mapped value. If provided, mapFn is invoked on each element of the new array.
- thisArg (optional): Value to use as this when executing mapFn.

Return value
- A new Array instance populated with values taken from arrayLike, transformed by mapFn if provided.

Use-cases for sequence generation
- Generate numeric sequences without loops using array-like length: Array.from({ length: n }, (_, i) => i + 1) produces the sequence 1..n (note: underscores denote unused first parameter). This pattern creates an array of length n and maps each index to the desired value.

Implementation patterns for FizzBuzz
- Use Array.from({ length: n }, (_, i) => i + 1) to obtain 1..n and then map each value using fizzBuzzSingle to produce the final array; or iterate with a plain for loop when explicit control is desired.

SUPPLEMENTARY DETAILS
- Array.from does not mutate the original arrayLike; it always returns a new Array.
- When arrayLike is iterable (for..of), elements are taken from the iterator rather than using length/index access.
- Map function is applied after elements are read from arrayLike; sparse arrays produce undefined for missing indexes when using array-like objects with a length property.

REFERENCE DETAILS
Exact method signature and parameter descriptions:
- Function: Array.from(arrayLike[, mapFn[, thisArg]])
  - arrayLike: ArrayLike<T> | Iterable<T>
  - mapFn?: (value: T, index: number) => U
  - thisArg?: any
  - returns: Array<U>
Behavioral notes:
- If mapFn is provided it is called with two arguments (element, index) and its return values become the entries in the returned array.
- For objects with a length property: the returned array has length equal to ToLength(length) and indexes 0..length-1 are read via [[Get]] semantics.

DETAILED DIGEST
Relevant extracted technical material retrieved: 2026-03-22
- MDN documents the exact function signature, the optional map function semantics and examples showing Array.from used to create sequences and to map values as part of the creation operation.

ATTRIBUTION AND CRAWL SIZE
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
Retrieved: 2026-03-22
Bytes downloaded during crawl: 166362

IMPLEMENTATION EXAMPLE (plain-text example)
- Sequence generation: to create numbers 1..n, map indexes to their 1-based values via Array.from with a short mapping function; then map those numbers to Fizz/Buzz strings using the fizzBuzzSingle function described in project requirements.