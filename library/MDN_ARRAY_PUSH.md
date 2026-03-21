MDN_ARRAY_PUSH

TABLE OF CONTENTS
- Normalised extract: push behavior
- API signature and return value
- Side effects and complexity
- Usage patterns for building arrays
- Detailed digest (retrieved content)
- Attribution and data size

NORMALISED EXTRACT: PUSH BEHAVIOR
- Array.prototype.push appends one or more elements to the end of an array and returns the new length of the array.
- It mutates the receiver array; it does not create a copy.

API SIGNATURE
- Array.prototype.push(...items): number
  - items: zero or more values to append
  - returns: integer new length of the array after append

SIDE EFFECTS AND COMPLEXITY
- Side effect: modifies the original array in place.
- Complexity: O(k) where k is the number of elements pushed; amortized constant cost per element in typical JS engines.
- Use push when building an array incrementally; prefer pre-sized arrays if extremely large outputs are constructed for micro-optimizations.

USAGE PATTERNS
- Common pattern for fizzBuzz(n): create empty array result = []; for i from 1 to n: result.push(fizzBuzzSingle(i)); return result;
- Avoid repeated string concatenation for array assembly; push then return array.

DETAILED DIGEST (crawled section)
- Key reference: push appends elements to end of array, mutates array, returns new length; examples illustrate multiple argument form and return value.
- Retrieved: 2026-03-21
- Data size obtained: 161842 bytes

ATTRIBUTION
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
- Bytes fetched: 161842
