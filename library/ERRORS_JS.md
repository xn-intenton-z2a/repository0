NORMALISED EXTRACT

Table of contents
1. Error classes relevant to input validation
2. When to throw TypeError vs RangeError
3. Constructor semantics and messages
4. Best-practice examples for FizzBuzz

1. Error classes
- TypeError: indicates a value is not of the expected type for an operation; constructor: new TypeError([message])
- RangeError: indicates a numeric value is outside the allowed range or otherwise invalid for a function’s domain; constructor: new RangeError([message])

2. When to throw each
- Throw TypeError when the type or shape of an input is wrong. For example, non-integer values or non-number types passed where an integer is required.
- Throw RangeError when the numeric value is outside an accepted range. For FizzBuzz this includes negative n (n < 0) or optionally n > some configured max.

3. Constructor semantics and messages
- Both constructors accept an optional message and create an instance of Error with name set to the class (TypeError, RangeError).
- Provide explicit messages to aid debugging (e.g., 'n must be an integer' or 'n must be >= 0')

4. Best-practice examples for FizzBuzz (plain text)
- Input validation block: if (!Number.isInteger(n)) throw new TypeError('n must be an integer'); if (n < 0) throw new RangeError('n must be non-negative');
- Tests: expect(() => fizzBuzz(-1)).toThrow(RangeError); expect(() => fizzBuzz(1.2)).toThrow(TypeError)

DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
Retrieved: 2026-03-19
Extract (technical): RangeError is thrown when a value is not in the set or range of allowed values. Use TypeError for incorrect types and RangeError for values outside a function's domain.

ATTRIBUTION
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- Retrieved: 2026-03-19
- Bytes downloaded: 160786
