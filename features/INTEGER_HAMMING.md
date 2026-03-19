# INTEGER_HAMMING

Purpose

Define the bit-level Hamming distance API and behavior for non-negative integers. This feature specifies exact behavior, validation rules, examples, and acceptance criteria.

Behavior

- Export a named function intHamming(x, y) from src/lib/main.js that returns the number of differing bits between two non-negative integers.
- The function computes the Hamming weight (population count) of x XOR y. Accept Number (integer) or BigInt inputs; compute using BigInt internally for correctness on large values.

Input validation

- If either argument is not a Number (integer) or BigInt, throw TypeError.
- If either numeric argument is negative, throw RangeError.

Examples (for tests)

- intHamming(1, 4) -> 2  (binary: 001 vs 100)
- intHamming(0, 0) -> 0
- intHamming(7, 15) -> 1  (0111 vs 1111)

Acceptance criteria

- Bit-level Hamming distance between 1 and 4 is 2.
- Bit-level Hamming distance between 0 and 0 is 0.
- Passing negative integers throws RangeError.
- Passing non-integer or non-number/BigInt throws TypeError.

Implementation notes

- Convert Number inputs to BigInt before bit operations to avoid precision issues.
- Use a straightforward population-count loop on the xor result; prefer correctness and clarity over micro-optimisations.
