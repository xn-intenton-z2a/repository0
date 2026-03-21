MDN_RANGE_ERROR

Normalised extract:
- Constructor: new RangeError([message]) -> RangeError instance
- Purpose: indicate a numeric value is outside the expected range or set of acceptable values.
- Typical use: throw new RangeError('value out of range') when numeric input violates preconditions.

Table of contents:
1. Constructor and signature
2. Typical semantics
3. Properties
4. Usage guidance

Details:
1. Constructor and signature
   - new RangeError([message]) creates a RangeError object which inherits from Error.
   - Parameter: optional message string
   - Result: RangeError object with name property 'RangeError' and message

2. Typical semantics
   - RangeError is not used for type mismatches; use TypeError for non-numeric or wrong-type inputs.
   - Use RangeError when a numeric value is outside the allowed interval (for example negative where only non-negative allowed).

3. Properties
   - .name === 'RangeError'
   - .message is the supplied message (or empty string if not provided)
   - It is an instance of Error (instanceof Error is true)

4. Usage guidance
   - In fizzBuzz: if (n < 0) throw new RangeError('n must be non-negative');
   - Combine with a TypeError check first for non-integers.

Reference details:
- Constructor signature: RangeError([message?: string]) -> RangeError
- Example: throw new RangeError('n must be >= 0')

Detailed digest:
- Source: MDN "RangeError" (developer.mozilla.org)
- Retrieval date: 2026-03-21
- Bytes fetched during crawl: 155937

Attribution:
- MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
