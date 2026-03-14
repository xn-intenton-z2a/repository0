TITLE: NUMBER_ISINTEGER

TABLE OF CONTENTS:
- Function signature
- Semantics and return values
- Edge cases
- Implementation notes
- Reference details
- Detailed digest
- Attribution

NORMALISED EXTRACT:
Signature: Number.isInteger(value) -> Boolean
Semantics: Returns true if typeof value is 'number' and value is a finite integer (no fractional component). Returns false for NaN, Infinity, -Infinity, non-number types, and numbers with fractional part.
Edge cases: Number.isInteger(5) -> true; Number.isInteger(5.0) -> true; Number.isInteger(5.1) -> false; Number.isInteger(NaN) -> false; Number.isInteger(Infinity) -> false.

IMPLEMENTATION NOTES:
- Implementation can be performed as: typeof value === 'number' && isFinite(value) && Math.floor(value) === value.
- Do not coerce strings or other types; Number.isInteger does not perform ToNumber coercion unlike global isFinite in older environments.

REFERENCE DETAILS:
- ECMAScript: Number.isInteger(value) official behaviour per ECMAScript spec.
- Use cases: validating integer parameters before indexing arrays, validating loop counts, guarding APIs that require integer inputs.

DETAILED DIGEST (MDN snapshot ~154.6 KB, retrieved 2026-03-14):
- MDN documents signature, examples, polyfills and related functions (Number.isSafeInteger, Number.parseInt). Retrieved 2026-03-14.

ATTRIBUTION:
Source: MDN Number.isInteger documentation. Data size: ~154.6 KB. Retrieved: 2026-03-14.
