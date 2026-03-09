NORMALISED EXTRACT

NORMALISED EXTRACT

Table of Contents:
1. RangeError definition
2. Construction and properties
3. Common use cases
4. Implementation and throw patterns

1. RangeError definition
- RangeError is a built-in Error subtype in JavaScript that indicates a numeric value is outside the allowable range of values for an operation.

2. Construction and properties
- Constructor: new RangeError(message?: string)
- Prototype chain: RangeError -> Error -> Object
- Typical properties: name = 'RangeError', message string, stack trace

3. Common use cases
- Passing an invalid length to Array.prototype methods
- Invalid numeric arguments (e.g., invalid radix passed to parseInt-like functions, out-of-range indices, invalid repeat counts)
- Explicit parameter validation when value is numeric and does not meet constraints

4. Implementation and throw patterns
- Validate input and throw new RangeError('explanatory message') when numeric precondition fails
- For public API, include parameter name and expected range in message to aid debugging (e.g., "n must be an integer >= 1")

SUPPLEMENTARY DETAILS

- RangeError is intended for numeric domain violations; use TypeError for wrong types and Error for generic failures
- When creating errors for libraries, preserve original error stack when wrapping by setting cause in environments that support Error options

REFERENCE DETAILS

Signature:
- constructor RangeError(message?: string)
- properties: name: 'RangeError', message: string, stack?: string

Best practice examples:
- if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be an integer >= 1');
- Provide clear user-facing messages without exposing internal state

DETAILED DIGEST

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
Retrieved: 2026-03-09
Extracted technical content: constructor signature, intended use cases, message conventions
Data size obtained: ~7 KB
Attribution: MDN Web Docs, Mozilla
