TITLE: RANGE_ERROR

TABLE OF CONTENTS:
- Constructor signature
- Semantics
- Typical throw sites
- Handling patterns
- Detailed digest
- Attribution

NORMALISED EXTRACT:
Signature: new RangeError([message]) -> RangeError instance
Semantics: RangeError is an Error subtype representing values out of allowable range (e.g., invalid array length, numeric range violations). The instance has properties: name = 'RangeError', message string, and stack.
Typical throw sites: invalid array length (new Array(-1)), numeric operations expecting finite values, APIs that validate numeric ranges for parameters.

HANDLING PATTERNS:
- Validate inputs before performing operations and throw RangeError when the numeric argument is out of domain.
- In JS APIs, prefer returning RangeError via throw new RangeError('reason') for synchronous functions, or rejecting promises with RangeError for async APIs.

DETAILED DIGEST (MDN snapshot ~156.4 KB, retrieved 2026-03-14):
- MDN provides constructor details, examples of throwing and catching RangeError, and best-practice guidance for choosing error types. Retrieved 2026-03-14.

ATTRIBUTION:
Source: MDN RangeError documentation. Data size: ~156.4 KB. Retrieved: 2026-03-14.
