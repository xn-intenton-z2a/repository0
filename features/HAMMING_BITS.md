# HAMMING_BITS

Purpose

Specify the behaviour for counting differing bits between two non-negative integers. This feature documents the integer-based Hamming distance API, validation rules, and acceptance criteria.

Behavior

- Export a named function hammingBits(x, y) from src/lib/main.js.
- Accept exactly two arguments. Both must be integers and non-negative.
- Compute the Hamming distance by XOR-ing the two integers and counting set bits (population count) in the result.
- Return 0 if values are identical.

Inputs and Validation

- If either argument is not a number or not an integer, throw TypeError.
- If either integer is negative, throw RangeError.
- Work correctly for zero and for large non-negative integers that fit in JavaScript safe integer range; tests should include edge examples.

Acceptance criteria

- hammingBits(1, 4) returns 2 (binary 001 vs 100 differ in two bit positions).
- hammingBits(0, 0) returns 0.
- hammingBits(255, 0) returns 8.
- Passing negative integers throws RangeError.
- Passing non-integer numbers (e.g., 1.5) or non-number types throws TypeError.

Test notes

- Use explicit integer values in tests and include a test for a large integer within Number.MAX_SAFE_INTEGER.
