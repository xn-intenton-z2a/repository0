TABLE OF CONTENTS
1. Overview
2. Array constructor and literal
3. Common instance methods
4. Static methods
5. Iteration and traversal
6. Mutating vs non-mutating methods
7. Performance and implementation notes
8. Supplementary details
9. Reference details
10. Digest

1. Overview
Array: ordered list of values indexed by non-negative integers; length property tracks highest index+1; elements may be holes (sparse arrays).

2. Array constructor and literal
- Literal: [] and [a,b]
- Constructor: new Array(length) creates sparse array when length provided; new Array(...items) when multiple args

3. Common instance methods
- push(...items): append, returns new length
- pop(): remove last, returns removed
- shift(), unshift()
- slice(start,end): non-mutating copy of subarray
- splice(start, deleteCount, ...items): mutating insert/delete
- indexOf(value), includes(value)
- concat(...arraysOrValues)

4. Static methods
- Array.isArray(obj): boolean
- Array.from(iterableOrArrayLike, mapFn?, thisArg?) -> new Array
- Array.of(...items) -> new Array

5. Iteration and traversal
- forEach(callback, thisArg)
- map(callback), filter(callback), reduce(callback, initial), reduceRight
- entries(), keys(), values(), [Symbol.iterator]() yields values

6. Mutating vs non-mutating methods
- Mutating: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin
- Non-mutating: slice, map, filter, concat, join, reduce

7. Performance and implementation notes
- Avoid using sparse arrays for performance-sensitive code; dense arrays with contiguous integer keys perform best in JS engines
- Use push/pop for stack-like operations; shift/unshift are O(n)
- Methods that copy (slice, concat) allocate new arrays

8. Supplementary details
- length property auto-updates; setting length shorter truncates array
- array[largeIndex]=value grows length to largeIndex+1, may create sparse arrays

9. Reference details
- Method signatures:
  Array.prototype.push(...items) -> number
  Array.prototype.pop() -> any
  Array.prototype.slice(start=0, end=length) -> Array
  Array.from(iterableOrArrayLike, mapFn?, thisArg?) -> Array
  Array.prototype.map(callback(currentValue, index, array), thisArg?) -> Array
  Reduce signatures: arr.reduce((acc, val, idx, arr) => acc, initial)

10. Digest
Source: MDN Array reference page. Retrieved: 2026-03-14
Attribution: MDN Web Docs
Data size fetched: ~237KB raw HTML
