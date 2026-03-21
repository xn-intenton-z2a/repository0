NORMALISED EXTRACT
- Constructor: new RangeError([message]) -> RangeError
- Purpose: Built-in error type representing numeric range errors or values outside allowed ranges.
- Usage: Throw when a numeric parameter falls outside the allowed range (e.g., negative array length, negative n where only non-negative allowed).

TABLE OF CONTENTS
1. Constructor and prototype
2. Typical use-cases
3. Behavior and message
4. Example validations

1. Constructor and prototype
- new RangeError(message?) constructs a RangeError object; inherits from Error.

2. Typical use-cases
- Invalid array length (e.g., new Array(-1) throws RangeError in runtime contexts)
- Numeric arguments outside accepted domain

3. Behavior and message
- The instance has name "RangeError" and message property containing the supplied string or empty string if omitted.

4. Example validations
- if (n < 0) throw new RangeError('n must be non-negative');

SUPPLEMENTARY DETAILS
- RangeError is a standard Error subtype in ECMAScript; it should be used consistently for invalid numeric ranges so callers can catch specific error types.

REFERENCE DETAILS
- Signature: RangeError([message]) -> RangeError
- Parameter: message (optional string)
- Returns: RangeError instance

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
Retrieved: 2026-03-21
Data size (bytes): 155937
Extracted technical lines: "The RangeError object indicates an error when a value is not in the set or range of allowed values." (MDN)

ATTRIBUTION
Content derived from MDN Web Docs (RangeError); retrieved 2026-03-21; data size: 155937 bytes.