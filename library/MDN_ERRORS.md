MDN_ERRORS

TABLE OF CONTENTS
- Normalised extract: TypeError and RangeError usage
- Constructors and signatures
- When to throw each error type
- Error object properties
- Examples of checks and throws (plaintext)
- Detailed digest (retrieved content)
- Attribution and data sizes

NORMALISED EXTRACT: TYPEERROR and RANGEERROR
- TypeError is intended for values that are not of the expected type. Use when an argument has the wrong primitive type.
- RangeError is intended for numeric values out of allowed range. Use when an argument is numerically invalid (e.g., negative when only non-negative permitted).

CONSTRUCTORS AND SIGNATURES
- new TypeError(message?): TypeError
  - message: optional string reason
  - produces an object whose name property is 'TypeError' and which inherits from Error.
- new RangeError(message?): RangeError
  - message: optional string reason
  - produces an object whose name property is 'RangeError' and which inherits from Error.

WHEN TO THROW
- For fizzBuzz contract:
  - if n is not an integer -> throw new TypeError('n must be integer')
  - if n < 0 -> throw new RangeError('n must be non-negative')
- Use instance checks in tests: expect(() => fn()).toThrow(TypeError) (see VITEST_GUIDE).

ERROR OBJECT PROPERTIES
- message: human-readable string
- name: constructor name, e.g., 'TypeError' or 'RangeError'
- stack: engine-provided stack trace string (not standardized in spec for formatting)

DETAILED DIGEST (crawled section)
- MDN pages document constructor forms, typical use cases, and examples showing construction and thrown errors.
- Retrieved: 2026-03-21
- Bytes fetched: TypeError page 154126 bytes; RangeError page 155937 bytes

ATTRIBUTION
- Sources:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError (154126 bytes)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError (155937 bytes)
