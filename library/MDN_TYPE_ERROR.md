NORMALISED EXTRACT
- Constructor: new TypeError([message]) -> TypeError
- Purpose: Built-in error type thrown when an operation is applied to a value of an inappropriate type.
- Usage: Throw when n is not a number or not an integer: e.g., throw new TypeError('n must be an integer').

TABLE OF CONTENTS
1. Constructor and prototype
2. When to use TypeError vs RangeError
3. Behavior and message
4. Example checks for FizzBuzz

1. Constructor and prototype
- new TypeError(message?) constructs a TypeError instance; inherits from Error.

2. When to use TypeError vs RangeError
- TypeError: wrong type (e.g., string instead of number).
- RangeError: numeric value outside accepted domain (e.g., negative where only non-negative allowed).

3. Behavior and message
- Instance has name "TypeError" and message property.

4. Example checks for FizzBuzz
- if (typeof n !== 'number' || !Number.isInteger(n)) throw new TypeError('n must be an integer');

SUPPLEMENTARY DETAILS
- Use TypeError to signal incorrect types to callers so they can programmatically distinguish misuse from range violations.

REFERENCE DETAILS
- Signature: TypeError([message]) -> TypeError
- Parameter: message (optional string)
- Returns: TypeError instance

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
Retrieved: 2026-03-21
Data size (bytes): 154126
Extracted technical lines: "The TypeError object represents an error when a value is not of the expected type." (MDN)

ATTRIBUTION
Content derived from MDN Web Docs (TypeError); retrieved 2026-03-21; data size: 154126 bytes.