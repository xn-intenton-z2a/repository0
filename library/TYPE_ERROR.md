TITLE: TYPE_ERROR

Table of contents:
1. Normalised extract (core implementation facts)
2. Supplementary details (implementation patterns & when to use)
3. Reference details (API signatures, properties, runtime behaviour)
4. Troubleshooting & best practices
5. Digest (source, retrieval date, bytes retrieved)
6. Attribution

1) Normalised extract (core implementation facts)
- TypeError is a built-in Error subtype used when an operation cannot be performed because a value is not of the expected type.
- Constructor signature: TypeError([message]) -> returns a TypeError instance with properties: name = "TypeError", message = provided string or empty string, stack = engine-generated stack trace (string or undefined).
- Runtime situations that raise TypeError (non-exhaustive but actionable):
  - Attempting to call a non-callable value (e.g., calling x() when x is not a function).
  - Accessing or setting properties on null or undefined (runtime reports "cannot read properties of undefined" as TypeError).
  - Using invalid operand types where the operation requires specific types (e.g., numeric operation on non-coercible object where runtime disallows it).
  - Using new on a non-constructible value (where engine enforces constructibility rules).
- Throwing from application code: use new TypeError(message) to signal invalid argument types from public APIs.

2) Supplementary details (implementation patterns & when to use)
- Prefer TypeError to indicate incorrect parameter types passed to functions: validate inputs and throw TypeError with precise message describing expected type and received value.
- Distinguish from RangeError: use RangeError for numeric limits (out-of-range numeric arguments), TypeError for incorrect type shape/contract.
- Pattern for public API input validation: check Number.isInteger(n) -> if false throw new TypeError('n must be integer'); if n < 0 throw new RangeError('n must be non-negative').
- When consuming third-party modules, a runtime TypeError like "x is not a function" often indicates a mismatch between default vs named imports/exports — verify module export shape and import syntax.

3) Reference details (API signatures, properties, runtime behaviour)
- Constructor: TypeError([message])
  - Parameters: message (optional string)
  - Returns: Error instance whose .name is "TypeError" and .message is the provided message.
- Properties present on instances produced by engines: name (string), message (string), stack (string|undefined).
- ECMAScript behaviour: TypeError inherits from Error.prototype; instanceof TypeError is true for errors created via TypeError or thrown by engine as TypeError.
- Recommended usage patterns:
  - Validate and coerce inputs early. Throw TypeError for incorrect types, RangeError for out-of-range numeric values.
  - Include function name, parameter name, expected type, and received type/value in message for actionable errors.

4) Troubleshooting & best practices
- If you see "TypeError: X is not a function" or similar, check:
  - That imports/exports use correct named/default forms.
  - That the value is not undefined/null before calling methods on it.
  - That third-party packages expose the expected API (inspect module.exports in CommonJS interop or default/named shape in ESM).
- Use unit tests asserting thrown errors when invalid inputs are provided (e.g., assert that passing a non-integer to fizzBuzzSingle throws TypeError).

5) Digest
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
- Retrieval date: 2026-03-21
- Bytes retrieved during crawl: 154124

6) Attribution
- Content condensed and normalised from MDN Web Docs (TypeError) retrieved 2026-03-21 (154124 bytes). MDN: https://developer.mozilla.org/
