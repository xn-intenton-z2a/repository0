# HAMMING_CORE

# Summary

Provide the canonical Hamming-distance library API as a single, authoritative feature specification implemented in src/lib/main.js and exercised by unit tests and the website demo. The feature exports hammingDistance, hammingDistanceBits, and a popcount helper; enforces strict, testable validation rules; correctly handles Unicode code points and BigInt-safe bit counting; and includes concise, deterministic error messages that unit tests and examples can match.

# Motivation

Ship a tiny, dependency-free JavaScript utility that correctly computes Hamming distances for Unicode strings (by code point) and for non-negative integers (by differing bits). Consolidating the core behaviour, error messages, and tests into one feature reduces duplication, makes the public API explicit, and supports the web demo, CLI, and examples.

# Specification

1. Public API
   - Export named functions from src/lib/main.js:
     - hammingDistance(a, b, options?)
     - hammingDistanceBits(x, y)
     - popcount(value)
   - All functions are synchronous, pure, and use no external dependencies.

2. hammingDistance(a, b, options?)
   - Signature:
     - hammingDistance(a: string, b: string, options?: { normalize?: false | "NFC" | "NFD" }) => number
   - Validation (throwing errors):
     - If typeof a !== 'string' or typeof b !== 'string' throw TypeError containing the word string.
     - If options is provided but is not an object (or is null) throw TypeError mentioning options.
     - If options.normalize is present and not one of false, "NFC", "NFD" throw TypeError mentioning normalize.
   - Unicode handling and length check:
     - If options.normalize is "NFC" or "NFD", call String.prototype.normalize on both inputs with that form prior to comparison.
     - Iterate code points using Array.from or the string iterator so surrogate pairs and astral characters are treated as single code points.
     - If the resulting code-point sequences have different lengths, throw RangeError whose message mentions length or equal.
   - Behaviour:
     - Compare code points pairwise and return a non-negative integer count of differing positions.
     - Empty strings are valid; comparing two empty strings returns 0.
   - Error messages and determinism:
     - Keep messages concise and include canonical keywords (string, options, normalize, length) so unit tests can reliably match substrings.

3. hammingDistanceBits(x, y)
   - Signature:
     - hammingDistanceBits(x: number | bigint, y: number | bigint) => number
   - Validation (throwing errors):
     - If an argument is neither typeof 'number' nor typeof 'bigint', throw TypeError mentioning number or integer.
     - If an argument is a Number but not Number.isInteger(arg), throw TypeError.
     - If any numeric input is negative (x < 0 or x < 0n), throw RangeError mentioning non-negative or negative.
   - Behaviour:
     - Convert Number inputs to BigInt before bitwise operations: bx = BigInt(x), by = BigInt(y).
     - Compute v = bx ^ by and return popcount(v) as a JavaScript Number.
     - Use the exported popcount helper for counting set bits.

4. popcount(value)
   - Signature:
     - popcount(value: bigint) => number
   - Validation (throwing errors):
     - If value is not typeof 'bigint', throw TypeError mentioning bigint or number.
     - If value < 0n, throw RangeError mentioning non-negative or negative.
   - Behaviour:
     - Return a JavaScript Number equal to the number of set bits in value's binary representation.
     - Implementation: use a precomputed 8-bit lookup table (length 256) and iterate over 8-bit chunks: while (v !== 0n) { count += table[Number(v & 0xffn)]; v >>= 8n; }
     - Include a commented fallback (Kernighan loop) for maintainers, but use the LUT for performance in the exported helper.

5. Errors and messages
   - TypeError for invalid types and malformed options; RangeError for unequal-length strings and negative integers.
   - Messages MUST include one of the canonical keywords: string, options, normalize, length, non-negative so tests can match reliably.

6. Tests and documentation
   - Unit tests (tests/unit/) to cover:
     - hammingDistance correct results: examples including karolin vs kathrin, empty strings, surrogate-pair characters, combining marks and normalization behaviour (a\u0301 vs á), and unequal-length error cases.
     - hammingDistanceBits correctness: Number and BigInt inputs, zeros, large BigInt values, and negative / non-integer error cases.
     - popcount correctness and parity: popcount(0n) === 0, popcount(1n) === 1, popcount(0xffn) === 8, popcount((1n << 100n) - 1n) === 100; error cases for wrong type and negative values; cross-check popcount(bx ^ by) === hammingDistanceBits(bx, by) for representative pairs.
   - README.md: update API section with signatures, validation rules, and short usage examples for hammingDistance (including normalize option), hammingDistanceBits, and popcount. Keep examples short and one-line where possible.
   - CLI and web demo examples should call the library functions rather than reimplementing validation.

# Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError (message contains length or equal)
- hammingDistance("a\u000301", "á") returns 1 without normalization and 0 with options.normalize set to "NFC"
- hammingDistance treats surrogate pairs and astral characters as single code points (e.g., "𐐷")
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits throws TypeError for non-number/non-bigint, TypeError for non-integer Numbers, and RangeError for negative values (message contains non-negative)
- popcount(0n) === 0, popcount(0xffn) === 8, popcount((1n << 100n) - 1n) === 100; passing a Number to popcount throws TypeError; negative BigInt throws RangeError
- Unit tests in tests/unit/ cover the above cases and pass locally
- README contains API docs and concise usage examples for hammingDistance, hammingDistanceBits, and popcount

# Files touched (recommended)

- src/lib/main.js — implement and export hammingDistance, hammingDistanceBits, and popcount; include CLI entrypoint behavior if present
- tests/unit/main.test.js and tests/unit/hamming.test.js — ensure tests align with deterministic messages and add popcount.test.js
- README.md — update API and examples
- docs/lib-browser.js (via build:web) will continue to be generated from the authoritative implementation

# Notes

- Use Array.from for code-point iteration and BigInt-based XOR combined with the LUT popcount for performance and determinism.
- Keep runtime footprint tiny and avoid external dependencies.
- Preserve existing behaviour relied upon by other features; do not change function signatures or error classes.
