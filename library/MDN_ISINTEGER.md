NORMALISED EXTRACT

Table of contents:
- SIGNATURE
- BEHAVIOUR (precise definition)
- USAGE NOTES
- POLYFILL
- TEST-INTEGRATION (how to use for fizzBuzz validation)

SIGNATURE
Number.isInteger(value) -> boolean

BEHAVIOUR (precise definition)
- Returns true iff the provided value is of type number, is a finite numeric value, and its mathematical value is an integer (no fractional component).
- Equivalent condition: typeof value === "number" && isFinite(value) && Math.floor(value) === value.
- Examples: Number.isInteger(3) -> true; Number.isInteger(3.0) -> true; Number.isInteger(3.1) -> false; Number.isInteger('3') -> false.

USAGE NOTES
- Use Number.isInteger for validating that an input is an integer before performing integer-only logic.
- Does not coerce strings or other types; this prevents accidental acceptance of '3' as an integer.
- Language availability: ECMAScript 2015 (ES6) and later; present in modern engines.

POLYFILL (implementation pattern)
If Number.isInteger is not present:
Number.isInteger = Number.isInteger || function(value) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value; }

TEST-INTEGRATION (for mission validation)
- Before calling fizzBuzz(n) or fizzBuzzSingle(n) assert Number.isInteger(n); if false, throw TypeError with a precise message such as "n must be an integer".

DETAILED DIGEST
Source: MDN "Number.isInteger()" retrieved 2026-03-21.
Data size fetched during crawl: approximately 155.2 KB.
Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger

ATTRIBUTION
Content adapted from MDN Web Docs with direct method signature and behavioral details. Retrieved 2026-03-21.
