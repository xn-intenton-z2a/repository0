RANGE_ERROR

Table of contents
- Description and intended use
- Constructor signature and properties
- When to throw RangeError
- Examples of messages and handling
- Best practices for APIs

Description and intended use
RangeError is an Error subclass used when numeric values are outside of allowable ranges (e.g., invalid array length, numeric bounds).

Constructor signature and properties
- new RangeError(message?: string) -> RangeError object with name='RangeError', message string, and stack trace. - Properties: name (string), message (string), stack (string, engine-specific).

When to throw RangeError
- Input numeric parameter outside documented inclusive range. - Invalid array length like new Array(-1) (engine throws RangeError). - When a parameter that must be within [min,max] is provided outside that range.

Examples of messages and handling
- throw new RangeError('N must be >= 1'); - Catching: try { ... } catch (e) { if (e instanceof RangeError) handleRange(); else throw e; }

Best practices for APIs
- Use RangeError to signal out-of-range numeric inputs. - Provide clear message with parameter name, expected bounds, and actual value. - Prefer typed validation before performing operations that would cause engine RangeError.

Reference details
- Constructor: RangeError(message?: string) -> RangeError
- Standard properties: name: 'RangeError', message: string, stack: string (non-standard engines vary)

Detailed digest
Source: MDN — RangeError (retrieved 2026-03-15). Raw HTML size: 160123 bytes.

Attribution and crawl data
- MDN Web Docs — RangeError. Retrieved 2026-03-15. 160123 bytes.
