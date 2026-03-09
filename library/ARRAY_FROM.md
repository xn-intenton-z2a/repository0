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
- Map function call order: sequential from index 0 upward; mapping can mutate the source but iterator semantics apply for iterables.
- Construction: new Array with length 0, push/set by index to avoid side-effect on constructor-provided species.

REFERENCE DETAILS

API signature: Array.from(source, mapFn?, thisArg?) -> Array
Parameters:
- source: any (array-like or iterable)
- mapFn: function? (value, index) -> any
- thisArg: any
Return type: Array<any>

Exact behavior notes:
- Throws TypeError if source is null/undefined.
- Throws TypeError if mapFn provided and typeof mapFn !== 'function'.
- Iteration uses source[Symbol.iterator] when present; otherwise reads length and numeric properties.
- Mapping uses OrdinaryCall, with thisArg as provided.

TROUBLESHOOTING

- If Array.from([...]) returns unexpected values, verify whether source is iterable or array-like; inspect Symbol.iterator.
- If mapFn not invoked, ensure it is a function and not undefined.
- For performance, when source is array, prefer slice or spread for shallow copy instead of Array.from with mapping.

DIGEST

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
Retrieved: 2026-03-09
Size: small (single MDN reference)

ATTRIBUTION

Content adapted from MDN Web Docs (developer.mozilla.org) and ECMAScript specification concepts. Data size: ~1 page equivalent.