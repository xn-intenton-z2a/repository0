# HAMMING_CORE

# Summary

Provide the canonical, authoritative Hamming-distance feature that implements the library's core functions in src/lib/main.js and documents their behaviour, validation rules, and examples. This feature consolidates the popcount helper, Unicode-aware string comparison, integer/BigInt bit comparisons, deterministic error messages, and example usage suitable for unit tests and the web demo.

# Motivation

A single, well-specified core feature prevents duplication across the codebase and ensures consistent, testable behaviour for the library, CLI, web demo, examples, and TypeScript declarations. It sets deterministic error message keywords so unit tests and examples can reliably assert outcomes.

# Specification

1. Public API
   - Export the following named synchronous functions from src/lib/main.js:
     - hammingDistance(a: string, b: string, options?: { normalize?: false | "NFC" | "NFD" }) => number
     - hammingDistanceBits(x: number | bigint, y: number | bigint) => number
     - popcount(value: bigint) => number
   - Each function is pure, has no side effects, and uses no external dependencies.

2. hammingDistance(a, b, options?)
   - Validation:
     - If typeof a !== 'string' or typeof b !== 'string', throw TypeError whose message includes the keyword string.
     - If options is provided and is not a non-null object, throw TypeError including options.
     - If options.normalize is present and not one of false, "NFC", "NFD", throw TypeError including normalize.
   - Unicode handling and normalization:
     - When options.normalize is "NFC" or "NFD", call String.prototype.normalize on both inputs with that form prior to comparison.
     - Iterate over code points using Array.from or the string iterator so surrogate pairs and astral characters count as single code points.
     - If code-point sequence lengths differ, throw RangeError whose message contains length or equal.
   - Behaviour:
     - Compare code points pairwise using strict equality and return the count of differing positions as a non-negative integer.
     - Empty strings are valid and return 0 when equal.
   - Determinism:
     - Error messages must contain canonical keywords (string, options, normalize, length) so tests can match substrings reliably.

3. hammingDistanceBits(x, y)
   - Validation:
     - If an argument is neither typeof 'number' nor typeof 'bigint', throw TypeError mentioning number or integer.
     - If an argument is a Number but not Number.isInteger(arg), throw TypeError.
     - If any numeric argument is negative, throw RangeError mentioning non-negative or negative.
   - Behaviour:
     - Convert Number inputs to BigInt: bx = BigInt(x); by = BigInt(y). Validate bx >= 0n and by >= 0n.
     - Compute v = bx ^ by and return popcount(v) coerced to a JavaScript Number.
     - Use the exported popcount helper for counting set bits.

4. popcount(value)
   - Validation:
     - If value is not typeof 'bigint', throw TypeError mentioning bigint or number.
     - If value < 0n, throw RangeError mentioning non-negative or negative.
   - Behaviour:
     - Return the number of set bits in value as a JavaScript Number.
     - Implementation guidance: use a precomputed 256-entry byte lookup table and iterate over 8-bit chunks: while (v !== 0n) { count += table[Number(v & 0xffn)]; v >>= 8n; }.
     - Include a commented fallback (Kernighan loop) for maintainers but keep the LUT for performance.

5. Errors
   - Use TypeError for malformed types and options, RangeError for negative numbers and unequal-length strings.
   - Error messages must include one of the canonical keywords: string, options, normalize, length, non-negative so tests can match reliably.

# Tests and Documentation

- Unit tests in tests/unit/ must cover:
  - hammingDistance examples: karolin vs kathrin => 3; empty strings => 0; unequal-length strings throw RangeError; composed vs decomposed sequences demonstrating normalization (a\u0301 versus á) with and without options.normalize set to NFC.
  - hammingDistance must treat surrogate pairs and astral characters as single code points.
  - hammingDistanceBits examples: 1 vs 4 => 2; 0 vs 0 => 0; Number and BigInt inputs; negative and non-integer Number validation errors.
  - popcount tests: popcount(0n) === 0; popcount(0xffn) === 8; popcount((1n << 100n) - 1n) === 100; type and negative value errors; cross-check popcount(bx ^ by) === hammingDistanceBits(bx, by) for representative pairs.
- README.md: include API signatures, validation rules, and short one-line usage examples for hammingDistance (with normalize option), hammingDistanceBits, and popcount.
- examples/ scripts and web demo should import these named exports rather than reimplementing validation.

# Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError (message contains length or equal)
- hammingDistance("a\u0301", "á") returns 1 without normalization and 0 with options.normalize set to "NFC"
- hammingDistance treats surrogate pairs and astral characters as single code points
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits throws TypeError for non-number/non-bigint, TypeError for non-integer Numbers, and RangeError for negative values (message contains non-negative)
- popcount(0n) === 0, popcount(0xffn) === 8, popcount((1n << 100n) - 1n) === 100; passing a Number to popcount throws TypeError; negative BigInt throws RangeError
- Unit tests in tests/unit/ cover the above cases and pass locally
- README contains API docs and concise usage examples for hammingDistance, hammingDistanceBits, and popcount

# Files touched (recommended)

- src/lib/main.js — implement and export hammingDistance, hammingDistanceBits, and popcount; include CLI entrypoint elsewhere if present
- tests/unit/main.test.js and tests/unit/hamming.test.js — ensure tests align with deterministic messages and include popcount tests
- README.md — update API and examples
- examples/ and src/web/ demos should import from the canonical implementation

# Notes

- Prefer Array.from for clarity when iterating code points and BigInt XOR + LUT popcount for bit counting.
- Keep runtime footprint small and avoid external dependencies.
- Maintain deterministic, concise error messages so tests and examples can assert substrings.
