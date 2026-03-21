MDN_ARRAY_FROM

Table of Contents
- Overview
- Signature
- Parameters
- Behavior and algorithm notes
- Edge cases and types
- Examples (descriptive)
- Implementation patterns for sequence generation
- Reference signatures
- Digest and crawl metadata
- Attribution

Overview
Array.from creates a new, shallow-copied Array instance from an array-like or iterable object. It accepts an optional mapping function and a thisArg for the mapping function.

Signature
- Array.from(arrayLike[, mapFn[, thisArg]]) -> Array

Parameters
- arrayLike: any iterable or array-like object (objects with length property and numeric indices, or iterable objects implementing @@iterator)
- mapFn (optional): function(mapValue, index) -> mappedValue
- thisArg (optional): value to use as "this" when executing mapFn

Behavior and algorithm notes
- When arrayLike is iterable (has Symbol.iterator), Array.from uses iteration to collect values in insertion order.
- When arrayLike is array-like (has length and numeric properties), it reads indices 0..length-1 and coerces length to an integer.
- The mapping function is invoked for each element after retrieval and before assignment to the new array.
- Returns a new Array instance; original arrayLike is not modified.

Edge cases and types
- If arrayLike.length is non-integer, it is converted to an integer via ToLength internal operation (clamped to max safe integer per spec).
- Sparse arrays: holes are mapped as undefined when using array-like input; when using iterables, iterators determine produced values.
- mapFn is invoked with signature mapFn(value, index) and with thisArg if provided.

Implementation patterns for sequence generation
- Generate range 1..n as: Array.from({ length: n }, (_, i) => i + 1)
  - Uses an array-like object with length property; mapFn receives undefined but index is available
- Generate mapped sequences directly from iterables using Array.from(iterable, mapFn)

Reference signatures
- declare function Array.from<T, U = T>(arrayLike: Iterable<T> | ArrayLike<T>, mapFn?: (v: T, k: number) => U, thisArg?: any): U[]

Digest and crawl metadata
- Source section: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
- Retrieved: 2026-03-21
- Bytes downloaded during crawl: 166362 bytes

Attribution
- Source: MDN — Array.from (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from). Retrieved 2026-03-21; crawl size 166362 bytes.
