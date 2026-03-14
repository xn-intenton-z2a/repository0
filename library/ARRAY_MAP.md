TITLE: ARRAY_MAP

TABLE OF CONTENTS:
- Signature
- Callback signature
- Behaviour and return value
- Sparse arrays and holes
- Complexity
- Examples of use patterns
- Detailed digest
- Attribution

NORMALISED EXTRACT:
Signature: Array.prototype.map(callbackFn[, thisArg]) -> new Array
Callback signature: callbackFn(element, index, array) -> returnValue
Behaviour: Calls callback for each element present in the array in ascending index order and constructs a new array of the same length populated with the callback return values for indices that existed on the source array. Does not iterate over deleted or uninitialised holes.
Return: A new array where each element is the result of callback applied to the corresponding element of the source array. The new array length equals the original array's length.

EDGE CASES & DETAILS:
- If callback modifies the original array during mapping, behavior follows spec: elements added beyond the original length are not visited; elements modified before being visited are visited with their newest value.
- Map skips holes in sparse arrays (i.e., if index is not present, callback is not invoked for that index).

PERFORMANCE:
- Time: O(n) for n elements visited (sparse arrays reduce actual callback invocations).
- Memory: O(n) for returned array.

DETAILED DIGEST (MDN snapshot ~170.7 KB, retrieved 2026-03-14):
- MDN contains signature, examples, and precise semantics for holes and callback invocation order. Retrieved 2026-03-14.

ATTRIBUTION:
Source: MDN Array.prototype.map. Data size: ~170.7 KB. Retrieved: 2026-03-14.
