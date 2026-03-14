# HAMMING_BITS

Purpose

Define the integer (bit-level) Hamming distance behaviour and validation for the library.

Summary

Provide a named export hammingBits(a, b) from src/lib/main.js that computes the Hamming distance between two non-negative integers by counting differing bits.

Behaviour

- Accept exactly two arguments. Each argument must be an integer (Number) or BigInt.
- Treat inputs as non-negative integers; operate on BigInt internally for safety with large values.
- Compute distance by XOR-ing the two values and counting set bits (population count) in the result.
- Return 0 for identical values.

Validation

- If either argument is not an integer (neither Number integer nor BigInt), throw TypeError.
- If either integer is negative, throw RangeError.

Acceptance criteria (testable)

- hammingBits(1, 4) returns 2.
- hammingBits(0, 0) returns 0.
- hammingBits(255, 0) returns 8.
- Passing a negative integer (e.g., -1) throws RangeError.
- Passing a non-integer (e.g., 1.5 or '1') throws TypeError.
- Works with large integer values within JavaScript safe/BigInt ranges; tests include a value close to Number.MAX_SAFE_INTEGER and the same value as BigInt.

Notes

- Implementation may accept BigInt for large values; tests should exercise both Number and BigInt inputs where relevant.