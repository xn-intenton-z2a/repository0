NORMALISED EXTRACT

Table of contents
- Definition
- When to throw RangeError
- Construction and message conventions

Definition
- RangeError is a built-in Error subtype used when a numeric value is outside the allowed range or the result of a numeric operation is not in range.

When to throw RangeError (actionable guidance)
- For fizzBuzz: throw RangeError when n < 0 or when n is not a safe/finite integer suitable for array construction.
- Provide a clear message string containing the parameter name and expected range, e.g. 'n must be >= 0'.

Construction and message conventions
- Create with: throw new RangeError(message)
- The message should be short, machine-friendly, and test-friendly (used in unit tests via toThrow or toThrowError matching).

SUPPLEMENTARY DETAILS
- RangeError.prototype.name === 'RangeError'
- RangeError is appropriate for numeric range violations; TypeError is for wrong-type inputs.

REFERENCE DETAILS
- Constructor signature: RangeError([message]) -> RangeError
- Use in tests: expect(() => fn()).toThrow(RangeError) or toThrow('n must be >= 0') if matching message.

DETAILED DIGEST
- MDN RangeError page documents the purpose, native constructor, prototypes, and examples of when RangeError is used.
- Retrieval date: 2026-03-21
- Data size obtained during crawling: 155937 bytes

ATTRIBUTION
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- Retrieved: 2026-03-21
- Content-Length (reported by server): 155937 bytes
