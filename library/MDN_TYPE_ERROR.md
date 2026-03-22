MDN_TYPE_ERROR

Table of contents:
- Constructor signature
- Semantics and when to throw
- Differences vs RangeError
- Implementation patterns for validation
- Supplementary details
- Reference details (exact API)
- Detailed digest and retrieval info
- Attribution and data size

NORMALISED EXTRACT
Constructor signature
new TypeError([message]) -> TypeError object
TypeError.prototype.name === "TypeError"

Semantics and when to throw
- TypeError signals that a value is not of the expected type or a required operation cannot be performed on the provided value.
- Typical mission usage: throw TypeError when an input is not the expected JavaScript type (for example non-number or non-integer input value for a numeric parameter).
- Example validation pattern (plain-text): if (!Number.isInteger(n)) throw new TypeError("n must be an integer");

Differences vs RangeError
- Use TypeError for type mismatches and RangeError for numeric values outside an allowed range. For this mission: non-integers -> TypeError; negative integers -> RangeError.

Implementation patterns for validation
- Validate type first: if (typeof n !== 'number' || !Number.isInteger(n)) throw new TypeError("n must be an integer");
- Validate range second: if (n < 0) throw new RangeError("n must be a non-negative integer");
- Consumers can detect errors via instanceof TypeError or error.name === "TypeError".

SUPPLEMENTARY DETAILS
- The constructor accepts an optional message string which becomes error.message.
- The runtime may provide a stack trace property; do not rely on stack for program logic.

REFERENCE DETAILS (exact API)
- Global constructor: TypeError([message])
  - Parameters: message: string (optional)
  - Returns: TypeError instance (object with name "TypeError" and message string)
- Detection: instanceof TypeError, or error.name === "TypeError"

DETAILED DIGEST
Extracted technical content retrieved: 2026-03-22
- MDN documents the TypeError constructor, use cases (type mismatch), and recommended usage patterns for validation. For mission implementation use TypeError when inputs are of an incorrect type (non-number or non-integer), and reserve RangeError for out-of-range numeric values.

ATTRIBUTION AND CRAWL SIZE
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
Retrieved: 2026-03-22
Bytes downloaded during crawl: 154126
