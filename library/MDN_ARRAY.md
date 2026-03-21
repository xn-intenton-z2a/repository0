Table of contents
1. Core behaviors
2. Creating arrays for output
3. Methods and performance notes
4. Return value formatting
5. Digest and retrieval

1. Core behaviors
- Arrays are ordered lists; length property reflects count of elements.
- For fizzBuzz(n), allocate an array of length n and fill by index.

2. Creating arrays for output
- Use new Array(n) then loop i from 1..n and assign arr[i-1] = computedString
- Or use Array.from({length: n}, (_, idx) => compute(idx+1)) for concise functional implementation

3. Methods and performance notes
- Prefer simple for loops for performance and predictable semantics.
- Using Array.from is acceptable and concise; avoid map on sparse arrays created without elements.

4. Return value formatting
- Each entry must be a string: either 'Fizz', 'Buzz', 'FizzBuzz', or String(i)
- For n === 0 return [] (zero-length array)

5. Digest and retrieval
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
Retrieved: 2026-03-21
Size: MDN HTML retrieved (truncated) ~40KB
Attribution: MDN Web Docs
