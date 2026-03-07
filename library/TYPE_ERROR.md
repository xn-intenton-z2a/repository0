TYPE_ERROR

NORMALISED EXTRACT

Table of contents
1. Definition and constructor
2. Common conditions that cause TypeError
3. Object shape and properties
4. Detection and handling patterns
5. Best practices and testing patterns

1. Definition and constructor
- TypeError is a built-in JavaScript error class used to indicate operations on values of an inappropriate type or invalid use of a value (e.g., calling a non-function as a function, reading properties of null/undefined where a value is required).
- Constructor signature: new TypeError(message?) -> returns an Error-derived object with name property set to "TypeError".

2. Common conditions that cause TypeError
- Calling a non-callable value as a function: e.g., var f = null; f()
- Attempting to access a property of null or undefined in strict access contexts; many host APIs throw TypeError for invalid receivers.
- Invalid operand types for built-in operations (e.g., using an object where a primitive is required in some internal steps) or violating internal method expectations.
- Attempting illegal property assignment on non-writable or non-extensible targets may result in TypeError in strict mode.
- Wrong this-binding for certain built-in methods may cause TypeError when the method expects particular receiver types.

3. Object shape and properties
- Instance properties:
  - name: "TypeError"
  - message: string
  - stack: engine-specific string with frames (not standardized)
- Prototype chain: TypeError.prototype -> Error.prototype
- toString: Error.prototype.toString yields "TypeError: <message>"

4. Detection and handling patterns
- Validate types before performing operations: use typeof, Array.isArray, and Number.isInteger as appropriate.
- Throw TypeError when an argument does not match an expected type: throw new TypeError('callback must be a function')
- In catch blocks, detect TypeError using instanceof TypeError or err.name === 'TypeError'.
- For API design: prefer TypeError for incorrect types and RangeError for out-of-range numeric values to allow precise consumer handling.

5. Best practices and testing patterns
- Use explicit defensive checks and clear messages: e.g., if (typeof cb !== 'function') throw new TypeError('cb must be a function')
- Tests should assert that invalid types cause TypeError and that valid inputs proceed.
- When rethrowing, preserve original error message or wrap with additional context but keep the error type meaningful.

SUPPLEMENTARY DETAILS

- Exact constructor signature: TypeError([message: string]) -> TypeError
- Inheritance chain: TypeError.prototype.__proto__ === Error.prototype
- toString behavior: Error.prototype.toString.call(typeErrorInstance) -> "TypeError: <message>"
- Engines: Broadly consistent across modern JS engines; message and stack formatting vary.

REFERENCE DETAILS

- Global constructor: TypeError
- Methods and properties (exact):
  - TypeError(message?) -> constructs the error object
  - TypeError.prototype.name: "TypeError"
  - TypeError.prototype.message: string
  - TypeError.prototype.constructor -> TypeError
- Implementation examples:
  - Guard: if (typeof x !== 'string') throw new TypeError('x must be string')
  - Catch detection: if (err instanceof TypeError) { /* handle type error */ }

DETAILED DIGEST

Source section: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
Retrieved: 2026-03-07
Extracted technical content: definition, constructor signature, typical throw scenarios (calling non-callable, invalid receivers, strict-mode assignment failures), object properties, detection patterns, and recommended use in APIs.

ATTRIBUTION
- Source: MDN Web Docs — TypeError
- Retrieved: 2026-03-07
- Data size obtained during crawl: not recorded
