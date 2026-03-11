# HAMMING_CORE

# Summary

HAMMING_CORE specifies the canonical core feature that implements Unicode-aware Hamming distance for strings and bitwise Hamming distance for non-negative integers in src/lib/main.js. It defines precise validation rules, deterministic error keywords, a performant popcount helper, unit-test obligations, and the minimal docs and examples required for acceptance.

# Motivation

A compact, authoritative core feature ensures a single source of truth for the library API used by the CLI, web demo, examples, TypeScript declarations, and unit/behaviour tests. Tests must be able to assert behaviour using deterministic error message keywords and exact numeric outputs.

# Specification

## Public API

- Export named synchronous functions from src/lib/main.js:
  - hammingDistance(a: string, b: string, options?: { normalize?: false | "NFC" | "NFD" }): number
  - hammingDistanceBits(x: number | bigint, y: number | bigint): number
  - popcount(value: bigint): number
- No external dependencies; functions are pure and side-effect free.

## hammingDistance(a, b, options?)

Validation
- If typeof a !== 'string' or typeof b !== 'string' throw TypeError with message containing the substring string.
- If options is supplied but is not an object (or is null) throw TypeError mentioning options.
- If options.normalize is present and is not one of false, "NFC", "NFD", throw TypeError mentioning normalize.

Unicode handling
- When options.normalize is "NFC" or "NFD", call String.prototype.normalize(form) on both inputs before comparison.
- Compare by Unicode code points (use Array.from or the string iterator) so surrogate pairs and astral code points count as single positions.
- If the resulting code-point sequences differ in length, throw RangeError with a message containing length or equal.

Behaviour
- Compare corresponding code points by strict equality and return the number of differing positions as a non-negative Number.
- Empty strings are valid; identical empty strings return 0.
- Implementation may use Array.from(a) / Array.from(b) for clarity.

Deterministic error keywords: string, options, normalize, length (must appear in relevant errors)

## hammingDistanceBits(x, y)

Validation
- Accept Number (integer) or BigInt for each argument; otherwise throw TypeError that mentions number or integer.
- If an argument is typeof 'number' but not Number.isInteger(arg), throw TypeError.
- If any numeric value is negative, throw RangeError mentioning non-negative.

Behaviour
- Convert Number inputs to BigInt: bx = BigInt(x); by = BigInt(y). Reject negative BigInts (< 0n).
- Compute v = bx ^ by and return popcount(v) as a Number.
- Use popcount helper for the bit count.

## popcount(value)

Validation
- Require typeof value === 'bigint'; otherwise throw TypeError mentioning bigint or number.
- If value < 0n, throw RangeError mentioning non-negative.

Behaviour
- Return the count of set bits in value as a JavaScript Number.
- Recommended implementation: 256-entry byte lookup table and iterate over 8-bit slices until v === 0n. Include (commented) Kernighan fallback for maintainability.

## Errors

- TypeError for malformed types and option shapes.
- RangeError for unequal-length code-point sequences and negative integers.
- Error messages must include canonical substrings so tests can match reliably (string, options, normalize, length, non-negative).

# Tests and Documentation

Unit tests (tests/unit/) must cover:
- hammingDistance:
  - hammingDistance("karolin", "kathrin") === 3
  - hammingDistance("", "") === 0
  - hammingDistance("a", "bb") throws RangeError (message contains length or equal)
  - Normalization: hammingDistance("a\u0301", "á") === 1 without normalization and === 0 when options.normalize = "NFC"
  - Surrogate/astral characters: treat each astral code point as one position (e.g., emoji pairs)
- hammingDistanceBits:
  - hammingDistanceBits(1, 4) === 2
  - hammingDistanceBits(0, 0) === 0
  - Accept Number and BigInt inputs; throw TypeError for non-number/non-bigint; throw TypeError for non-integer Numbers; throw RangeError for negative values
- popcount:
  - popcount(0n) === 0
  - popcount(0xffn) === 8
  - popcount((1n << 100n) - 1n) === 100
  - popcount throws TypeError for Number input and RangeError for negative BigInt
- Cross-checks: for sampled pairs bx, by (Number or BigInt), assert popcount(bx ^ by) === hammingDistanceBits(bx, by)

README and examples
- README.md must document the three exports with signatures, validation rules, and one-line examples for hammingDistance (including normalize option), hammingDistanceBits, and popcount.
- examples/ scripts should import the named exports and be deterministic (used by unit tests and web demo). The CLI and web demo must import these functions rather than duplicating validation logic.

# Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError (message contains length or equal)
- hammingDistance("a\u0301", "á") returns 1 without normalization and 0 with options.normalize set to "NFC"
- Surrogate pairs and astral code points count as single positions
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits throws TypeError for non-number/non-bigint, TypeError for non-integer Numbers, and RangeError for negative values (message contains non-negative)
- popcount(0n) === 0, popcount(0xffn) === 8, popcount((1n << 100n) - 1n) === 100; passing a Number to popcount throws TypeError; negative BigInt throws RangeError
- Unit tests in tests/unit/ exercise and assert the above behaviours and pass locally
- README contains API docs and concise usage examples for hammingDistance, hammingDistanceBits, and popcount

# Files to change (minimal set)

- src/lib/main.js — implement the three exports and CLI entrypoint if present
- tests/unit/* — add or update unit tests to match deterministic error keywords and cases above
- README.md — document API and examples
- examples/* — deterministic example scripts that import and demonstrate behaviour

# Notes

- Keep implementation small and dependency-free: use Array.from for code points and BigInt XOR + LUT popcount for performance.
- Ensure error messages include canonical keywords so unit tests can rely on substring matching.
- Do not alter other unrelated files in the repository.
