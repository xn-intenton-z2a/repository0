NORMALISED EXTRACT

Table of contents
1. Array.from
2. Array.prototype.map

1. Array.from
Signature
Array.from(arrayLike[, mapFn[, thisArg]]) -> Array

Parameters
- arrayLike: an Iterable or an array-like object (object with a numeric length property). When iterable, uses the object's iterator; when array-like, reads numeric indices 0..ToLength(length)-1.
- mapFn (optional): function (element, index) -> mappedValue. If provided, called for each produced element in iteration order. Called with thisArg if provided.
- thisArg (optional): value to use as this when calling mapFn.

Return value
- A new Array instance containing values read from arrayLike (possibly transformed via mapFn).

Behavior and implementation notes
- If arrayLike is an iterable, elements are produced by its iterator; if array-like, numeric indices are read using ToLength(length) and Get operations.
- For strings, elements are code units/characters; for objects with non-integer length, ToLength is applied (clamps to non-negative integer).
- If mapFn is provided and is not callable, a TypeError is thrown.
- Errors thrown by mapFn propagate to the caller; no swallowing.
- When called on subclasses (this != Array), the %Array.from% operation uses the this value as the constructor for derived arrays (preserves species behavior in ES spec).

Edge cases
- arrayLike.length negative -> ToLength -> treated as 0.
- Sparse arrays: when creating from an array-like, absent properties are treated the same as reading undefined for that index.

2. Array.prototype.map
Signature
Array.prototype.map(callbackfn[, thisArg]) -> Array

Parameters
- callbackfn: function(currentValue, index, array) -> newValue; called for each present index in the source array.
- thisArg (optional): value used as this when calling callbackfn.

Return value
- A new Array created by mapping each present element of the source array through callbackfn.

Behavior and implementation notes
- map does not mutate the original array; it creates a new array and fills it using callback results.
- callbackfn is called only for elements that exist on the array (i.e., holes are not visited and remain holes in the result).
- The callback receives three arguments: value, index, array (the original array object).
- If callbackfn is not a function, TypeError is thrown.

Reference details (precise signatures)
- Array.from<T, U = T>(arrayLike: Iterable<T> | ArrayLike<T>, mapFn?: (value: T, index: number) => U, thisArg?: any): U[]
- Array.prototype.map<T, U = T>(this: T[], callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[]

Supplementary details
- Use-case for FizzBuzz: generate the 1..n sequence with Array.from({length: n}, (_, i) => i + 1) and map each value to fizzBuzzSingle(i+1). This is idiomatic and avoids manual loops.
- Performance: Array.from with a mapping function performs allocation and mapping in a single pass; map requires an existing array.

Detailed digest and attribution
- Sources fetched: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- Retrieval date: 2026-03-19
- Bytes obtained in crawl (combined pages): 506331 bytes
- Attribution: MDN Web Docs (Mozilla) - refer to original pages for full examples and compatibility tables.