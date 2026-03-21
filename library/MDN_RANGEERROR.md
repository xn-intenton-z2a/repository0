Table of contents
1. Purpose
2. Constructor and use
3. When to throw
4. Implementation notes
5. Digest and retrieval

1. Purpose
RangeError indicates an error when a value is not in the set or range of allowed values for a function or operation.

2. Constructor and use
new RangeError(message?) -> RangeError object
Typical usage: throw new RangeError('n must be a positive integer')

3. When to throw
- Inputs outside permitted numeric range (e.g., negative where only positive allowed)
- Use RangeError for domain violations distinct from TypeError (type mismatches)

4. Implementation notes
- For mission: when n < 0 in fizzBuzz or fizzBuzzSingle, throw RangeError. For non-integers, throw TypeError (see Number.isInteger doc).

5. Digest and retrieval
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
Retrieved: 2026-03-21
Size: MDN HTML retrieved (truncated) ~32KB
Attribution: MDN Web Docs
