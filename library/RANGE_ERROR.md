RANGE_ERROR

NORMALISED EXTRACT

Table of contents:
- Constructor signature
- Typical reasons thrown
- Instance properties

Constructor:
- new RangeError([message]) -> RangeError instance

Typical reasons to throw RangeError:
- A numeric value is outside the allowed range for an API (e.g., negative length where only non-negative allowed, invalid array length, numeric overflow in some APIs).
- Use RangeError where value semantics require a value inside a specific numeric domain.

Instance properties and behavior:
- RangeError.prototype.name === 'RangeError'
- message: string (optional)
- Instances inherit from Error

REFERENCE DETAILS
- Constructor signature: RangeError(message?: string) : RangeError
- Best practice: throw RangeError for invalid numeric ranges (for example, throw RangeError when n < 0 in fizzBuzz implementation to indicate an out-of-range numeric argument).

DETAILED DIGEST (source content summary)
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError (retrieved 2026-03-21)
  - Primary points: RangeError is the built-in error type used to indicate a numeric value outside the allowable range for an operation or API.
  - Retrieval date: 2026-03-21
  - Bytes retrieved during crawl: 155931

ATTRIBUTION
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- Retrieved: 2026-03-21
- Bytes crawled: 155931
