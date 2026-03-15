ARRAY_MAP

Table of contents
- Purpose and behavior
- Method signature and parameters
- Iteration semantics and sparse arrays
- Return value and side effects
- Common mistakes and performance notes

Purpose and behavior
Array.prototype.map creates a new array populated with the results of calling a provided callback on every element in the calling array in order.

Method signature and parameters
- map(callbackfn: (currentValue, index, array) => any, thisArg?: any) -> any[]
- callbackfn parameters:
  - currentValue: element at index
  - index: numeric index of element
  - array: reference to source array
- thisArg optional binding for callback's this.

Iteration semantics and sparse arrays
- map visits indices that exist on the array. For sparse arrays holes are skipped and no callback call for missing indices occurs. - map does not mutate the source array but callbacks may mutate it during iteration which can affect later iterations.

Return value and side effects
- Returns a new array of same length as the original where each present index contains the callback return value. - If callback throws, map propagation bubbles the exception.

Common mistakes and performance notes
- Do not use map when you only intend to iterate for side effects use forEach instead. - For large N prefer preallocating maps using Array.from with mapping function to reduce intermediate allocations when appropriate.

Reference details
- Signature: Array.prototype.map(callbackfn, thisArg?) -> Array
- Callback signature: (value: any, index: number, array: any[]) => any

Detailed digest
Source: MDN — Array.prototype.map (retrieved 2026-03-15). Raw HTML size: 174830 bytes.

Attribution and crawl data
- MDN Web Docs — Array.prototype.map. Retrieved 2026-03-15. 174830 bytes.
