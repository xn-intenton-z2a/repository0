NORMALISED EXTRACT

Table of contents
1. Error classes: RangeError, TypeError
2. When to throw (validation rules for fizzBuzz)
3. Constructor and instantiation semantics
4. Best-practice validator snippets (plain text)
5. Reference details (signatures)
6. Detailed digest and attribution

1. Error classes
- TypeError: indicates an operation was attempted on a value of an inappropriate type. Typical constructor usage: new TypeError(message?). Thrown when inputs fail type checks (e.g., non-number, non-integer where integer required).
- RangeError: indicates a numeric value is outside the allowed range for a function. Typical constructor usage: new RangeError(message?). Thrown when numeric domain rules are violated (e.g., n < 0 for length/count parameters).

2. When to throw (validation rules for fizzBuzz)
- If input is not an integer: throw TypeError('n must be an integer')
- If input is a number but outside allowed range (negative): throw RangeError('n must be non-negative')
- n = 0 returns an empty array (valid input; no error)

3. Constructor and instantiation semantics
- new TypeError([message]) creates an Error object whose name property is 'TypeError' and whose message is the provided string.
- new RangeError([message]) creates an Error object whose name property is 'RangeError' and whose message is the provided string.
- Both constructors accept an optional message; include clear, actionable messages for tests and debugging.

4. Best-practice validator snippets (plain text)
- Input validation block example: if (!Number.isInteger(n)) throw new TypeError('n must be an integer'); if (n < 0) throw new RangeError('n must be non-negative')
- Unit tests should assert the error type not just the message: expect(() => fizzBuzz(1.2)).toThrow(TypeError); expect(() => fizzBuzz(-1)).toThrow(RangeError)

5. Reference details (exact signatures)
- TypeError(message?: string) -> TypeError
- RangeError(message?: string) -> RangeError

6. Detailed digest and attribution
- Sources fetched: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
- Retrieval date: 2026-03-19
- Bytes obtained in crawl (combined pages): 506331 bytes
- Attribution: MDN Web Docs (Mozilla). See the original pages for complete text and examples.
