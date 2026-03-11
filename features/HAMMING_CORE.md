# HAMMING_CORE

# Summary

Provide the core Hamming-distance library API: two named exports from src/lib/main.js — hammingDistance and hammingDistanceBits — with strict input validation, correct Unicode code-point handling, comprehensive unit tests, and clear README examples.

# Motivation

Deliver a small, well-tested utility library for computing Hamming distance on text (by code point) and on integers (by bit differences). The API must be deterministic, dependency-free, and suitable for both programmatic use and CLI/web demonstration.

# Specification

1. API
   - Export named functions: hammingDistance(a, b, options?) and hammingDistanceBits(x, y) from src/lib/main.js.
   - Each function must be pure and synchronous. options is optional and used only by hammingDistance for normalization.

2. hammingDistance(a, b, options?)
   - Signature: hammingDistance(a: string, b: string, options?: { normalize?: false | "NFC" | "NFD" }) => number
   - Validation:
     - If a or b is not a string, throw TypeError with the word "string" in the message.
     - If options is provided but not an object (or is null), throw TypeError mentioning "options".
     - If options.normalize is provided and is not one of false, "NFC", or "NFD", throw TypeError mentioning "normalize".
   - Unicode handling and length validation:
     - When normalization is applied (see options), normalize both inputs first using String.prototype.normalize(form) and then iterate code points with Array.from or [...string].
     - Without normalization, iterate code points directly using Array.from to ensure astral characters are treated as single code points.
     - If the resulting code-point sequences have different lengths, throw RangeError with a message mentioning "length" or "equal".
   - Behaviour:
     - Return an integer >= 0 equal to the count of positions where corresponding code points differ.
     - Empty strings are valid and return 0 when both are empty.

3. hammingDistanceBits(x, y)
   - Signature: hammingDistanceBits(x: number|BigInt, y: number|BigInt) => number
   - Validation:
     - If x or y is not a number or BigInt, throw TypeError with a message containing "number" or "integer".
     - If a numeric (Number) argument is not an integer (Number but not Number.isInteger), throw TypeError.
     - If x or y is negative, throw RangeError mentioning "non-negative" or "negative".
   - Behaviour:
     - Treat inputs as non-negative integers (Number or BigInt). Compute XOR and count set bits in the result efficiently (Kernighan's algorithm or equivalent). Support BigInt inputs and return a standard JavaScript Number for the bit count.

4. Errors
   - Use TypeError for invalid types and RangeError for unequal string lengths or negative integers.
   - Error messages should be concise and include keywords (string, options, normalize, length, non-negative) to make tests robust.

5. Documentation and tests
   - Update README.md with a short API section describing both functions, their signatures, validation rules, the optional normalization option, and short examples demonstrating expected results.
   - Add unit tests in tests/unit/main.test.js that cover normal cases, edge cases (empty strings, zero, large integers), Unicode astral characters, normalization behaviour, and error cases.

# Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Unicode surrogate pairs and astral characters are treated as single code points by hammingDistance
- TypeError is thrown for invalid argument types and invalid options
- RangeError is thrown for unequal-length strings and negative integers
- README contains API docs and examples for both functions including normalization examples
- Unit tests in tests/unit/main.test.js cover normal, edge, normalization and error cases and pass
