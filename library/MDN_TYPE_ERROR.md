NORMALISED EXTRACT

Concept: TypeError (JavaScript built-in)

Definition
TypeError is a standard built-in error type thrown when an operation cannot be performed, typically because a value is not of the expected type (for example calling a non-function, invalid operands).

Table of contents
1. Construction and signature
2. Typical causes
3. Handling and best practices

Detailed technical content
1. Construction and signature
- Create using new TypeError(message)
- TypeError.prototype.name === 'TypeError'

2. Typical causes
- Passing non-number or non-integer inputs where a number is required.
- Attempting to call undefined as a function.
- Invalid operand types for built-in operations.

3. Handling and best practices
- Validate input types early and throw TypeError with a clear message (e.g., 'n must be an integer').
- Use Number.isInteger to determine if a numeric value is an integer; if not, throw TypeError.
- Use instance checks: if (err instanceof TypeError) { ... }

SUPPLEMENTARY DETAILS

Mission-specific usage
- For fizzBuzz and fizzBuzzSingle, if input is not an integer (Number.isInteger returns false), throw TypeError('n must be an integer'). Reserve RangeError for out-of-range numeric inputs (e.g., negative numbers).

REFERENCE DETAILS

Exact usage
- new TypeError(message) -> TypeError instance
- Property: name = 'TypeError'

Detailed digest
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
- Retrieved: 2026-03-18
- Bytes downloaded during crawl: 154122

Attribution
Content condensed from MDN Web Docs TypeError documentation.