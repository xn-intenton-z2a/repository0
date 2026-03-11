# HAMMING_CORE

# Summary

Provide the core Hamming-distance library API as two named exports from src/lib/main.js: hammingDistance and hammingDistanceBits. The feature specifies strict, testable input validation, correct Unicode code-point handling, BigInt-safe bit counting, and comprehensive unit tests and README documentation so users and automated tests can rely on exact behaviour.

# Motivation

Ship a small, dependency-free JavaScript utility that correctly computes Hamming distances for Unicode strings (by code point) and for non-negative integers (by differing bits). This core feature is the library's primary value and underpins the CLI, web demo, and TypeScript declarations already described elsewhere.

# Specification

1. Public API
   - Export named functions from src/lib/main.js:
     - hammingDistance(a, b, options?)
     - hammingDistanceBits(x, y)
   - Both functions must be synchronous and pure.

2. hammingDistance(a, b, options?)
   - Signature:
     - hammingDistance(a: string, b: string, options?: { normalize?: false | "NFC" | "NFD" }) => number
   - Validation rules (throwing errors):
     - If typeof a !== 'string' or typeof b !== 'string' throw TypeError containing the word string.
     - If options is provided but is not an object (or is null) throw TypeError mentioning options.
     - If options.normalize is present and not one of false, "NFC", "NFD", throw TypeError mentioning normalize.
   - Unicode handling and length check:
     - If options.normalize is "NFC" or "NFD", call String.prototype.normalize on both inputs with that form before iteration.
     - Always iterate code points using Array.from (or [...str]) so surrogate pairs and astral characters are treated as single code points.
     - If the resulting code-point arrays have different lengths, throw RangeError whose message mentions length or equal.
   - Behaviour:
     - Compare code points pairwise and return a non-negative integer count of differing positions.
     - Empty strings are valid and comparing two empty strings returns 0.
   - Deterministic error messages: keep messages concise and include the keywords used above to make unit tests robust.

3. hammingDistanceBits(x, y)
   - Signature:
     - hammingDistanceBits(x: number | BigInt, y: number | BigInt) => number
   - Validation rules (throwing errors):
     - If an argument is neither typeof 'number' nor typeof 'bigint', throw TypeError mentioning number or integer.
     - If an argument is a Number but not Number.isInteger(arg), throw TypeError.
     - If any numeric input is negative (x < 0 or x < 0n), throw RangeError mentioning non-negative or negative.
   - Behaviour:
     - Convert Number inputs to BigInt before bitwise operations: bx = BigInt(x), by = BigInt(y).
     - Compute v = bx ^ by and count set bits using an efficient algorithm (prefer Kernighan's loop: while (v) { v &= v - 1n; count++; }).
     - Return the bit count as a standard JavaScript Number (safe for realistic sizes used in tests).

4. Errors and messages
   - Use TypeError for invalid types and malformed options, RangeError for unequal-length strings and negative integers.
   - Messages should include one of the canonical keywords: string, options, normalize, length, non-negative to make tests stable.

5. Tests and documentation
   - Unit tests to add/ensure in tests/unit/:
     - tests/unit/main.test.js: import both functions and verify normal behaviour, edge cases, and error cases.
     - tests/unit/hamming.test.js: focused cases: Unicode astral characters (emoji, surrogate pairs), normalization examples (a\u0000 vs a + combining marks), empty strings, and large BigInt arguments.
   - README.md: update API section with signatures, validation rules, and short usage examples for both string and bit modes including normalization usage.
   - Ensure package scripts allow running unit tests with npm test and building the demo with npm run build:web.

# Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistance("a\u000301", "á") returns 1 when no normalization is applied and 0 when options.normalize is "NFC" (demonstrates normalization behaviour)
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistance treats surrogate pairs and astral characters as single code points (e.g., "𐐷" compared correctly)
- TypeError is thrown for invalid argument types and invalid options (messages include keywords)
- RangeError is thrown for unequal-length strings and negative integers
- Unit tests in tests/unit/ cover the above cases and pass locally
- README contains API docs and examples demonstrating normalization and bits usage

# Implementation notes

- Implementation should prefer clarity and correctness: use Array.from for code points and BigInt-based XOR + Kernighan for bit counts.
- Keep runtime footprint tiny and avoid external dependencies.
- Keep error message texts stable and brief so tests can match substrings (do not rely on full sentence equality).

# Files touched (recommended)

- src/lib/main.js — implement and export both functions and CLI entrypoints if present
- src/lib/main.d.ts — optional TypeScript declaration (see TYPESCRIPT_TYPES feature)
- tests/unit/main.test.js and tests/unit/hamming.test.js — add/ensure unit tests
- README.md — update API and examples

# Related features

- HAMMING_CLI.md — thin CLI wrapper reusing the same validation rules
- NORMALIZATION_OPTION.md — web demo and examples showing normalization effects
- TYPESCRIPT_TYPES.md — TypeScript declaration support and verification script

# Notes

This feature is the canonical core and must preserve existing behaviours relied upon by the other features; any changes should keep compatibility with the acceptance criteria above.