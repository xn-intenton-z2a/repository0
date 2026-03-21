MDN_ERRORS

1) Normalised extract

Table of contents:
- RangeError
- TypeError
- Constructor signatures
- Usage patterns and testing

RangeError:
- Constructor: RangeError([message]) -> RangeError object
- Use case: thrown when a numeric value is outside of an allowed range (for example, invalid array length, numeric parameter out of domain).
- Pattern for FizzBuzz: when n < 0, throw new RangeError('n must be >= 0') to indicate an out-of-range numeric argument.

TypeError:
- Constructor: TypeError([message]) -> TypeError object
- Use case: thrown when an operation or function receives a value of an unexpected type (e.g., non-integer where integer required).
- Pattern for FizzBuzz: when n is not an integer (Number.isInteger(n) === false), throw new TypeError('n must be an integer').

Constructor behavior and testability:
- Both RangeError and TypeError inherit from Error.
- Instantiation: new RangeError(message), new TypeError(message).
- Tests can assert exact subclass by using toThrow(RangeError) or toThrow(TypeError) in unit tests.

2) Supplementary details
- Error message content should be specific and include the parameter name and expectations (e.g., 'n must be an integer >= 0').
- Use specific Error subclasses rather than generic Error to allow fine-grained test assertions.
- Use instanceof checks in catch blocks if caller logic depends on specific error types.

3) Reference details
- RangeError signature: new RangeError(message?: string) -> RangeError
- TypeError signature: new TypeError(message?: string) -> TypeError
- Both have prototype chain: value instanceof Error === true; value instanceof RangeError === true for RangeError instances.

4) Detailed digest
- Sources:
  - RangeError MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - TypeError MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
- Retrieved: 2026-03-21
- Data sizes fetched: RangeError 155937 bytes; TypeError 154126 bytes
- Extracted content: MDN pages document constructor signatures, usage guidance, inheritance, and examples for throwing and testing these error types.

5) Attribution
- Attribution: MDN Web Docs; retrieved 2026-03-21; raw HTML captured during crawl as specified above.
