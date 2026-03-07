RANGE_ERROR

NORMALISED EXTRACT

Table of contents
1. Definition and constructor
2. Conditions that cause RangeError to be thrown
3. Object shape and properties
4. Detection and handling patterns
5. Best practices and testing patterns

1. Definition and constructor
- RangeError is a built-in JavaScript error class used to indicate that a numeric value is outside an allowable range or that an argument value is not within the set or range expected by an API.
- Constructor signature: new RangeError(message?) -> returns an object with internal [[ErrorData]] containing message and name.
- Runtime: name property is the string "RangeError". message is the optional string provided by the caller.

2. Conditions that cause RangeError to be thrown
- Engine/host throws RangeError for invalid numeric ranges such as: array length values that are not non-negative safe integers (e.g., new Array(-1), new Array(2**32) in some engines).
- Numeric conversions that overflow allowed bounds (e.g., when implementing custom APIs that require value within [min, max]).
- Web APIs or built-in functions that explicitly validate ranges (e.g., TypedArray constructors when given out-of-range length/offsets, certain Web Crypto or DOM APIs with numeric constraints).
- Recursive operation depth/stack-size related conditions may be surfaced as RangeError in some engines (e.g., "Maximum call stack size exceeded" often reported as RangeError in V8).

3. Object shape and properties
- Instance properties:
  - name: "RangeError" (string)
  - message: string (may be empty string by default)
  - stack: engine-specific string showing stack frames (non-standard but de-facto present in V8 and others)
- Prototype: RangeError.prototype derives from Error.prototype. Methods: toString() (inherited from Error.prototype) yields "RangeError: <message>".
- Constructor available as global RangeError (callable with new). The class semantics are: RangeError instanceof Error === true, obj instanceof RangeError === true when constructed or thrown as RangeError.

4. Detection and handling patterns
- Create explicit checks and throw RangeError when validating numeric parameters:
  - throw new RangeError('n must be an integer >= 1')
- Validate with Number.isInteger(value) to ensure integerness; validate bounds with comparisons.
- Use instanceof RangeError or err.name === 'RangeError' when distinguishing errors in catch blocks.
- Preserve original error message when rethrowing or wrap with additional context while retaining cause where supported: throw new RangeError(`invalid n: ${n}`)

5. Best practices and testing patterns
- Prefer throwing Error subclasses (RangeError) rather than strings or non-Error objects.
- Provide precise messages that include parameter names and unexpected values.
- Test patterns:
  - Using assertion frameworks, assert that the function throws RangeError for invalid numeric inputs.
  - Use Number.isInteger and explicit boundary tests (0, -1, Infinity, NaN, values beyond safe integer range).

SUPPLEMENTARY DETAILS

- Exact constructor signature: RangeError([message: string]) -> RangeError
- Inheritance chain: RangeError.prototype.__proto__ === Error.prototype
- toString behavior: Error.prototype.toString.call(rangeErrorInstance) -> "RangeError: <message>"
- Compatibility notes: RangeError is standard ES language built-in available in all modern engines; message and stack formatting are engine-specific.

REFERENCE DETAILS

- Global constructor: RangeError
- Methods and properties (exact):
  - RangeError(message?) -> constructs an error object
  - RangeError.prototype.name: string "RangeError"
  - RangeError.prototype.message: string
  - RangeError.prototype.constructor -> RangeError
- Implementation patterns:
  - Validation pattern: if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be integer >= 1')
  - Detection in catch: if (err instanceof RangeError) { /* handle invalid-range */ }
- V8-specific: Error.captureStackTrace(err, constructorOpt) can be used to control stack trace generation and omission of constructor frames.

DETAILED DIGEST

Source section: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
Retrieved: 2026-03-07
Extracted technical content: definition, constructor signature, typical engine throw conditions (invalid array length, numeric bounds), object properties (name, message, stack), inheritance chain, detection and handling patterns, recommended validation with Number.isInteger and explicit boundaries.

ATTRIBUTION
- Source: MDN Web Docs — RangeError
- Retrieved: 2026-03-07
- Data size obtained during crawl: not recorded
