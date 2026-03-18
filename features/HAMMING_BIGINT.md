# HAMMING_BIGINT

Purpose
Extend the integer Hamming API to accept and correctly handle BigInt values so the library can compute bit-wise distances for arbitrarily large integers.

Scope
- Modify hammingDistanceInt in src/lib/main.js to accept arguments of type Number (integer) or BigInt.
- Behavior rules:
  - If both inputs are Number integers, behaviour is unchanged.
  - If both inputs are BigInt, perform XOR and popcount using BigInt operations.
  - If one input is Number and the other is BigInt, coerce the Number to BigInt and compute using BigInt.
- Error handling: throw TypeError for non-integer Number values and for non-numeric types; throw RangeError for negative values (including negative BigInt).

Testing
- Add unit tests to tests/unit/hamming-bigint.test.js covering:
  - hammingDistanceInt(1n, 4n) => 2
  - hammingDistanceInt(1, 4n) => 2 (mixed types coerced correctly)
  - Decimal Number inputs (e.g., 1.5) throw TypeError
  - Negative BigInt (e.g., -1n) throws RangeError

Acceptance Criteria
- The library accepts BigInt inputs and returns correct bit distances (1n vs 4n => 2).
- Mixed Number/BigInt inputs are handled by coercing Number to BigInt and returning correct results.
- Tests verify error conditions and pass.
