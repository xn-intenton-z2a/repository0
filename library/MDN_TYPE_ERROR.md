NORMALISED EXTRACT

Table of contents
- Definition
- When to throw TypeError
- Construction and usage in tests

Definition
- TypeError is the built-in Error subtype used when a value is not of the expected type or when an operation is not permitted for the given type.

When to throw TypeError (actionable guidance)
- For fizzBuzz and fizzBuzzSingle: throw TypeError when n is not a number primitive or Number.isInteger(n) returns false.
- Use explicit message strings like 'n must be an integer' to make unit tests deterministic.

Construction and usage in tests
- Construct via: throw new TypeError(message)
- Tests typically assert thrown errors using expect(() => fn()).toThrow(TypeError) or toThrow('n must be an integer').

SUPPLEMENTARY DETAILS
- TypeError.prototype.name === 'TypeError'
- Use TypeError for wrong-type semantics; do not conflate with RangeError which is for numeric range violations.

REFERENCE DETAILS
- Constructor signature: TypeError([message]) -> TypeError

DETAILED DIGEST
- MDN TypeError docs describe semantics, construction, and typical usage patterns for built-in TypeError.
- Retrieval date: 2026-03-21
- Data size obtained during crawling: 154126 bytes

ATTRIBUTION
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
- Retrieved: 2026-03-21
- Content-Length (reported by server): 154126 bytes
