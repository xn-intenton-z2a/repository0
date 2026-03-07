DOCUMENT: ARRAY_MAP

Table of Contents
1. Purpose and behaviour
2. Signature and parameters
3. Operational semantics (step-by-step)
4. Return value and shape transformations
5. Edge cases and holes (sparse arrays)
6. Side effects and order of execution
7. Performance considerations
8. Supplementary details (specs, types)
9. Reference details (method signature, parameters, return types, examples)
10. Digest and retrieval metadata
11. Attribution and data size

1. Purpose and behaviour
Array.prototype.map creates a new array populated with the results of calling a provided function on every element in the calling array. It does not mutate the original array and always returns a new Array object whose length is equal to the original array's length.

2. Signature and parameters
map(callbackfn[, thisArg])
- callbackfn: function(currentValue, index, array) -> any
  - currentValue: element value at the time of invocation
  - index: numeric index of the element
  - array: the array map was called upon
- thisArg (optional): value to use as this when executing callbackfn

3. Operational semantics (step-by-step)
1. Let O be ToObject(this value).
2. Let len be ToLength(Get(O, "length")).
3. If IsCallable(callbackfn) is false, throw a TypeError.
4. Create A, a new Array with length len.
5. For k from 0 to len - 1, do:
   a. If k is present as a property of O (k in O):
      i. Let kValue = Get(O, k).
      ii. Let mappedValue = Call(callbackfn, thisArg, kValue, k, O).
      iii. Create or set property k of A to mappedValue.
   b. Else (property absent): do not create property k on A (preserve sparseness).
6. Set A.length to len.
7. Return A.

4. Return value and shape transformations
- Returned array A has the same length as the original, but may be sparse in the same positions where the source had holes; map does not compact or re-index.
- Elements are the mapped results in the same index positions.
- If callbackfn returns undefined for some index, the corresponding slot is created with value undefined (distinct from being a hole).

5. Edge cases and holes (sparse arrays)
- For indices where the source array has no property (holes), map skips calling the callback and leaves the result array with a hole at that index.
- If the callback adds or deletes properties on the source array during iteration, iteration uses the length fixed at step 2 and checks property presence per iteration step; newly added indices within the original length will be visited if present when reached.
- Non-integer lengths are coerced via ToLength; length values larger than 2^53-1 will be clamped.

6. Side effects and order of execution
- Iteration order is ascending numeric index order from 0 to len-1.
- callbackfn is invoked synchronously and sequentially for each present index.
- If the callback mutates the source array, effects may be observed by subsequent iterations (reads check property presence per index at time of visit).

7. Performance considerations
- map allocates a new array of length len up-front; large lengths allocate correspondingly large memory even if many holes remain.
- For heavy transformations avoid additional allocations in callback; prefer in-place pooled objects when safe.
- Sparse arrays preserve holes which can be beneficial for memory density in some engines but may cost checks during iteration.

8. Supplementary details (specs, types)
- ECMAScript specification: Abstract operations used: ToObject, ToLength, Get, IsCallable, Call, CreateDataPropertyOrThrow.
- Type behaviour: callbackfn may return any ECMAScript value; resulting array element type is the returned value.
- Throws: TypeError if callbackfn is not callable.

9. Reference details (method signature, parameters, return types, examples)
Method signature:
- Array.prototype.map(callbackfn: (currentValue: any, index: number, array: any[]) => any, thisArg?: any) => any[]
Parameter effects:
- callbackfn: must be callable; receives (value, index, array). Use index and array for context-sensitive transforms.
- thisArg: used as the callback's this binding; if omitted, undefined in strict mode becomes undefined, in non-strict becomes global object.
Return behavior:
- Always returns a new Array object with length equal to the original length.
- Sparse preservation: absence of property in source results in absence in target.
Examples (conceptual - no code):
- Map numeric array to boolean parity using index-insensitive transform.
- Project object arrays to a property value using callback that accesses element[propertyName].

10. Digest and retrieval metadata
- Source: MDN Web Docs — Array.prototype.map
- Retrieved: 2026-03-07T02:23:14.092Z
- Extract focuses on operational semantics and exact step order from ECMAScript algorithm as expressed by MDN's specification-aligned documentation.

11. Attribution and data size
- Attribution: MDN Web Docs (developer.mozilla.org)
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- Data size extracted: approximately 6 KB (condensed authoritative extract)
