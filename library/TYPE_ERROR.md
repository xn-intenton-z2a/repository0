NORMALISED EXTRACT:
Constructor, semantics, and common causes
- Signature: new TypeError([message]) -> TypeError object
- Purpose: represent an error when a value is not of the expected type or when an operation is performed on an incompatible type.

TABLE OF CONTENTS:
1. Constructor and properties
2. Common throwing scenarios
3. Detection and handling patterns
4. Best practices

DETAILED CONTENT:
1. Constructor and properties
- TypeError accepts an optional message string and inherits from Error. Standard properties: name ("TypeError"), message, stack.

2. Common throwing scenarios
- Invoking a non-callable value as a function.
- Accessing properties of null or undefined (engine-dependent behaviours leading to TypeError).
- Using invalid operands for operators that require specific types (for example, invalid use of typed APIs expecting objects).
- Methods that explicitly validate argument types will throw TypeError when types mismatch.

3. Detection and handling patterns
- Use instanceof TypeError or err.name === 'TypeError' in catch blocks to distinguish errors.
- Prefer pre-call type checks (typeof, Array.isArray, or user-defined validators) for clearer error messages instead of relying on native thrown TypeError.

4. Best practices
- Use TypeError for API contract violations related to types; use RangeError for numeric domain violations.
- When rethrowing or wrapping TypeError, preserve original message and include context to aid diagnostics.

SUPPLEMENTARY DETAILS:
- Serialization: TypeError objects serialize the message and stack in engine-specific formats; do not rely on message text for program logic.
- Cross-platform considerations: the exact throwing points can vary across JS engines, so rely on tests and input validation.

REFERENCE DETAILS (SPEC):
- Constructor: TypeError([message: string]) -> TypeError
- Use-cases: invalid invocation, property access on null/undefined, wrong-type arguments
- Detection: err instanceof TypeError; err.name === 'TypeError'

DETAILED DIGEST:
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
Retrieved: 2026-03-17
Data retrieved: 154.5 KB (HTML)
Extracted technical points: constructor and property semantics, canonical causes, handling patterns, and best-practice distinctions from RangeError.

ATTRIBUTION:
Content extracted and condensed from MDN Web Docs (TypeError). Data size obtained during crawling: 154.5 KB.