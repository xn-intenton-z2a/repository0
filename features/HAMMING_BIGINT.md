# HAMMING_BIGINT

Status: IMPLEMENTED

Purpose
Document and specify BigInt behaviour for the integer Hamming API so callers can rely on precise bit-level results for values beyond Number.MAX_SAFE_INTEGER.

Scope
- hammingDistanceInt accepts BigInt values and non-negative Number integers; mixing Number and BigInt is supported.
- Implementation performs coercion to BigInt for XOR and bit counting when necessary.
- Validation: fractional Numbers throw TypeError; negative Number or negative BigInt throw RangeError.

Behavior
- Inputs:
  - Number integers: must satisfy Number.isInteger and be >= 0
  - BigInt: must be >= 0n
- Mixing: one Number and one BigInt coerces the Number to BigInt for internal computation.
- Bit counting must use BigInt-safe operations to avoid precision loss for large operands.

Testing and acceptance criteria
- hammingDistanceInt between 1n and 4n equals 2
- hammingDistanceInt between 1 and 4 equals 2
- hammingDistanceInt between 0 and 0 equals 0
- hammingDistanceInt between 3 and 3n equals 0
- Passing BigInt values beyond Number.MAX_SAFE_INTEGER works without precision loss
- Fractional Number inputs produce TypeError
- Negative integer inputs (Number or BigInt) produce RangeError
- Unit tests cover mixed Number/BigInt inputs and very large BigInt operands

Notes
- Tests and docs should demonstrate BigInt usage in README and in tests/unit/bigint.test.js
