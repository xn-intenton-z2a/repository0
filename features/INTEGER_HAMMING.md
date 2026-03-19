# INTEGER_HAMMING

Purpose

Define the bit-level Hamming distance API and behavior for non-negative integers. This feature specifies how to compute differing bits, validation rules, examples, and acceptance criteria.

Behavior

- Export a named function integerHamming(x, y) from src/lib/main.js that returns the number of differing bits between two non-negative integers.
- The function counts differing bits in the binary representation of x and y (Hamming weight of x XOR y).

Input validation

- If either argument is not a finite integer number, throw TypeError.
- If either argument is negative, throw RangeError.

Examples (for tests)

- integerHamming(1, 4) -> 2  (binary: 001 vs 100)
- integerHamming(0, 0) -> 0
- integerHamming(7, 15) -> 1  (0111 vs 1111)

Acceptance criteria

- Bit-level Hamming distance between 1 and 4 is 2.
- Bit-level Hamming distance between 0 and 0 is 0.
- Passing negative integers throws RangeError.
- Passing non-integer (e.g., 1.5) or non-number throws TypeError.

Notes for implementation

- Use an efficient population-count method for x ^ y; library document BIT_TWIDDLING_POPCOUNT.md may be used for guidance, but readability and correctness are primary.
- Tests should include small, zero, and large integers to ensure correctness and performance.
