# HAMMING_CORE

## Summary

Provide the core Hamming-distance library API: two named exports from src/lib/main.js — hammingDistance and hammingDistanceBits — with strict input validation, correct Unicode code-point handling, optional normalization, comprehensive unit tests, and clear README examples.

## Motivation

This feature delivers small, well-tested utilities for comparing textual and integer data using Hamming distance semantics. The library must behave predictably for Unicode strings and non-negative integers and be easy to verify via unit tests and demos.

## Specification

1. API
   - Export named functions: hammingDistance(a, b, options?) and hammingDistanceBits(x, y) from src/lib/main.js.
   - Each function must be pure and synchronous. options is optional and only used by hammingDistance.

2. hammingDistance(a, b, options?)
   - Signature: hammingDistance(a: string, b: string, options?: { normalize?: false | "NFC" | "NFD" }) => number
   - Validation:
     - If a or b is not a string, throw TypeError with a message containing the word "string".
     - If options is provided but not an object, throw TypeError mentioning "options".
     - If options.normalize is provided and is not one of false, "NFC", or "NFD", throw TypeError.
   - Normalization behaviour:
     - When options.normalize is "NFC" or "NFD", call String.prototype.normalize(form) on both inputs before further processing.
     - When options is omitted or options.normalize is false, compare raw code points (no normalization).
   - Code-point handling and length validation:
     - After optional normalization, convert inputs to arrays of Unicode code points using Array.from or spread into [...string].
     - If the resulting code-point sequences have different lengths, throw RangeError with a message mentioning "length" or "equal".
   - Behaviour:
     - Return an integer >= 0 equal to the count of positions where corresponding code points differ.
     - Empty strings are valid and return 0 when both are empty.

3. hammingDistanceBits(x, y)
   - Signature: hammingDistanceBits(x: number|BigInt, y: number|BigInt) => number
   - Validation:
     - If x or y is not a number or BigInt, throw TypeError with a message containing "number" or "integer".
     - If a numeric argument is not an integer (Number but not Number.isInteger), throw TypeError.
     - If x or y is negative, throw RangeError mentioning "non-negative" or "negative".
   - Behaviour:
     - Treat inputs as non-negative integers (Number or BigInt). Compute XOR and count set bits in the result using an efficient method (e.g., Kernighan's algorithm). Return the set-bit count as a non-negative integer.
     - Support BigInt inputs and adapt the same loop logic using BigInt arithmetic.

4. Errors
   - Use TypeError for invalid types and RangeError for invalid numeric ranges or unequal string lengths.
   - Error messages should be concise and include keywords (e.g., "string", "length", "non-negative") to make assertions in tests robust.

5. Documentation
   - Update README.md with a short API section describing both functions, their signatures, validation rules, the optional normalization option, and short examples demonstrating expected results. Include the core acceptance examples.

6. Tests
   - Update or add tests in tests/unit/main.test.js to cover:
     - Normal cases: typical strings and integers
     - Edge cases: empty strings, zero, large integers, astral-plane characters (emoji), combining sequences
     - Normalization cases: precomposed vs combining sequences with and without normalization
     - Error cases: non-string inputs, unequal-length strings, negative integers, non-integer numbers, invalid options
   - Tests must assert exact values or thrown error types (TypeError or RangeError) and check keywords in messages where useful.

## Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistance("a\u0301", "á") without options returns a non-zero distance
- hammingDistance("a\u0301", "á", { normalize: "NFC" }) returns 0
- Unicode surrogate pairs and astral characters are treated as single code points by hammingDistance
- TypeError is thrown for invalid argument types and invalid options
- RangeError is thrown for unequal-length strings and negative integers
- README contains API docs and examples for both functions including normalization examples
- Unit tests in tests/unit/main.test.js cover normal, edge, normalization and error cases and pass

## Implementation notes

- For string code points, use Array.from(string) or spread into [...string] to iterate code points rather than UTF-16 code units.
- For optional normalization use String.prototype.normalize(form) and then Array.from(normalizedString).
- For bit counting, implement Kernighan's algorithm for Number inputs and a BigInt loop for BigInt inputs.
- Keep implementation small and dependency-free to remain a single-file library export.

## Files to change

- src/lib/main.js: implement and export hammingDistance and hammingDistanceBits; add optional normalization behaviour for hammingDistance
- tests/unit/main.test.js: add unit tests matching the acceptance criteria (including normalization cases)
- README.md: document API, examples, CLI and Web demo links
- examples/: optional small demo for the website, but not required for initial acceptance

## Notes

- Normalization is opt-in to preserve existing behaviour for low-level use-cases. Tests must assert both default and normalized behaviours explicitly.
