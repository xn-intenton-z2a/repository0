NORMALISED EXTRACT

Table of Contents:
1. Purpose and behavior
2. Signature and parameters
3. Algorithmic steps
4. Edge cases and errors

1. Purpose and behavior
Array.from creates a new Array instance from an array-like or iterable object. It returns a new, shallow-copied Array whose elements are taken from the source in insertion order.

2. Signature and parameters
Array.from(source[, mapFn[, thisArg]])
- source: an array-like object (has length property and numeric indices) or an iterable (implements @@iterator).
- mapFn (optional): function to call on each element before adding to the new array. Called as mapFn(element, index).
- thisArg (optional): value to use as this when executing mapFn.

Return: a new Array instance.

3. Algorithmic steps
- If source is null or undefined, throw TypeError.
- If mapFn provided and not callable, throw TypeError.
- If source has an iterator (Symbol.iterator), obtain iterator and repeatedly call next() until done, selecting each value.
- Otherwise treat source as array-like: read length as ToLength(source.length) and for i from 0 to length-1, read source[i].
- For each extracted value, if mapFn provided, compute mapped = Call(mapFn, thisArg, [value, index]) else mapped = value.
- Define and set newArray[index] = mapped.
- Set newArray.length = finalIndex and return newArray.

4. Edge cases and errors
- Non-callable mapFn raises TypeError.
- Sparse array-like sources produce undefined for missing indices; mapping receives undefined for those indices.
- When source is a string, iteration yields Unicode code points (handles surrogate pairs correctly via iterator).
- When source is an object with length exceeding maximum array length, ToLength clamps to 2^53-1 limit.

SUPPLEMENTARY DETAILS

Technical specifications and implementation details:
- ToLength operation: clamp ToInteger(length) between 0 and 2^53-1.
- Iterator protocol: call GetIterator(source) then repeatedly call IteratorNext(iterator) and extract IteratorValue.
- Map function: If provided, invoked with arguments (value, index) and bound to thisArg when specified; mapped result assigned to destination index.
- Length handling: destination array length is set after insertion; holes preserved when source has missing indices.

REFERENCE DETAILS

API signatures and exact behaviour:
- Array.from(source[, mapFn[, thisArg]]) -> Array
Parameters:
- source: ArrayLike<T> | Iterable<T>
- mapFn?: (value: T, index: number) => U
- thisArg?: any
Return: Array<U>

Errors:
- Throws TypeError if source is null or undefined.
- Throws TypeError if mapFn is provided and not callable.

Implementation notes:
- For string sources, iterator yields code points; use [...str] equivalent semantics.
- ToLength uses 2^53-1 clamp; implementations must coerce length via ToInteger then clamp.

DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
Retrieved: 2026-03-09
Size: small (web page)

ATTRIBUTION
Content adapted from MDN Web Docs. Data size: ~1 page equivalent.