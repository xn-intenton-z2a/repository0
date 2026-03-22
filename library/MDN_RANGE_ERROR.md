MDN_RANGE_ERROR

Table of contents:
- Purpose and description
- Constructor and signature
- When to throw RangeError
- Recommended error messages and patterns
- Detailed digest and retrieval info

NORMALISED EXTRACT
Purpose
- RangeError indicates a numeric value is outside of the allowable range for a given operation.

Constructor and signature
- new RangeError([message]) -> RangeError object
- RangeError.prototype.name === "RangeError"

When to throw RangeError (implementation guidance)
- Use for numeric arguments that fall outside valid bounds (for this mission: negative n when only non-negative integers accepted).
- Example pattern (plain text): when n < 0 throw new RangeError("n must be a non-negative integer");
- Use RangeError for domain/range violations, not for type mismatches (use TypeError for wrong types).

Recommended error messages and patterns
- Keep messages short and explicit: "n must be a non-negative integer" or "n must be an integer >= 0".
- Consumers can test error types via instanceof RangeError or error.name === "RangeError".

DETAILED DIGEST
Extracted technical content retrieved: 2026-03-22
- MDN documents RangeError semantics, constructor signature, and use cases where numeric arguments are out of range.

ATTRIBUTION AND CRAWL SIZE
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
Retrieved: 2026-03-22
Bytes downloaded during crawl: 155933