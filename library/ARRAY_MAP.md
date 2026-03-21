ARRAY_MAP

NORMALISED EXTRACT

Table of contents:
- Signature
- Callback signature
- Behavior and sparse-arrays
- Complexity

Signature:
- Array.prototype.map(callbackFn, thisArg?) -> new array of mapped values

Callback signature:
- callbackFn(currentValue, index, array) -> returned element placed at same index in result array

Behavior and sparse arrays:
- map calls callbackFn for each index in the original array that has an assigned value; it does not call the callback for indices that are holes (i.e., non-existent elements in sparse arrays).
- The returned array has the same length as the original; holes in the input produce holes in the output at the same indices.
- The original array is not mutated by map.

Performance:
- Time: O(n) (one callback per present element), Space: O(n) for returned array.

REFERENCE DETAILS
- Exact signature: Array.prototype.map<T, U>(callbackFn: (currentValue: T, index: number, array: T[]) => U, thisArg?: any): U[]
- Callback parameters: (currentValue: T, index: number, array: T[]) -> U
- Behavior notes: callback is invoked for each existing element; map returns a new array populated with the returned values.

DETAILED DIGEST (source content summary)
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map (retrieved 2026-03-21)
  - Primary points: map creates a new array populated with the results of calling a provided function on every element in the calling array; description includes callback signature and behavior regarding holes.
  - Retrieval date: 2026-03-21
  - Bytes retrieved during crawl: 170172

ATTRIBUTION
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- Retrieved: 2026-03-21
- Bytes crawled: 170172
