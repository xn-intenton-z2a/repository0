NORMALISED EXTRACT

Concept: RangeError (JavaScript built-in)

Definition
RangeError is a standard built-in error type thrown when a value is not in the set or range of allowed values (for example, invalid array length, numeric argument out of range).

Table of contents
1. Construction and signature
2. Typical causes
3. Handling patterns

Detailed technical content
1. Construction and signature
- Create using new RangeError(message)
- RangeError.prototype.name === 'RangeError'

2. Typical causes
- Passing an out-of-range numeric argument to built-in APIs (e.g., new Array(-1), typed array length out of range).
- Numeric parameter outside allowed range for a function.

3. Handling patterns
- Throw RangeError when an input numeric parameter falls outside documented bounds (e.g., negative n for fizzBuzz when negative inputs are forbidden).
- Catch patterns: try { ... } catch (err) { if (err instanceof RangeError) { /* handle */ } else { throw err } }

SUPPLEMENTARY DETAILS

Mission-specific usage
- For fizzBuzz, if n < 0, throw new RangeError('n must be non-negative integer'); ensure callers can distinguish RangeError from TypeError for non-integers.

REFERENCE DETAILS

Exact usage
- new RangeError(message) -> RangeError instance
- Property: name = 'RangeError'

Detailed digest
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- Retrieved: 2026-03-18
- Bytes downloaded during crawl: 155931

Attribution
Content condensed from MDN Web Docs RangeError documentation.