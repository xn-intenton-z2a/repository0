DOCUMENT: RANGE_ERROR

Table of Contents
1. Purpose and Applicability
2. When to Throw RangeError (Concrete Rules)
3. Message Conventions and Patterns
4. Common JS APIs That Throw RangeError and Their Conditions
5. Implementation Patterns and Examples (No escaping or code blocks)
6. Troubleshooting and Diagnostics
7. Supplementary Technical Specifications
8. Reference Details (Exact Signatures, Parameters, Returns, Exceptions)
9. Digest and Retrieval Metadata
10. Attribution and Data Size

1. Purpose and Applicability
RangeError indicates that a value is not within the set or range of allowed values for an operation. Use for numeric bounds, invalid lengths, and invalid option ranges where TypeError or custom errors are inappropriate.

2. When to Throw RangeError (Concrete Rules)
- When a numeric argument falls outside inclusive or exclusive bounds required by an API (e.g., negative length where only non-negative allowed).
- When an index or offset is outside [0, length] or equivalent logical bounds for operations on buffers, arrays, or typed arrays.
- When a requested precision, radix, or exponent is outside supported ranges.
- When a length parameter causes resource-allocation decisions to be invalid (e.g., attempting to create arrays with negative length or too-large length exceeding implementation limits).
- When parsing or decoding operations receive count/limit values exceeding protocol or format limits.

3. Message Conventions and Patterns
- Messages should be short, precise, and include the offending parameter name and allowed range.
- Pattern: "<param>: <actual> is out of range [<min>, <max>]" or for open bounds "<param>: <actual> is less than minimum <min>".
- For API-consumer clarity include expected units where relevant (e.g., bytes, indices, digits).

4. Common JS APIs That Throw RangeError and Their Conditions
- Array and TypedArray constructors: negative or non-finite lengths.
- Number methods expecting finite integers (where applicable): invalid radices, exponents outside permitted range.
- String methods that accept indices or lengths: invalid start/end that cannot be normalized into valid slice ranges for the engine.
- JSON and parsing-related primitives may throw RangeError when recursion depth or size limits are exceeded in specific implementations.

5. Implementation Patterns and Examples (No escaping or code blocks)
- Validate early: check range preconditions at the start of the function and throw RangeError before any side-effects or allocations occur.
- Normalize inputs when possible: clamp values or convert floats to integers only if the API contract allows; otherwise throw RangeError with precise message.
- Use built-in RangeError constructor with the message pattern defined above.
- Distinguish from TypeError: if the type is wrong, throw TypeError; if the type is correct but value out of allowed numeric range, throw RangeError.

6. Troubleshooting and Diagnostics
- When users report RangeError, capture the parameter name, its value, and the expected range; reproduce with minimal inputs.
- Instrument the code path to log input validation gates and allocation sizes leading up to the throw.
- For allocation failures, verify platform limits (maximum array length, memory ceilings) and validate inputs against conservative maxima early.

7. Supplementary Technical Specifications
- RangeError is an Error subtype; stack traces should include throwing location. It inherits from Error and sets name to "RangeError".
- Use consistent localization keys if messages are localized; keep the raw message stable for programmatic parsing when necessary.

8. Reference Details (Exact Signatures, Parameters, Returns, Exceptions)
- Constructor: RangeError(message: string) -> RangeError instance. message recommended format: "param: actual is out of range [min, max]".
- Functions that validate bounds should document exact inclusive/exclusive boundaries and throw RangeError when violated.

9. Digest and Retrieval Metadata
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- Retrieved: 2026-03-07
- Extract size: ~3KB

10. Attribution and Data Size
- Content extracted and condensed from MDN RangeError documentation.
- Data size obtained during crawling: approximately 3 kilobytes.
