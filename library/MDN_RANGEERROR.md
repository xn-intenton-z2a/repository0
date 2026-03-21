NORMALISED EXTRACT

Table of contents:
- CONSTRUCTOR SIGNATURE
- PURPOSE AND SEMANTICS
- PROPERTIES
- WHEN TO THROW
- INTEROPERABILITY

CONSTRUCTOR SIGNATURE
RangeError([message]) -> RangeError instance

PURPOSE AND SEMANTICS
- RangeError is a built-in error type intended to indicate that a value is outside the set or range of allowed values for a particular operation.
- Use RangeError when numeric arguments fall outside a permitted range (for example, negative where only non-negative values make sense) or when a numeric parameter exceeds implementation limits.

PROPERTIES
- name: "RangeError"
- message: optional string passed to the constructor
- instances inherit Error properties such as stack (engine-dependent)

WHEN TO THROW (implementation guidance)
- For the mission: when n is negative, throw new RangeError('n must be non-negative') to clearly indicate range violation.
- Throwing patterns: throw new RangeError('explain reason') where the message is developer-facing; tests should assert the class of the thrown error when required.

INTEROPERABILITY
- RangeError is standard across JS engines and should be caught and treated as an Error in try/catch blocks.

DETAILED DIGEST
Source: MDN "RangeError" retrieved 2026-03-21.
Data size fetched during crawl: approximately 157.0 KB.
Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError

ATTRIBUTION
Content adapted from MDN Web Docs. Retrieved 2026-03-21.
