TYPE_ERROR

Table of contents
- Purpose and definition
- Constructor and properties
- When to throw TypeError
- Handling and best practices

Purpose and definition
TypeError is an Error subclass used when a value is not of the expected type or when an operation is performed on an incompatible type.

Constructor and properties
- new TypeError(message?: string) -> TypeError with name='TypeError', message and stack. - Properties same shape as other Error subclasses.

When to throw TypeError
- Passing a non-integer where an integer is required. - Calling a non-function value as a function. - Accessing properties on null/undefined (engine throws TypeError).

Handling and best practices
- Validate types early: if (typeof x !== 'number') throw new TypeError('x must be number'); - Provide precise messages indicating expected and actual types. - Use instanceof TypeError in catch blocks when type mismatch handling is required.

Reference details
- Constructor: TypeError(message?: string) -> TypeError

Detailed digest
Source: MDN — TypeError (retrieved 2026-03-15). Raw HTML size: 158255 bytes.

Attribution and crawl data
- MDN Web Docs — TypeError. Retrieved 2026-03-15. 158255 bytes.
