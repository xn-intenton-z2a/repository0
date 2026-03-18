# HAMMING_BIGINT

Status: IMPLEMENTED

Purpose
Provide and document native BigInt support for the integer Hamming API so callers can compute bit-level Hamming distances for values larger than Number.MAX_SAFE_INTEGER.

Scope
- The public API hammingDistanceInt(a, b) accepts Number integers (Number.isInteger) and BigInt values.
- Mixing Number and BigInt is supported and yields numeric counts.
- Validation: TypeError for non-integer Number or unsupported types; RangeError for negative values.

Behavior and validation
- Inputs:
  - Number integers: must satisfy Number.isInteger and be >= 0
  - BigInt: must be >= 0n
  - Mixing: one argument Number and the other BigInt is allowed; implementation coerces to BigInt for XOR and bit counting.
- Errors:
  - TypeError for non-number/non-BigInt types or fractional Numbers
  - RangeError for negative values

Testing
- Unit tests cover Number, BigInt, and mixed cases and assert exact numeric results and thrown error types.

Acceptance Criteria
- hammingDistanceInt(1n, 4n) === 2
- hammingDistanceInt(1, 4) === 2
- hammingDistanceInt(0, 0) === 0
- hammingDistanceInt(3, 3n) === 0
- Passing BigInt values beyond Number.MAX_SAFE_INTEGER works without loss of precision
- Unit tests exist that assert TypeError for fractional Number inputs and RangeError for negative values
- Public API remains exported as named export from src/lib/main.js

Notes
- This feature was implemented and validated by the merged issue that added BigInt support; tests should remain in place to guard regressions.
