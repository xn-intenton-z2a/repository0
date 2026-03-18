# HAMMING_DISTANCE

Status: ACTIVE (implementation reference: issue #3103)

Purpose
Provide the canonical Hamming distance API for the library so callers can compute distances for equal-length Unicode strings and for non-negative integers (Number and BigInt).

Scope
- Export named functions from src/lib/main.js:
  - hammingDistanceString(a, b)
  - hammingDistanceInt(a, b)
- Unicode strings are compared by code points, not UTF-16 code units.
- Integer comparison supports Number integers and BigInt values; mixing Number and BigInt is allowed and handled deterministically.
- Errors:
  - TypeError for incorrect argument types (non-string to string API, non-integer Number for integer API, unsupported types)
  - RangeError for unequal-length strings or negative integer inputs

Behavior and validation
- hammingDistanceString:
  - Accepts two strings. Compare by Unicode code points; if code-point lengths differ, throw RangeError.
  - Non-string inputs throw TypeError.
- hammingDistanceInt:
  - Accepts two non-negative integers. Accepts Number integers (Number.isInteger) and BigInt; fractional Numbers throw TypeError; negative values throw RangeError.
  - When mixing Number and BigInt, implementation coerces to BigInt for bitwise XOR and bit counting so results are precise.

Edge cases
- Empty strings: two empty strings return 0.
- Zero integers: 0 vs 0 returns 0.
- Unicode multi-code-point graphemes are compared by individual code points; normalization is opt-in (see HAMMING_DOCS).
- Very large integers are supported via BigInt without loss of precision.

Testing
- Unit tests must cover normal vectors, edge cases, and all error paths. Tests should live under tests/unit/ and reference exported names from src/lib/main.js.

Acceptance Criteria (testable)
- hammingDistanceString between karolin and kathrin is 3
- hammingDistanceString between an empty string and an empty string is 0
- hammingDistanceString called with strings of different code-point lengths throws RangeError
- hammingDistanceInt between 1 and 4 returns 2
- hammingDistanceInt between 0 and 0 returns 0
- hammingDistanceInt between 1n and 4n returns 2
- Mixing Number and BigInt yields the same numeric count (for example, 3 and 3n => 0)
- Both functions are exported as named exports from src/lib/main.js
- README documents usage examples for both APIs

Notes
- This feature is the canonical source of truth for core behavior; other feature files (BigInt, CLI, docs) must align with these acceptance criteria.
