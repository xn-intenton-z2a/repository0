MDN_ARRAY

Normalised extract:
- Method: Array.prototype.map(callbackFn[, thisArg]) -> Array
- Callback signature: callbackFn(currentValue, index, array) -> mappedValue
- map returns a new array of same length; callback runs for each index that exists on the original array (sparse holes are skipped by spec)

Table of contents:
1. Signature
2. Callback contract
3. Behavior with sparse arrays
4. Implementation patterns useful for FizzBuzz

Details:
1. Signature
   - arr.map(callbackFn, thisArg?) -> Array
   - Returns a new array containing results of calling callbackFn for each present index.

2. Callback contract
   - callbackFn is called with (currentValue, index, array)
   - The return value from callbackFn is used as the element in the returned array

3. Behavior with sparse arrays
   - map does not call the callback for indices that are not present (array holes); returned array preserves holes at same indices.
   - For deterministic mapping over 1..n use Array.from({ length: n }, (_, i) => ...) or create an array filled with values before mapping.

4. Implementation patterns for FizzBuzz
   - Safe pattern: Array.from({ length: n }, (_, i) => fizzBuzzSingle(i + 1)) to produce a length-n array.
   - Alternative: for loop pushing results into an array; this avoids sparse-array pitfalls.

Supplementary details:
- Complexity: O(n) time to map n elements; O(n) additional memory for returned array.
- Do not rely on new Array(n).map(...) without filling: new Array(n) creates holes and map callback will not execute.

Reference details (API spec):
- Method: Array.prototype.map(callbackFn: function, thisArg?: any) -> Array
- Callback parameters: (currentValue: any, index: number, array: Array) -> any
- Returns: new Array where element i is callbackFn(original[i], i, original)

Detailed digest:
- Source: MDN "Array.prototype.map()" (developer.mozilla.org)
- Retrieval date: 2026-03-21
- Bytes fetched during crawl: 170168

Attribution:
- MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
